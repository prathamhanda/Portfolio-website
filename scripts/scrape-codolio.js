import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_FILE = path.join(__dirname, "../public/codolio-stats.json");
const PROFILE_URL = process.env.CODOLIO_PROFILE_URL || "https://codolio.com/profile/prathamhanda";
const EXPECTED_USERNAME = (process.env.CODOLIO_EXPECTED_USERNAME || "prathamhanda").toLowerCase();

const log = (...args) => console.log("[codolio]", ...args);

const parseFirstInt = (text) => {
  if (!text) return null;
  const match = String(text).match(/(\d[\d,]*)/);
  if (!match) return null;
  const n = Number(match[`1`].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

log("Starting Codolio scraper...");
// Track observed requests (populated only when Puppeteer runs)
const seenRequests = new Set();
const requestsLog = [];

// Try the Codolio API first (fast, preferred). If it returns usable data,
// write the JSON and exit without starting Puppeteer/Chromium.
const tryApiOnly = async () => {
  try {
    const match = PROFILE_URL.match(/profile\/(.+?)$/i);
    const userKey = match ? match[1] : null;
    if (!userKey) return null;
    const apiUrl = `https://api.codolio.com/profile?userKey=${encodeURIComponent(userKey)}`;
    log("Attempting direct API fetch:", apiUrl);
    const res = await fetch(apiUrl, { method: "GET" });
    if (!res.ok) {
      log("API fetch failed with status", res.status);
      return null;
    }
    const json = await res.json();
    let profiles = json?.data?.platformProfiles || [];
    if (!Array.isArray(profiles) && profiles && Array.isArray(profiles.platformProfiles)) {
      profiles = profiles.platformProfiles;
    }
    if (!Array.isArray(profiles) || profiles.length === 0) return null;

    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    const activeDayKeys = new Set();
    let streak = 0;
    let rank = 0;

    for (const p of profiles) {
      const stats = p?.totalQuestionStats ?? {};
      const tq = typeof stats.totalQuestionCounts === 'number' ? stats.totalQuestionCounts : null;
      const e = typeof stats.easyQuestionCounts === 'number' ? stats.easyQuestionCounts : 0;
      const m = typeof stats.mediumQuestionCounts === 'number' ? stats.mediumQuestionCounts : 0;
      const h = typeof stats.hardQuestionCounts === 'number' ? stats.hardQuestionCounts : 0;
      const b = typeof stats.basicQuestionCounts === 'number' ? stats.basicQuestionCounts : 0;

      if (typeof tq === "number") totalSolved += tq;
      else totalSolved += e + m + h + b;

      easySolved += e;
      mediumSolved += m;
      hardSolved += h;

      const ds = p?.dailyActivityStatsResponse || {};
      const cal = ds.submissionCalendar || {};
      Object.keys(cal).forEach((k) => activeDayKeys.add(k));
      if (typeof ds.maxStreak === 'number') streak = Math.max(streak, ds.maxStreak);

      const platformRank = p?.userStats?.rank ?? p?.userStats?.maxRank ?? null;
      const rankNum = typeof platformRank === "number" ? platformRank : parseFirstInt(String(platformRank || "")) || 0;
      if (rankNum > 0 && !rank) rank = rankNum;
    }

    if (!totalSolved) totalSolved = easySolved + mediumSolved + hardSolved;

    return {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      rank: rank || 0,
      streak: streak || 0,
      totalActiveDays: activeDayKeys.size || 0,
      lastUpdated: new Date().toISOString(),
    };
  } catch (e) {
    log("Direct API attempt failed:", e?.message || e);
    return null;
  }
};

// If API returns live data, write and exit immediately (avoid Puppeteer)
const apiOnlyStats = await tryApiOnly();
if (apiOnlyStats) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(apiOnlyStats, null, 2) + "\n", "utf8");
  log("Saved to", OUTPUT_FILE, "(from API, no Puppeteer needed)");
  process.exit(0);
}

