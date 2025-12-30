#!/usr/bin/env node
// testing.js
// Simple Node script to test Google Gemini API key (VITE_GEMINI_API_KEY).
// Usage:
//  - Set env var: VITE_GEMINI_API_KEY=your_key node testing.js
//  - Or ensure there's a .env.local in project root containing VITE_GEMINI_API_KEY=...

import fs from 'fs';
import path from 'path';

function readDotEnv(dotenvPath) {
  try {
    const content = fs.readFileSync(dotenvPath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^\s*VITE_GEMINI_API_KEY\s*=\s*(.+)\s*$/);
      if (m) return m[1].trim();
    }
  } catch (err) {
    return null;
  }
  return null;
}

async function main() {
  let apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    const envPath = path.resolve(process.cwd(), '.env.local');
    apiKey = readDotEnv(envPath);
  }

  if (!apiKey) {
    console.error('Gemini API key not found. Set VITE_GEMINI_API_KEY or add .env.local');
    process.exit(1);
  }

  const prompt = `Test connection: please reply with exactly "Gemini reachable" and current timestamp.`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.3,
      topP: 0.8,
      topK: 30,
    },  
  };

  try {
    // Node 18+ has global fetch. If older Node, user should run with Node 18+ or install node-fetch.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('API returned error status:', res.status);
      const txt = await res.text();
      console.error('Error body:', txt);
      process.exit(2);
    }

    const data = await res.json();
    // Try to extract the main text similar to project's aiSearch.ts
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Raw API response JSON:\n', JSON.stringify(data, null, 2));
    if (text) {
      console.log('\nExtracted text:\n', text.trim());
    } else {
      console.warn('\nNo textual candidate found in response.');
    }
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(3);
  }
}

main();
