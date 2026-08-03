import fs from 'fs';
import path from 'path';

const user = process.argv[2] || 'prathamhanda';
const outDir = path.join(process.cwd(), 'public', 'github-contribs');
const outFile = path.join(outDir, `${user}.json`);

async function fetchAndWrite() {
  try {
    const url = `https://github.com/users/${user}/contributions`;
    console.log('Fetching', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    const text = await res.text();
    const genericRe = /<[^>]+data-date="([^"]+)"([^>]*)>/gi;
    const contribs = [];
    let m;
    while ((m = genericRe.exec(text)) !== null) {
      const date = m[1];
      const rest = m[2] || '';
      const countMatch = rest.match(/data-count="([^\"]+)"/i);
      const levelMatch = rest.match(/data-level="([^\"]+)"/i);
      const count = countMatch ? parseInt(countMatch[1], 10) || 0 : (levelMatch ? Number(levelMatch[1]) || 0 : 0);
      const level = levelMatch ? levelMatch[1] : null;
      contribs.push({ date, count, contributionLevel: level });
    }

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify({ contributions: contribs }, null, 2), 'utf8');
    console.log('Wrote', outFile, 'entries', contribs.length);
  } catch (e) {
    console.error('Error generating static contribs', e);
    process.exit(2);
  }
}

fetchAndWrite();
