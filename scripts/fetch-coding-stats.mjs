import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
try {
  const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
} catch (e) {
  // ignore
}

// Configuration
const LC_USERNAME = process.env.VITE_LEETCODE_USERNAME || "prathamhanda";
const CF_HANDLE = process.env.VITE_CODEFORCES_USERNAME || "prathamhanda10";
const CC_USERNAME = process.env.VITE_CODECHEF_USERNAME || "prathamhanda";
const GITHUB_USERNAME = process.env.VITE_GITHUB_USERNAME || "prathamhanda";
const GFG_USERNAME = process.env.VITE_GFG_USERNAME || "prathamh";

const PUBLIC_DIR = path.join(__dirname, "..", "public");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// =============================================================================
// LeetCode
// =============================================================================
async function lcGraphQL(query, variables) {
  const res = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(`LeetCode GraphQL error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

async function getLeetCodeStats() {
  const profileQuery = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal { acSubmissionNum { difficulty count } }
      }
    }`;
  const data = await lcGraphQL(profileQuery, { username: LC_USERNAME });
  const user = data.matchedUser || {};
  const solvedArr = user.submitStatsGlobal?.acSubmissionNum || [];
  const find = (d) => solvedArr.find((s) => s.difficulty === d)?.count ?? 0;

  return {
    easySolved: find("Easy"),
    mediumSolved: find("Medium"),
    hardSolved: find("Hard"),
    totalSolved: find("All"),
  };
}

// =============================================================================
// Codeforces
// =============================================================================
async function getCodeforcesStats() {
  const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${CF_HANDLE}`);
  const statusData = await statusRes.json();
  if (statusData.status !== "OK") throw new Error(`CF user.status error: ${statusData.comment}`);

  const solvedSet = new Set();
  for (const sub of statusData.result) {
    if (sub.verdict === "OK") {
      solvedSet.add(`${sub.problem.contestId ?? sub.problem.problemsetName}-${sub.problem.index}`);
    }
  }
  return { totalSolved: solvedSet.size };
}

// =============================================================================
// CodeChef
// =============================================================================
async function getCodeChefStats() {
  const res = await fetch(`https://www.codechef.com/users/${CC_USERNAME}`);
  const html = await res.text();
  const solvedMatch = html.match(/Total\s+Problems\s+Solved[^\d]*(\d[\d,]*)/i);
  const totalSolved = solvedMatch ? Number(solvedMatch[1].replace(/,/g, "")) : 0;
  return { totalSolved };
}

// =============================================================================
// GeeksforGeeks
// =============================================================================
async function getGfgStats() {
  try {
    const res = await fetch(`https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${GFG_USERNAME}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) return { totalSolved: 0 };
    const data = await res.json();
    const jsonString = JSON.stringify(data);
    const match = jsonString.match(/"total_problems_solved"\s*:\s*(\d+)/i) ||
                  jsonString.match(/"problems_?solved"\s*:\s*(\d+)/i);
    return { totalSolved: match ? Number(match[1]) : 0 };
  } catch (error) {
    return { totalSolved: 0 };
  }
}

// =============================================================================
// GitHub
// =============================================================================
async function getGitHubContributions() {
  const res = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`);
  const html = await res.text();
  
  const days = [];
  const tdRegex = /<td[^>]*?data-date="([^"]+)"[^>]*?id="([^"]+)"[^>]*?data-level="([^"]+)"[^>]*?>/g;
  let match;
  while ((match = tdRegex.exec(html)) !== null) {
    const date = match[1];
    const id = match[2];
    const level = Number(match[3]);
    let count = 0;
    const ttRegex = new RegExp(`<tool-tip[^>]*?for="${id}"[^>]*?>([^<]+)</tool-tip>`);
    const ttMatch = ttRegex.exec(html);
    if (ttMatch) {
      const text = ttMatch[1];
      if (text.toLowerCase().includes('no contributions')) {
        count = 0;
      } else {
        const numMatch = text.match(/^(\d+)/);
        if (numMatch) count = parseInt(numMatch[1], 10);
      }
    }
    days.push({ date, count, contributionLevel: level });
  }
  return days;
}

// =============================================================================
// Main
// =============================================================================
async function main() {
  console.log("Fetching LeetCode...");
  let lc = { totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
  try { lc = await getLeetCodeStats(); } catch (e) { console.error("LC Error:", e.message); }

  await sleep(1500);

  console.log("Fetching Codeforces...");
  let cf = { totalSolved: 0 };
  try { cf = await getCodeforcesStats(); } catch (e) { console.error("CF Error:", e.message); }

  await sleep(1500);

  console.log("Fetching CodeChef...");
  let cc = { totalSolved: 0 };
  try { cc = await getCodeChefStats(); } catch (e) { console.error("CC Error:", e.message); }

  await sleep(1500);

  console.log("Fetching GFG...");
  let gfg = { totalSolved: 0 };
  try { gfg = await getGfgStats(); } catch (e) { console.error("GFG Error:", e.message); }

  await sleep(1500);

  console.log("Fetching GitHub...");
  let gh = [];
  try { gh = await getGitHubContributions(); } catch (e) { console.error("GH Error:", e.message); }

  // 1. Generate codolio-stats.json
  const totalSolvedAllPlatforms = lc.totalSolved + cf.totalSolved + cc.totalSolved + gfg.totalSolved;
  const codolioStats = {
    totalSolved: totalSolvedAllPlatforms,
    easySolved: lc.easySolved,
    mediumSolved: lc.mediumSolved,
    hardSolved: lc.hardSolved,
    rank: 0,
    streak: 0,
    totalActiveDays: gh.filter(d => d.count > 0).length, // estimate active days from github
    lastUpdated: new Date().toISOString()
  };

  const codolioPath = path.join(PUBLIC_DIR, "codolio-stats.json");
  fs.mkdirSync(path.dirname(codolioPath), { recursive: true });
  fs.writeFileSync(codolioPath, JSON.stringify(codolioStats, null, 2));
  console.log(`Saved ${codolioPath}`);

  // 2. Generate github-contribs.json
  const githubContribsPath = path.join(PUBLIC_DIR, "github-contribs", `${GITHUB_USERNAME}.json`);
  fs.mkdirSync(path.dirname(githubContribsPath), { recursive: true });
  fs.writeFileSync(githubContribsPath, JSON.stringify({ contributions: gh }, null, 2));
  console.log(`Saved ${githubContribsPath}`);
  
  console.log("Done! Run your project locally to see the updated data.");
}

main();
