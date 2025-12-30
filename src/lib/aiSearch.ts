// Resume context for AI assistant
const RESUME_CONTEXT = `PERSONAL INFORMATION & CONTACT:
Name: Pratham Handa
Role: Computer Science Student
Education: 3rd Year, CSE, Thapar Institute (CGPA: 9.75)
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

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// Fallback responses for common queries when AI fails
const fallbackResponses: Record<string, string> = {
  "work style": "I thrive in collaborative environments, following agile methodologies with a strong emphasis on clean code, documentation, and code reviews. I'm detail-oriented and regularly contribute to open-source projects.",
  "experience": "As a Full Stack Developer Intern at DBuck, I led the development of a MERN stack web app serving 10,000+ students, implementing real-time booking systems and achieving 40% platform efficiency improvement.",
  "skills": "I'm proficient in C++, Python, JavaScript/TypeScript for programming; React, Node.js, Express.js, MongoDB for web development; and PyTorch, TensorFlow, YOLO for AI/ML, with practical experience in Docker and AWS.",
  "education": "I'm a 3rd-year Computer Science Engineering student at Thapar Institute, maintaining a 9.75 CGPA and receiving both Reliance Undergraduate and Merit III Scholarships.",
  "projects": "My portfolio includes the Brain Tumor Detector (99.3% accuracy), AI-RoadIntelligence for traffic optimization (35% reduction in wait times), RoomsOnRent platform, and LEAD Society's website.",
  "contact": "You can reach me at prathamhanda10@gmail.com, connect on LinkedIn (linkedin.com/in/prathamh), or check out my work on GitHub (github.com/prathamhanda).",
  "achievements": "I hold a LeetCode Knight Badge (top 3.5% globally), solved 1000+ DSA problems, and serve as Student Placement Representative while maintaining a 9.75 CGPA.",
  "leadership": "As Joint Secretary of LEAD Society, I've mentored 50+ students in DSA and web development, organized 10+ technical workshops, and maintain active involvement in the tech community.",
  "availability": "I'm open to full-time opportunities starting from May 2024, with a focus on full-stack development, AI/ML, or software engineering roles.",
  "text": "You can reach me through my website (pratham.codes), LinkedIn (linkedin.com/in/prathamh), or email (prathamhanda10@gmail.com).",
  "contact information": "Feel free to reach out via email at prathamhanda10@gmail.com or connect with me on LinkedIn at linkedin.com/in/prathamh.",
};

function getFallbackResponse(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for exact matches first
  if (fallbackResponses[normalizedQuery]) {
    return fallbackResponses[normalizedQuery];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(fallbackResponses)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      return value;
    }
  }
  
  return null;
}

export async function queryAI(query: string): Promise<string> {
  try {
    // Support multiple Gemini keys. The environment can provide:
    // - VITE_GEMINI_API_KEYS (comma-separated list)
    // - VITE_GEMINI_API_KEY1 ... VITE_GEMINI_API_KEY5
    // - fallback VITE_GEMINI_API_KEY (single key)
    const env = (import.meta as any).env || {};

    function getGeminiKeys(): string[] {
      const keys: string[] = [];
      if (env.VITE_GEMINI_API_KEYS) {
        keys.push(...String(env.VITE_GEMINI_API_KEYS).split(',').map((k: string) => k.trim()).filter(Boolean));
      }
      for (let i = 1; i <= 5; i++) {
        const k = env[`VITE_GEMINI_API_KEY${i}`];
        if (k) keys.push(String(k));
      }
      if (env.VITE_GEMINI_API_KEY) {
        keys.push(String(env.VITE_GEMINI_API_KEY));
      }
      // de-duplicate while preserving order
      return Array.from(new Set(keys));
    }

    // Persistent rotation index: prefer localStorage in browser, otherwise use module-level counter
    let rotationIndex = (globalThis as any).__GEMINI_ROTATION_INDEX || 0;

    function consumeStartIndex(n: number): number {
      if (n <= 0) return 0;
      try {
        const stored = localStorage.getItem('gemini_key_index');
        let idx = stored ? parseInt(stored, 10) : 0;
        const start = idx % n;
        idx = (idx + 1) % n;
        localStorage.setItem('gemini_key_index', String(idx));
        return start;
      } catch (e) {
        const start = rotationIndex % n;
        rotationIndex = (rotationIndex + 1) % n;
        (globalThis as any).__GEMINI_ROTATION_INDEX = rotationIndex;
        return start;
      }
    }

    const keys = getGeminiKeys();
    if (!keys || keys.length === 0) {
      console.error("Gemini API key(s) not configured");
      return "AI feature not configured. Please check the environment variables.";
    }

    // Enhanced prompt with better context and instructions
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

    // Try each configured key in round-robin order. We consume a start index so
    // each call prefers a different primary key and will retry with others.
    const start = consumeStartIndex(keys.length);
    let lastErrorText: string | null = null;
    let data: GeminiResponse | null = null;
    let ok = false;

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const key = keys[(start + attempt) % keys.length];
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
          // try the next key
          continue;
        }

        data = await resp.json();
        ok = true;
        break;
      } catch (err: any) {
        lastErrorText = String(err?.message || err);
        // try next key
        continue;
      }
    }

    if (!ok || !data) {
      console.error("All Gemini keys failed", lastErrorText);
      const fallback = getFallbackResponse(query);
      if (fallback) return fallback;
      return `I apologize, but I'm having trouble processing your query at the moment. Please try again or rephrase your question.`;
    }

    

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Validate and clean up the response
    if (!text || text.length < 10) {
      console.warn("Empty or very short response from API");
      const fallback = getFallbackResponse(query);
      if (fallback) {
        return fallback;
      }
      return "I'm sorry, but I couldn't generate a meaningful response. Please try rephrasing your question.";
    }

    return text;
  } catch (error) {
    console.error("Error in queryAI:", error);
    
    // Try to get a fallback response
    const fallback = getFallbackResponse(query);
    if (fallback) {
      return fallback;
    }
    
    return "I apologize, but I'm having trouble processing your request. Please try again in a moment.";
  }
}

export function isHardcodedQuery(query: string): boolean {
  const hardcodedKeywords = [
    // Navigation
    "projects",
    "contact",
    "resume",
    "theme",
    "cv",
    "github",
    "linkedin"
  ];

  const lowerQuery = query.toLowerCase().trim();
  
  // Check if query starts with or matches any hardcoded keyword (prefix matching)
  return hardcodedKeywords.some((keyword) =>
    keyword.startsWith(lowerQuery) || lowerQuery.startsWith(keyword)
  );
}
