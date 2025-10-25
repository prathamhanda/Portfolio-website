// Serverless endpoint to fetch GeeksforGeeks user profile and return total_problems_solved
// Deploy this on Vercel/Netlify (functions) so the browser doesn't have to fetch GfG HTML directly (avoids CORS).

export default async function handler(req: any, res: any) {
  try {
    const user = (req.query.user as string) || (req.body && (req.body.user as string)) || 'prathamh';
    const url = `https://www.geeksforgeeks.org/user/${encodeURIComponent(user)}/`;
    const r = await fetch(url, { method: 'GET' });
    if (!r.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(502).json({ error: `Upstream returned ${r.status}` });
    }
    const text = await r.text();

    const m = text.match(/<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (!m) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(404).json({ error: 'No __NEXT_DATA__ found' });
    }
    let json: any;
    try {
      json = JSON.parse(m[1]);
    } catch (err) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json({ error: 'Failed to parse JSON' });
    }

    const possible = json?.props?.pageProps || json?.props || json || {};
    const count = possible?.userInfo?.total_problems_solved
      || possible?.initialState?.userProfileApi?.getUserInfo?.data?.total_problems_solved
      || possible?.initialState?.userProfileApi?.getUserInfo?.data?.data?.total_problems_solved
      || 0;

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json({ count: Number(count || 0) });
  } catch (err: any) {
    try { res.setHeader('Access-Control-Allow-Origin', '*'); } catch (e) {}
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