// Puppeteer will be loaded lazily only if API fetch fails.
let browser;

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60_000);

  // Capture network requests (XHR/Fetch) for debugging API endpoints
  const seenRequests = new Set();
  const requestsLog = [];
  page.on('request', (req) => {
    try {
      const resourceType = req.resourceType && typeof req.resourceType === 'function' ? req.resourceType() : req.resourceType;
      const url = req.url();
      if (resourceType === 'xhr' || resourceType === 'fetch' || /\/api\//i.test(url)) {
        if (!seenRequests.has(url)) {
          seenRequests.add(url);
          requestsLog.push({ url, resourceType });
        }
      }
    } catch (e) {}
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1365, height: 768 });

  // Reduce trivial headless detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  log("Resource:", PROFILE_URL);
  const resp = await page.goto(PROFILE_URL, { waitUntil: "networkidle2", timeout: 60_000 });
  log("HTTP status:", resp?.status?.() ?? "(no response)");
  log("Final URL:", page.url());
  try {
    log("Title:", await page.title());
  } catch {
    // ignore
  }

  await page.waitForSelector("body");
  // Wait for the profile page to actually render a hint of the username.
  // If Codolio redirects to home/login for bots, this will time out and we’ll capture debug artifacts.
  try {
    await page.waitForFunction(
      (u) => (document.body?.innerText || "").toLowerCase().includes(String(u).toLowerCase()),
      { timeout: 20_000 },
      EXPECTED_USERNAME
    );
  } catch {
    // ignore: will be handled by debug capture later
  }

  // Try to expand common accordions (like "Problem Solving Stats") that hide numbers behind toggles.
  try {
    await page.evaluate(() => {
      const walkAndClick = (text) => {
        const els = Array.from(document.querySelectorAll('button, a, div'));
        for (const el of els) {
          try {
            if (!el || !el.textContent) continue;
            const t = el.textContent.trim();
            if (!t) continue;
            if (t.toLowerCase().includes(text)) {
              // if it's a button-like element, click it; else try to find a nearby button
              if (el.tagName.toLowerCase() === 'button' || el.getAttribute('role') === 'button') {
                el.click();
              } else {
                const btn = el.querySelector && el.querySelector('button');
                if (btn) btn.click();
                else {
                  // try next sibling
                  const sib = el.nextElementSibling;
                  if (sib && (sib.tagName.toLowerCase() === 'button' || sib.getAttribute('role') === 'button')) sib.click();
                }
              }
            }
          } catch (e) {
            // continue
          }
        }
      };
      walkAndClick('problem solving stats');
      walkAndClick('problem solving');
      walkAndClick('problem solving stats');
    });
  } catch (e) {
    // ignore
  }

  // Give the client-side app a moment to render its numbers (allow extra time for XHRs)
  await page.waitForFunction(() => document.body && document.body.innerText && document.body.innerText.length > 300, {
    timeout: 45_000,
  }).catch(() => {});

  // If Codolio is served via Next.js, stats may be present in __NEXT_DATA__ (more stable than DOM scraping)
  let nextData = null;
  try {
    nextData = await page.$eval("#__NEXT_DATA__", (el) => el.textContent);
  } catch {
    // ignore: not a Next.js page or element not present
  }

  // Try direct Codolio API fetch (preferred) using observed request or by deriving from profile URL
  const tryDirectApi = async () => {
    try {
      // Look for observed requests to api.codolio.com/profile
      const observed = requestsLog.find((r) => /https?:\/\/api\.codolio\.com\/profile\?userKey=/i.test(r.url));
      let apiUrl = observed?.url;
      if (!apiUrl) {
        // Derive userKey from PROFILE_URL
        const match = PROFILE_URL.match(/profile\/(.+?)$/i);
        const userKey = match ? match[1] : null;
        if (userKey) apiUrl = `https://api.codolio.com/profile?userKey=${encodeURIComponent(userKey)}`;
      }
      if (!apiUrl) return null;

      log("Attempting direct API fetch:", apiUrl);
      const res = await fetch(apiUrl, { method: "GET" });
      if (!res.ok) {
        log("API fetch failed with status", res.status);
        return null;
      }
      const json = await res.json();
      // json.data.platformProfiles is an object containing array under data.platformProfiles
      // Support two shapes: either json.data.platformProfiles is the array,
      // or json.data.platformProfiles.platformProfiles is the array (observed variation).
      let profiles = json?.data?.platformProfiles || [];
      if (!Array.isArray(profiles) && profiles && Array.isArray(profiles.platformProfiles)) {
        profiles = profiles.platformProfiles;
      }
      if (!Array.isArray(profiles) || profiles.length === 0) return null;

      let totalSolved = 0;
      let easySolved = 0;
      let mediumSolved = 0;
      let hardSolved = 0;
      // collect unique activity days across platforms
      const activeDayKeys = new Set();
      let streak = 0;
      let rank = 0;


      const perPlatform = [];
      for (const p of profiles) {
        const stats = p?.totalQuestionStats ?? {};
        const tq = typeof stats.totalQuestionCounts === 'number' ? stats.totalQuestionCounts : null;
        const e = typeof stats.easyQuestionCounts === 'number' ? stats.easyQuestionCounts : 0;
        const m = typeof stats.mediumQuestionCounts === 'number' ? stats.mediumQuestionCounts : 0;
        const h = typeof stats.hardQuestionCounts === 'number' ? stats.hardQuestionCounts : 0;
        const b = typeof stats.basicQuestionCounts === 'number' ? stats.basicQuestionCounts : 0;

        if (typeof tq === "number") totalSolved += tq;
        else totalSolved += e + m + h + b;

        easySolved += e;
        mediumSolved += m;
        hardSolved += h;
        perPlatform.push({ platform: p?.platform, totalQuestionCounts: tq, easy: e, medium: m, hard: h, basic: b });
        const ds = p?.dailyActivityStatsResponse || {};
        const cal = ds.submissionCalendar || {};
        Object.keys(cal).forEach((k) => activeDayKeys.add(k));
        if (typeof ds.maxStreak === 'number') streak = Math.max(streak, ds.maxStreak);

        const platformRank = p?.userStats?.rank ?? p?.userStats?.maxRank ?? null;
        const rankNum = typeof platformRank === "number" ? platformRank : parseFirstInt(String(platformRank || "")) || 0;
        if (rankNum > 0 && !rank) rank = rankNum;
      }

      // perPlatform debug info removed for clean CI output

      return {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        rank: rank || 0,
        streak: streak || 0,
        totalActiveDays: activeDayKeys.size || 0,
        lastUpdated: new Date().toISOString(),
      };
    } catch (e) {
      log("Direct API attempt failed:", e?.message || e);
      return null;
    }
  };

  const apiStats = await tryDirectApi();
  if (apiStats) {
    // Write and exit early using API-derived stats
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(apiStats, null, 2) + "\n", "utf8");
    log("Saved to", OUTPUT_FILE, "(from API)");
    await browser.close();
    process.exit(0);
  }

  const nextStats = (() => {
    if (!nextData) return null;
    try {
      const parsed = JSON.parse(nextData);
      const matchesKey = (key) =>
        typeof key === "string" &&
        /total.*solv|problems.*solv|questions.*solv|global.*rank|current.*rank|\brank\b|current.*streak|\bstreak\b/i.test(key);

      const found = {
        totalSolved: null,
        rank: null,
        streak: null,
      };

      const visit = (value) => {
        if (!value) return;
        if (Array.isArray(value)) {
          for (const v of value) visit(v);
          return;
        }
        if (typeof value !== "object") return;

        for (const [k, v] of Object.entries(value)) {
          if (matchesKey(k)) {
            // Keep first plausible number per field
            const key = k.toLowerCase();
            const n = typeof v === "number" ? v : parseFirstInt(v);
            if (typeof n === "number") {
              if ((/solv|questions.*solv|problems.*solv/.test(key)) && found.totalSolved == null) found.totalSolved = n;
              else if ((/streak/.test(key)) && found.streak == null) found.streak = n;
              else if ((/rank/.test(key)) && found.rank == null) found.rank = n;
            }
          }
          visit(v);
        }
      };

      visit(parsed);

      if (found.totalSolved == null && found.rank == null && found.streak == null) return null;
      return found;
    } catch {
      return null;
    }
  })();

  const stats = await page.evaluate(() => {
    const parseFirstInt = (text) => {
      if (!text) return null;
      const match = String(text).match(/(\d[\d,]*)/);
      if (!match) return null;
      const n = Number(match[1].replace(/,/g, ""));
      return Number.isFinite(n) ? n : null;
    };

    const getFromBodyText = (patterns) => {
      const bodyText = document.body?.innerText || "";
      for (const pattern of patterns) {
        const m = bodyText.match(pattern);
        if (!m) continue;
        const n = parseFirstInt(m[1] ?? m[0]);
        if (typeof n === "number") return n;
      }
      return null;
    };

    const getTextByLabel = (label) => {
      const elements = Array.from(document.querySelectorAll("*"));
      const target = elements.find((el) => el.textContent?.trim().toLowerCase().includes(label.toLowerCase()));
      if (!target) return null;

      const parent = target.closest("div");
      if (!parent) return null;

      const text = parent.innerText || "";
      return parseFirstInt(text);
    };

    const totalSolved =
      getFromBodyText([
        /Total\s+Questions\s*[:\-]?\s*(\d[\d,]*)/i,
        /Total\s+Questions\s+Solved\s*[:\-]?\s*(\d[\d,]*)/i,
        /Problems\s+Solved\s*[:\-]?\s*(\d[\d,]*)/i,
        /Total\s+Solved\s*[:\-]?\s*(\d[\d,]*)/i,
        /(\d[\d,]*)\s+Problems\s+Solved/i,
      ]) ||
      getTextByLabel("Total Questions Solved") ||
      getTextByLabel("Total Solved") ||
      getTextByLabel("Problems Solved") ||
      0;

    const rank =
      getFromBodyText([
        /Global\s+Rank\s*[:\-#]?\s*(\d[\d,]*)/i,
        /Current\s+Rank\s*[:\-#]?\s*(\d[\d,]*)/i,
        /Rank\s*[:\-#]?\s*(\d[\d,]*)/i,
      ]) ||
      getTextByLabel("Global Rank") ||
      getTextByLabel("Current Rank") ||
      getTextByLabel("Rank") ||
      0;

    const streak =
      getFromBodyText([
        /Current\s+Streak\s*[:\-]?\s*(\d[\d,]*)/i,
        /Streak\s*[:\-]?\s*(\d[\d,]*)/i,
        /(\d[\d,]*)\s+day\s+streak/i,
      ]) ||
      getTextByLabel("Current Streak") ||
      getTextByLabel("Streak") ||
      0;

    // Difficulty breakdown (Codolio displays this under the 'Problems Solved' section)
    const getDifficultyBreakdown = () => {
      const bodyText = document.body?.innerText || "";
      const lower = bodyText.toLowerCase();
      const idx = lower.indexOf("problems solved");
      const scope = idx >= 0 ? bodyText.slice(idx, idx + 2500) : bodyText;

      const easySolved = parseFirstInt(scope.match(/\bEasy\b\s*(\d[\d,]*)/i)?.[1]) ?? 0;
      const mediumSolved = parseFirstInt(scope.match(/\bMedium\b\s*(\d[\d,]*)/i)?.[1]) ?? 0;
      const hardSolved = parseFirstInt(scope.match(/\bHard\b\s*(\d[\d,]*)/i)?.[1]) ?? 0;

      return { easySolved, mediumSolved, hardSolved };
    };

    const { easySolved, mediumSolved, hardSolved } = getDifficultyBreakdown();

    const totalActiveDays =
      getFromBodyText([
        /Total\s+Active\s+Days\s*[:\-]?\s*(\d[\d,]*)/i,
        /Active\s+Days\s*[:\-]?\s*(\d[\d,]*)/i,
      ]) ||
      getTextByLabel("Total Active Days") ||
      getTextByLabel("Active Days") ||
      0;

    return {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      rank,
      streak,
      totalActiveDays,
      lastUpdated: new Date().toISOString(),
    };
  });

  // Normalize output shape defensively
  const normalized = {
    totalSolved: Number(nextStats?.totalSolved ?? stats?.totalSolved) || 0,
    easySolved: Number(stats?.easySolved) || 0,
    mediumSolved: Number(stats?.mediumSolved) || 0,
    hardSolved: Number(stats?.hardSolved) || 0,
    rank: Number(nextStats?.rank ?? stats?.rank) || 0,
    streak: Number(nextStats?.streak ?? stats?.streak) || 0,
    totalActiveDays: Number(stats?.totalActiveDays) || 0,
    lastUpdated: typeof stats?.lastUpdated === "string" ? stats.lastUpdated : new Date().toISOString(),
  };

  // If totalSolved wasn't provided directly, compute from difficulty breakdown
  if (!normalized.totalSolved) {
    normalized.totalSolved = (normalized.easySolved || 0) + (normalized.mediumSolved || 0) + (normalized.hardSolved || 0);
  }

  log("Extracted stats:", normalized);

  // Helpful local debugging when Codolio changes DOM / blocks headless scraping.
  // These artifacts are NOT committed by the GitHub Action (it only commits the JSON file).
  if (normalized.totalSolved === 0) {
    try {
      const bodyText = await page.evaluate(() => document.body?.innerText || "");
      const debugDir = path.join(__dirname, "../scripts");
      fs.mkdirSync(debugDir, { recursive: true });
      fs.writeFileSync(path.join(debugDir, "codolio-body.txt"), bodyText.slice(0, 50_000), "utf8");
      await page.screenshot({ path: path.join(debugDir, "codolio.png"), fullPage: true });
      try {
        fs.writeFileSync(path.join(debugDir, "codolio-requests.json"), JSON.stringify(requestsLog, null, 2), "utf8");
      } catch (e) {
        // ignore
      }
      log("Debug saved: scripts/codolio-body.txt and scripts/codolio.png");
    } catch (e) {
      log("Debug capture failed:", e?.message || e);
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalized, null, 2) + "\n", "utf8");
  log("Saved to", OUTPUT_FILE);
} catch (error) {
  console.error("[codolio] Error scraping Codolio:", error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
