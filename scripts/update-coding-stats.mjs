/**
 * Single entry point for every coding-stats artifact on the portfolio.
 *
 * Runs once a week (see .github/workflows/weekly-coding-stats.yml) and writes:
 *
 *   1. public/codolio-stats.json          - totals, global rank, streak, active days
 *   2. public/github-contribs/<user>.json - GitHub contribution heatmap
 *   3. public/platform-stats.json         - per-platform solved breakdown
 *
 * WHY TWO SOURCES
 * Codolio aggregates your DSA platforms (LeetCode, GeeksforGeeks, CodeChef,
 * Codeforces) and is the only place that exposes a global rank and a streak.
 * It does NOT expose GitHub at all, so the contribution heatmap has to come
 * from GitHub itself.
 *
 * These used to be two separate workflows writing the same
 * codolio-stats.json, which made them overwrite each other (the per-platform
 * job wrote rank:0/streak:0 and shrank totalActiveDays from 565 to ~143).
 *
 * SAFETY
 * The heatmap JSON shape ({contributions:[{date,count,contributionLevel}]})
 * is read directly by CodingDashboard, which derives the tooltip text from
 * data-date / data-count / data-title on the rendered cells. If a fetch fails
 * we keep the previously committed file rather than writing an empty one, so
 * a transient upstream failure can never blank out the production heatmap.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

const log = (...a) => console.log("[coding-stats]", ...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
function loadLocalEnv() {
  try {
    const raw = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  } catch {
    /* not present in CI, which uses repository/environment variables instead */
  }
}
loadLocalEnv();

const LC_USERNAME = process.env.VITE_LEETCODE_USERNAME || "prathamhanda";
const CF_HANDLE = process.env.VITE_CODEFORCES_USERNAME || "prathamhanda10";
const CC_USERNAME = process.env.VITE_CODECHEF_USERNAME || "prathamhanda";
const GITHUB_USERNAME = process.env.VITE_GITHUB_USERNAME || "prathamhanda";
const GFG_USERNAME = process.env.VITE_GFG_USERNAME || "prathamh";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (p, data) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
};

// ---------------------------------------------------------------------------
// 1. Codolio  ->  totals / rank / streak / active days
// ---------------------------------------------------------------------------
async function fetchCodolioViaApi() {
  const url =
    "https://api.codolio.com/profile?userKey=" + encodeURIComponent(LC_USERNAME);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Codolio API HTTP ${res.status}`);

  const json = await res.json();
  let profiles = json?.data?.platformProfiles || [];
  if (!Array.isArray(profiles) && Array.isArray(profiles?.platformProfiles)) {
    profiles = profiles.platformProfiles;
  }
  if (!Array.isArray(profiles) || profiles.length === 0) {
    throw new Error("Codolio API returned no platform profiles");
  }

  let totalSolved = 0;
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;
  let rank = 0;
  let streak = 0;
  const activeDayKeys = new Set();

  for (const p of profiles) {
    const s = p?.totalQuestionStats || {};
    const total = typeof s.totalQuestionCounts === "number" ? s.totalQuestionCounts : null;
    const e = s.easyQuestionCounts || 0;
    const m = s.mediumQuestionCounts || 0;
    const h = s.hardQuestionCounts || 0;
    const b = s.basicQuestionCounts || 0;

    totalSolved += total !== null ? total : e + m + h + b;
    easySolved += e;
    mediumSolved += m;
    hardSolved += h;

    const cal = p?.dailyActivityStatsResponse?.submissionCalendar || {};
    Object.keys(cal).forEach((k) => activeDayKeys.add(k));
    const ms = p?.dailyActivityStatsResponse?.maxStreak;
    if (typeof ms === "number") streak = Math.max(streak, ms);

    const raw = p?.userStats?.rank ?? p?.userStats?.maxRank;
    const parsed = typeof raw === "number" ? raw : parseInt(String(raw || "").replace(/\D/g, ""), 10);
    if (parsed > 0 && !rank) rank = parsed;
  }

  if (!totalSolved) throw new Error("Codolio returned a zero total");
  if (!activeDayKeys.size) throw new Error("Codolio returned an empty activity calendar");

  return {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    rank,
    streak,
    totalActiveDays: activeDayKeys.size,
    lastUpdated: new Date().toISOString(),
  };
}

/** Codolio's API occasionally changes; fall back to the Puppeteer scraper. */
function fetchCodolioViaPuppeteer() {
  log("API path failed, falling back to scrape-codolio.js (Puppeteer)");
  const r = spawnSync(process.execPath, [path.join(__dirname, "scrape-codolio.js")], {
    stdio: "inherit",
  });
  if (r.status !== 0) throw new Error("scrape-codolio.js fallback failed");
  return readJson(path.join(PUBLIC_DIR, "codolio-stats.json"));
}

// ---------------------------------------------------------------------------
// 2. GitHub  ->  contribution heatmap
// ---------------------------------------------------------------------------
async function fetchGitHubContributions(username) {
  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  if (!res.ok) throw new Error(`GitHub contributions HTTP ${res.status}`);
  const html = await res.text();

  const days = [];
  const tdRe = /<td[^>]*?data-date="([^"]+)"[^>]*?id="([^"]+)"[^>]*?data-level="([^"]+)"[^>]*?>/g;
  let m;
  while ((m = tdRe.exec(html)) !== null) {
    const [, date, id, level] = m;
    let count = 0;
    const tt = new RegExp(`<tool-tip[^>]*?for="${id}"[^>]*?>([^<]+)</tool-tip>`).exec(html);
    if (tt && !tt[1].toLowerCase().includes("no contributions")) {
      const n = tt[1].match(/^(\d+)/);
      if (n) count = parseInt(n[1], 10);
    }
    days.push({ date, count, contributionLevel: Number(level) });
  }

  if (days.length === 0) throw new Error("no contribution cells parsed from GitHub");
  return days;
}

// ---------------------------------------------------------------------------
// 3. Per-platform solved counts (informational; not rendered)
// ---------------------------------------------------------------------------
async function leetcodeSolved() {
  const q = `query userProfile($u:String!){matchedUser(username:$u){submitStatsGlobal{acSubmissionNum{difficulty count}}}}`;
  const r = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q, variables: { u: LC_USERNAME } }),
  });
  const j = await r.json();
  if (j.errors) throw new Error("LeetCode GraphQL error");
  const arr = j.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
  const find = (d) => arr.find((x) => x.difficulty === d)?.count ?? 0;
  return {
    easySolved: find("Easy"),
    mediumSolved: find("Medium"),
    hardSolved: find("Hard"),
    totalSolved: find("All"),
  };
}

async function codeforcesSolved() {
  const r = await fetch(`https://codeforces.com/api/user.status?handle=${CF_HANDLE}`);
  const j = await r.json();
  if (j.status !== "OK") throw new Error("Codeforces API error");
  const set = new Set();
  for (const s of j.result) {
    if (s.verdict === "OK") set.add(`${s.problem.contestId ?? s.problem.problemsetName}-${s.problem.index}`);
  }
  return { totalSolved: set.size };
}

