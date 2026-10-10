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

  function getGeminiKeys() {
    const keys = [];
    const env = process.env || {};
    
    if (env.GEMINI_API_KEYS) keys.push(...String(env.GEMINI_API_KEYS).split(',').map(k => k.trim()).filter(Boolean));
    if (env.VITE_GEMINI_API_KEYS) keys.push(...String(env.VITE_GEMINI_API_KEYS).split(',').map(k => k.trim()).filter(Boolean));
    
    for (let i = 1; i <= 5; i++) {
      if (env[`GEMINI_API_KEY${i}`]) keys.push(String(env[`GEMINI_API_KEY${i}`]));
      if (env[`VITE_GEMINI_API_KEY${i}`]) keys.push(String(env[`VITE_GEMINI_API_KEY${i}`]));
    }
    
    if (env.GEMINI_API_KEY) keys.push(String(env.GEMINI_API_KEY));
    if (env.VITE_GEMINI_API_KEY) keys.push(String(env.VITE_GEMINI_API_KEY));
    
    return Array.from(new Set(keys));
  }

  const keys = getGeminiKeys();
  if (!keys || keys.length === 0) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Gemini API key(s) not configured on server." }));
    return;
  }

  const RESUME_CONTEXT = `PERSONAL INFORMATION & CONTACT:
Name: Pratham Handa
Role: Computer Science Student
Education: 3rd Year, CSE, Thapar Institute (CGPA: 9.83)
Email: prathamhanda10@gmail.com
LinkedIn: linkedin.com/in/prathamh
GitHub: github.com/prathamhanda
Portfolio: pratham.codes
PROFESSIONAL SUMMARY:
Computer Science student with experience in full stack development and AI-based projects. Strong academic record and competitive programming background.
WORK EXPERIENCE:
1. Full Stack Developer Intern — DBuck (2023)
   - Built MERN-based student housing platform
   - Used by 10,000+ students
   - Implemented booking and payment features
   - Tech: React, Node.js, MongoDB, Docker
2. Web Solutions Engineer Intern — Google (Summer 2026)
   - Incoming intern
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
- 1000+ DSA problems solved
- Merit I & III Scholarship recipient from TIET
- Reliance Undergraduate Scholar
- Student Placement Representative (CSE)
- Joint Secretary, LEAD Society
ADDITIONAL INFORMATION:
Languages: English, Hindi, Punjabi
`;

  const prompt = `You are an AI assistant for Pratham Handa's portfolio website. You have access to Pratham's complete professional profile and should provide helpful, accurate responses to visitors' questions. Consider the following detailed information:
${RESUME_CONTEXT}

Question: ${query}
Instructions for providing responses:
1. Voice and Tone:
   - Answer in Pratham's voice (first person)
   - Be confident but humble
2. Content Guidelines:
   - Provide specific, data-backed information when available
   - Highlight achievements and metrics that support your answer
3. Response Structure:
  - Prefer concise answers, but always finish sentences and include proper punctuation. Do not truncate important details. And DON'T Exceed 2 lines in response.
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

  let lastErrorText = null;
  let data = null;
  let ok = false;
  let usedIndex = start;

  for (let attempt = 0; attempt < n; attempt++) {
    usedIndex = (start + attempt) % n;
    const key = keys[usedIndex];
    try {
      const resp = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
              temperature: 0.3,
              topP: 0.6,
              topK: 30,
            },
          }),
        }
      );

      if (!resp.ok) {
        const txt = await resp.text();
        lastErrorText = `status=${resp.status} body=${txt}`;
        continue;
      }

      data = await resp.json();
      ok = true;
      break;
    } catch (err) {
      lastErrorText = String(err?.message || err);
      continue;
    }
  }

  res.setHeader('Content-Type', 'application/json');

  if (!ok || !data) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: "All Gemini keys failed", details: lastErrorText }));
    return;
  }

  let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  
  if (!text || text.length < 10) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Empty or very short response from API" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ text, nextIndex: (usedIndex + 1) % n }));
}
