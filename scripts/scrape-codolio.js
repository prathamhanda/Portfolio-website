import puppeteer from "puppeteer";
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
  const n = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

log("Starting Codolio scraper...");

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--no-zygote",
    "--disable-blink-features=AutomationControlled",
  ],
});

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(60_000);

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

  // Give the client-side app a moment to render its numbers
  await page.waitForFunction(() => document.body && document.body.innerText && document.body.innerText.length > 200, {
    timeout: 30_000,
  });

  // If Codolio is served via Next.js, stats may be present in __NEXT_DATA__ (more stable than DOM scraping)
  let nextData = null;
  try {
    nextData = await page.$eval("#__NEXT_DATA__", (el) => el.textContent);
  } catch {
    // ignore: not a Next.js page or element not present
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
