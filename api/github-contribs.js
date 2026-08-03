module.exports = async (req, res) => {
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

    // Common pattern: rect elements with data-date and data-count or data-level attributes
    const rectRe = /<rect[^>]*data-date="([^"]+)"[^>]*data-count="([^"]+)"[^>]*?(?:data-level="([^"]+)")?[^>]*?>/gi;
    let m;
    while ((m = rectRe.exec(svg)) !== null) {
      const date = m[1];
      const count = parseInt(m[2], 10) || 0;
      const level = m[3] || null;
      contribs.push({ date, count, contributionLevel: level });
    }

    // If none found, try permissive pattern for data-date + data-level
    if (contribs.length === 0) {
      const rectRe2 = /<rect[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*?>/gi;
      while ((m = rectRe2.exec(svg)) !== null) {
        const date = m[1];
        const level = m[2] || '0';
        contribs.push({ date, count: Number(level) || 0, contributionLevel: level });
      }
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
