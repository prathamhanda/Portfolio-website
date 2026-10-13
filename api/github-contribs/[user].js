import fs from 'fs';
import path from 'path';
import os from 'os';
import { fetchGitHubContributions, summarise } from '../../lib/github-contribs.mjs';

export default async function handler(req, res) {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // determine username from path (/api/github-contribs/<user>.json) or query
  let user = 'prathamhanda';
  try {
    const reqUrl = req.url || '/';
    const parsed = new URL(reqUrl, `http://${req.headers.host}`);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    if (last && !last.startsWith('github-contribs')) {
      user = last.replace(/\.json$/i, '');
    } else if (req.query && req.query.user) {
      user = req.query.user;
    } else if (parsed.searchParams.get('user')) {
      user = parsed.searchParams.get('user');
    }
  } catch (e) {
    // keep default
  }

  // Server-side simple file cache to avoid hitting GitHub on every request (helps mitigate edge rate-limits).
  const CACHE_TTL = Number(process.env.GH_CONTRIBS_CACHE_TTL_SECONDS || 600); // seconds
  const cacheFile = path.join(os.tmpdir(), `github-contribs-${user}.json`);
  try {
    const st = await fs.promises.stat(cacheFile);
    if (Date.now() - st.mtimeMs < CACHE_TTL * 1000) {
      const cached = await fs.promises.readFile(cacheFile, 'utf8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', `public, max-age=${CACHE_TTL}`);
      res.end(cached);
      return;
    }
  } catch (e) {
    // no cache or unreadable — continue to fetch
  }

  // Parse GitHub's contributions calendar using the shared module.
  //
  // The previous implementation tried github-contributions-api.deno.dev first,
  // which now returns 404 for every request, and then parsed the HTML looking
  // for a `data-count` attribute that GitHub does not emit. It silently fell
  // back to `data-level` (a 0-4 colour bucket) as the count, reporting a day
  // with 7 contributions as 1. The shared module reads the real number from the
  // <tool-tip> element and is the same code path the weekly scraper uses, so
  // static and live data can no longer disagree.
  try {
    const days = await fetchGitHubContributions(user);
    const body = JSON.stringify({ contributions: days });

    try {
      await fs.promises.writeFile(cacheFile, body, 'utf8');
    } catch (e) {
      // ignore cache write errors
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60`);
    res.end(body);
    return;
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: String(err?.message || err) }));
    return;
  }
};
