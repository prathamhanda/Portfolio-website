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

  const denoTarget = `https://github-contributions-api.deno.dev/${user}.json`;

  try {
    // Try the original Deno API first
    const r = await fetch(denoTarget);
    if (r.ok) {
      const body = await r.text();
      res.statusCode = r.status || 200;
      const contentType = r.headers.get('content-type') || 'application/json';
      res.setHeader('Content-Type', contentType);
      res.end(body);
      return;
    }
  } catch (e) {
    // ignore and fallback to scraping GitHub
  }

  // Fallback: scrape GitHub contributions page
  try {
    const svgUrl = `https://github.com/users/${user}/contributions`;
    const svgRes = await fetch(svgUrl);
    if (!svgRes.ok) {
      res.statusCode = svgRes.status || 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `Failed to fetch fallback: ${svgRes.status}` }));
      return;
    }

    const svg = await svgRes.text();
    const contribs = [];

    // Generic extraction: look for any element with data-date and optional data-count/data-level
    const genericRe = /<[^>]+data-date="([^"]+)"([^>]*)>/gi;
    let m;
    while ((m = genericRe.exec(svg)) !== null) {
      const date = m[1];
      const rest = m[2] || '';
      const countMatch = rest.match(/data-count="([^"]+)"/i);
      const levelMatch = rest.match(/data-level="([^"]+)"/i);
      const count = countMatch ? parseInt(countMatch[1], 10) || 0 : (levelMatch ? Number(levelMatch[1]) || 0 : 0);
      const level = levelMatch ? levelMatch[1] : null;
      contribs.push({ date, count, contributionLevel: level });
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ contributions: contribs }));
    return;
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: String(err) }));
    return;
  }
};