async function codechefSolved() {
  const r = await fetch(`https://www.codechef.com/users/${CC_USERNAME}`);
  const m = (await r.text()).match(/Total\s+Problems\s+Solved[^\d]*(\d[\d,]*)/i);
  return { totalSolved: m ? Number(m[1].replace(/,/g, "")) : 0 };
}

async function gfgSolved() {
  const r = await fetch(
    `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${GFG_USERNAME}`,
    { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }
  );
  if (!r.ok) return { totalSolved: 0 };
  const s = JSON.stringify(await r.json());
  const m = s.match(/"total_problems_solved"\s*:\s*(\d+)/i) || s.match(/"problems_?solved"\s*:\s*(\d+)/i);
  return { totalSolved: m ? Number(m[1]) : 0 };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const results = { codolio: null, github: null, platform: null };
  const failures = [];

  // --- Codolio (authoritative for the dashboard) ---
  try {
    log("fetching Codolio...");
    const stats = await fetchCodolioViaApi();
    writeJson(path.join(PUBLIC_DIR, "codolio-stats.json"), stats);
    results.codolio = stats;
    log(
      `codolio ok: total=${stats.totalSolved} rank=${stats.rank} ` +
        `streak=${stats.streak} activeDays=${stats.totalActiveDays}`
    );
  } catch (err) {
    log("codolio API error:", err.message);
    try {
      const stats = fetchCodolioViaPuppeteer();
      results.codolio = stats;
      log(`codolio ok via fallback: activeDays=${stats.totalActiveDays}`);
    } catch (err2) {
      failures.push(`codolio: ${err2.message}`);
      log("codolio FAILED, keeping previous public/codolio-stats.json");
    }
  }

  await sleep(1200);

  // --- GitHub heatmap (shape must stay stable for the tooltip) ---
  try {
    log("fetching GitHub contributions...");
    const days = await fetchGitHubContributions(GITHUB_USERNAME);
    const activeDays = days.filter((d) => d.count > 0).length;
    const total = days.reduce((s, d) => s + d.count, 0);
    // Guard: never overwrite a good heatmap with a degenerate one.
    if (activeDays < 30) throw new Error(`only ${activeDays} active days, refusing to write`);
    writeJson(path.join(PUBLIC_DIR, "github-contribs", `${GITHUB_USERNAME}.json`), {
      contributions: days,
    });
    results.github = { entries: days.length, activeDays, total, newest: days[days.length - 1]?.date };
    log(`github ok: ${days.length} days, ${activeDays} active, newest=${results.github.newest}`);
  } catch (err) {
    failures.push(`github: ${err.message}`);
    log("github FAILED, keeping previous heatmap file");
  }

  await sleep(1200);

  // --- Per-platform breakdown ---
  try {
    log("fetching per-platform counts...");
    const [lc, cf, cc, gfg] = await Promise.all([
      leetcodeSolved().catch(() => ({ totalSolved: 0 })),
      codeforcesSolved().catch(() => ({ totalSolved: 0 })),
      codechefSolved().catch(() => ({ totalSolved: 0 })),
      gfgSolved().catch(() => ({ totalSolved: 0 })),
    ]);
    const platform = {
      leetcode: lc,
      codeforces: cf,
      codechef: cc,
      geeksforgeeks: gfg,
      totalSolved: lc.totalSolved + cf.totalSolved + cc.totalSolved + gfg.totalSolved,
      lastUpdated: new Date().toISOString(),
    };
    writeJson(path.join(PUBLIC_DIR, "platform-stats.json"), platform);
    results.platform = platform;
    log(`platform ok: leetcode=${lc.totalSolved} cf=${cf.totalSolved} cc=${cc.totalSolved} gfg=${gfg.totalSolved}`);
  } catch (err) {
    failures.push(`platform: ${err.message}`);
    log("platform stats FAILED");
  }

  log("---- summary ----");
  log(JSON.stringify(results, null, 2));

  if (failures.length) {
    // Non-fatal: whatever succeeded is already written, the rest keeps its
    // previous committed values so the site never shows a hole.
    log("completed with warnings:");
    failures.forEach((f) => log("  - " + f));
  } else {
    log("all sources up to date");
  }
}

main().catch((err) => {
  console.error("[coding-stats] fatal:", err);
  process.exitCode = 1;
});