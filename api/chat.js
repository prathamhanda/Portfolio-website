export default async function handler(req, res) {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }
  
  const { query, startIndex } = body || {};

  if (!query) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Query is required' }));
    return;
  }

  // Server-side only. Deliberately does NOT read any VITE_* variable: those are
  // inlined into the public client bundle by Vite and would leak the key.
  function getGeminiKeys() {
    const env = process.env || {};
    const keys = [];

    if (env.GEMINI_API_KEYS) {
      keys.push(...String(env.GEMINI_API_KEYS).split(',').map((k) => k.trim()).filter(Boolean));
    }

    for (let i = 1; i <= 5; i++) {
      if (env[`GEMINI_API_KEY${i}`]) keys.push(String(env[`GEMINI_API_KEY${i}`]));
    }

    if (env.GEMINI_API_KEY) keys.push(String(env.GEMINI_API_KEY));

    return Array.from(new Set(keys));
  }

  const keys = getGeminiKeys();
  if (!keys || keys.length === 0) {
    console.error(
      "[gemini] No API key configured. Set GEMINI_API_KEYS in the environment " +
        "(Vercel: Project Settings > Environment Variables). Never use a VITE_* name."
    );
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Gemini API key(s) not configured on server." }));
    return;
  }

  const RESUME_CONTEXT = `PERSONAL INFORMATION & CONTACT:
Name: Pratham Handa
Role: Computer Science Student
Education: B.Tech. Computer Science & Engineering, Thapar Institute of Engineering & Technology, Patiala (Aug 2023 - May 2027), CGPA 9.83/10
Email: prathamhanda10@gmail.com
LinkedIn: linkedin.com/in/prathamh
GitHub: github.com/prathamhanda
Portfolio: pratham.codes
PROFESSIONAL SUMMARY:
Computer Science student with experience in full stack development and AI-based projects. Strong academic record and competitive programming background.
WORK EXPERIENCE:
1. Web Solutions Engineer Intern - Google, Hyderabad (May - Jul 2026)
   - Architected parallel LLM/RAG pipelines using Gemini Embeddings over 20K+ product changelog documents, saving 33,500+ manual hours
   - Built an Angular and gRPC-Web real-time article diff review editor with Drive APIs and 1P Offline Access
2. Samsung PRISM Research Intern - Remote (Nov 2025 - Mar 2026)
   - Designed on-device notification topic extraction trained on 5,500+ messages using RAKE pseudo-labels
   - Benchmarked MobileBERT, DistilBERT and BERT-base; deployed INT8 TensorFlow Lite models 4x smaller for mobile NPUs
TECHNICAL SKILLS:
Programming Languages:
- C++, Python, JavaScript/TypeScript, Java, SQL
Frameworks & Technologies:
- React, Next.js, Node.js, Express
- MongoDB, PostgreSQL
- PyTorch, TensorFlow, YOLO, OpenCV
- Git, Docker
PROJECT PORTFOLIO:
1. Brain Tumor Detector
   - AI-based tumor classification and segmentation
   - Built using PyTorch, YOLO, FastAPI
2. AI-RoadIntelligence
   - Real-time traffic optimization system
   - Computer vision based solution
3. RoomsOnRent
   - Full stack student housing platform
   - MERN + Docker
ACHIEVEMENTS & LEADERSHIP:
- LeetCode Knight Badge (Top 3.5%)
- 1400+ DSA problems solved; LeetCode Knight, 1939 contest rating (top 3.5%)
- Merit I & III Scholarship recipient from TIET
- Reliance Undergraduate Scholar
- Student Placement Representative (CSE), TIET
- Joint Secretary, LEAD Society (Sep 2023 - May 2026); mentored 250+ students in DSA
- Amazon ML Summer School 2026 selectee
- Semi-Finalist at Flipkart Grid 8.0
- Merit I (twice) and III Scholar (13+ lakhs); Reliance UG Scholar (top 5000 PAN India, 2 lakhs)
ADDITIONAL INFORMATION:
Languages: English, Hindi, Punjabi
`;

  const prompt = `You are an AI assistant for Pratham Handa's portfolio website. You have access to Pratham's complete professional profile and should provide helpful, accurate responses to visitors' questions. Consider the following detailed information:
${RESUME_CONTEXT}

Question: ${query}
Instructions for providing responses:
1. Voice and Tone:
   - Answer in Pratham's voice (first person, present tense)
   - Be confident but humble
2. Accuracy (critical):
   - Use ONLY the profile above. It is the single source of truth.
   - Never invent employers, dates, projects, or metrics that are not listed.
   - If the answer is not in the profile, say so honestly instead of guessing.
3. Content Guidelines:
   - Provide specific, data-backed information when available
   - Highlight achievements and metrics that support your answer
4. Response Structure:
   - Prefer concise answers, but always finish sentences and include proper punctuation. Do not truncate important details. And DON'T exceed 2 lines in response.
   - Keep the response as condensed as possible while ensuring clarity and completeness.
   - Start with the most relevant information
5. Always:
   - Stay within the scope of the provided information
   - Maintain consistency with the portfolio website
Remember: You are representing a professional developer's portfolio. Your responses should reflect technical expertise while remaining accessible to all visitors.`;

  const n = keys.length;
  let start = 0;
  if (typeof startIndex === 'number' && !isNaN(startIndex)) {
    start = startIndex % n;
  } else {
    start = Math.floor(Math.random() * n);
  }

  // Model preference chain, ordered by measured reliability and latency for this
  // account (verified against the live API):
  //   gemini-3.5-flash-lite  ~1.1s, 12/12 success  <- primary
  //   gemini-3.1-flash-lite  ~2.9s                   <- backup
  //   gemini-3.6-flash       ~3.4s                   <- backup
  //   gemini-3.8-flash       ~6-12s, intermittent "high demand", kept last on purpose
  const MODELS = [
    process.env.GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
  ].filter(Boolean);

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      topP: 0.6,
      topK: 30,
      maxOutputTokens: 300,
    },
  };

  const generate = async (key, model) => {
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(key),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!resp.ok) {
      // Read the body as text so the upstream error message can be surfaced for debugging.
      const txt = await resp.text().catch(() => "");
      return { ok: false, model, status: resp.status, error: `status=${resp.status} body=${String(txt).slice(0, 300)}` };
    }
    return { ok: true, model, json: await resp.json() };
  };

  let lastErrorText = null;
  let data = null;
  let ok = false;
  let usedIndex = start;
  let usedModel = null;

  outer:
  for (let attempt = 0; attempt < n; attempt++) {
    usedIndex = (start + attempt) % n;
    const key = keys[usedIndex];
    for (const model of MODELS) {
      try {
        const r = await generate(key, model);
        if (r.ok) {
          data = r.json;
          usedModel = r.model;
          ok = true;
          break outer;
        }
        lastErrorText = `[${model}] ${r.error}`;
        // Fail fast on key-level errors: retrying the same bad key against every
        // remaining model only adds latency, it can never succeed.
        if (r.status === 400 || r.status === 401 || r.status === 403) {
          break;
        }
      } catch (err) {
        lastErrorText = `[${model}] ${String(err?.message || err)}`;
      }
    }
  }

  if (!ok) {
    console.error("[gemini] All keys/models failed. Last error:", lastErrorText);
  }

  res.setHeader('Content-Type', 'application/json');

  if (!ok || !data) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: "All Gemini keys failed", details: lastErrorText }));
    return;
  }

  // Robustly extract text: Gemini may return multiple parts, and non-text parts must be skipped.
  const candidate = data.candidates?.[0];
  let text = (candidate?.content?.parts || [])
    .map((p) => (typeof p?.text === "string" ? p.text : ""))
    .join("")
    .trim();

  // Surface safety blocks / prompt feedback instead of a vague "empty response" error.
  const finishReason = candidate?.finishReason;
  if (!text) {
    const blocked = data.promptFeedback?.blockReason
      || (candidate?.safetyRatings || []).find((r) => r?.blocked)?.category
      || null;
    res.statusCode = 500;
    res.end(JSON.stringify({
      error: "Empty response from API",
      model: usedModel,
      finishReason: finishReason || null,
      blocked: blocked || null,
    }));
    return;
  }

  // The previous 10-char floor rejected short but valid conversational replies.
  if (text.length < 2) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Response too short", model: usedModel }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ text, nextIndex: (usedIndex + 1) % n, model: usedModel }));
}
