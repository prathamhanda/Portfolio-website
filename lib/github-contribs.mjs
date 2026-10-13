/**
 * Single source of truth for fetching GitHub contribution data.
 *
 * Shared by the weekly scraper (scripts/update-coding-stats.mjs, which writes
 * the static file) and the API route (api/github-contribs/[user].js, which is
 * the live fallback). Both MUST use this module, because they previously had
 * two different parsers that disagreed badly:
 *
 *   - The scraper read the real number out of the <tool-tip> element.
 *   - The API route looked for a `data-count` attribute. GitHub does not emit
 *     one. When it was missing, the route silently substituted `data-level`
 *     (a 0-4 intensity bucket) as the count, so a day with 7 contributions was
 *     reported as 1. Totals came out 193 instead of 730.
 *
 * That only stayed hidden because the client prefers the static file and the
 * Deno API upstream (github-contributions-api.deno.dev) happened to serve
 * correct numbers. The Deno service is now returning 404, which exposed the
 * broken fallback.
 *
 * The contract this module guarantees, because the dashboard's tooltip reads
 * data-date / data-count / data-title off the rendered cells:
 *   { contributions: [{ date: "YYYY-MM-DD", count: number, contributionLevel: number }] }
 */

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Apple/Chrome/122.0.0.0 Safari/537.36";

/**
 * Parse the contributions calendar HTML.
 * GitHub puts the real per-day count in a <tool-tip for="<cell id>"> child
 * element (e.g. "7 contributions on October 12th"). data-level is only a
 * 0-4 colour bucket and must never be used as a count.
 */
export function parseContributionsHtml(html) {
  const days = [];
  // Each calendar cell carries data-date, an id, and data-level.
  const cellRe = /<td[^>]*?data-date="([^"]+)"[^>]*?id="([^"]+)"[^>]*?data-level="([^"]+)"[^>]*?>/g;

  // Pre-index tool-tips once: doing a fresh regex scan per cell is O(n^2) over
  // ~370 cells and was the slowest part of this fetch.
  const tooltips = new Map();
  const tipRe = /<tool-tip[^>]*?for="([^"]+)"[^>]*?>([^<]*)<\/tool-tip>/g;
  let tip;
  while ((tip = tipRe.exec(html)) !== null) {
    tooltips.set(tip[1], tip[2].trim());
  }

  let m;
  while ((m = cellRe.exec(html)) !== null) {
    const [, date, id, level] = m;
    let count = 0;
    const tipText = tooltips.get(id);
    if (tipText && !tipText.toLowerCase().includes("no contributions")) {
      const n = tipText.match(/^(\d+)/);
      if (n) count = parseInt(n[1], 10);
    }
    days.push({ date, count, contributionLevel: Number(level) });
  }

  return days;
}

/** Fetch and parse one user's contribution calendar. Throws on failure. */
export async function fetchGitHubContributions(username) {
  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`GitHub contributions HTTP ${res.status} for ${username}`);
  }
  const days = parseContributionsHtml(await res.text());
  if (days.length === 0) {
    throw new Error("no contribution cells parsed from GitHub");
  }
  return days;
}

/** Summary used for logging and sanity guards. */
export function summarise(days) {
  return {
    entries: days.length,
    activeDays: days.filter((d) => d.count > 0).length,
    total: days.reduce((s, d) => s + d.count, 0),
    oldest: days[0]?.date,
    newest: days[days.length - 1]?.date,
  };
}