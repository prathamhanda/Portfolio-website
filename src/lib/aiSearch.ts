// Resume context for AI assistant
const RESUME_CONTEXT = `PERSONAL INFORMATION & CONTACT:
Name: Pratham Handa
Role: Computer Science Student
Education: B.Tech. Computer Science & Engineering, Thapar Institute of Engineering & Technology, Patiala (Aug 2023 – May 2027), CGPA 9.83/10
Email: prathamhanda10@gmail.com
LinkedIn: linkedin.com/in/prathamh
GitHub: github.com/prathamhanda
Portfolio: pratham.codes
PROFESSIONAL SUMMARY:
Computer Science student with experience in full stack development and AI-based projects. Strong academic record and competitive programming background.
WORK EXPERIENCE:
1. Web Solutions Engineer Intern — Google, Hyderabad (May – Jul 2026)
   - Architected parallel LLM/RAG pipelines using Gemini Embeddings over 20K+ product changelog documents, saving 33,500+ manual hours
   - Built an Angular and gRPC-Web real-time article diff review editor with Drive APIs and 1P Offline Access
2. Samsung PRISM Research Intern — Remote (Nov 2025 – Mar 2026)
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
- Joint Secretary, LEAD Society (Sep 2023 – May 2026); mentored 250+ students in DSA
- Amazon ML Summer School 2026 selectee
- Semi-Finalist at Flipkart Grid 8.0
- Merit I (twice) and III Scholar (13+ lakhs); Reliance UG Scholar (top 5000 PAN India, 2 lakhs)
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
  "experience": "As a Web Solutions Engineer Intern at Google (May–July 2026), I architected two LLM/RAG pipelines using Gemini Embeddings over 20K+ product changelog documents, saving 33,500+ manual hours, and built an Angular and gRPC-Web editor for real-time article diff reviews. Previously, at Samsung PRISM (Nov 2025–Mar 2026), I built an on-device notification topic extraction pipeline and deployed INT8 TensorFlow Lite models 4× smaller for mobile NPUs.",
  "skills": "I'm proficient in C++, Python, JavaScript/TypeScript for programming; React, Node.js, Express.js, MongoDB for web development; and PyTorch, TensorFlow, YOLO for AI/ML, with practical experience in Docker and AWS.",
  "education": "I'm pursuing a B.Tech. in Computer Science & Engineering at Thapar Institute of Engineering & Technology (Aug 2023–May 2027), with a 9.83/10 CGPA. I am a Merit I (twice) and III Scholar and a Reliance Undergraduate Scholar.",
  "projects": "My portfolio includes the Brain Tumor Detector (99.3% accuracy), AI-RoadIntelligence for traffic optimization (35% reduction in wait times), RoomsOnRent platform, and LEAD Society's website.",
  "contact": "You can reach me at prathamhanda10@gmail.com, connect on LinkedIn (linkedin.com/in/prathamh), or check out my work on GitHub (github.com/prathamhanda).",
  "achievements": "I hold a LeetCode Knight Badge with a 1939 contest rating (top 3.5% globally), have solved 1400+ DSA problems, and was selected for Amazon ML Summer School 2026. I am a Merit I (twice) and III Scholar and Reliance UG Scholar.",
  "leadership": "As Joint Secretary of LEAD Society (Sep 2023–May 2026), I built its official website and mentored 250+ students in a two-hour DSA workshop. I also served as Technical Head for a seminar whose landing page served 500+ users and which featured six speaker presentations.",
  "availability": "I am a Computer Science student at Thapar Institute with internship experience at Google and Samsung, interested in software engineering and applied AI.",
  "text": "You can reach me through my website (pratham.codes), LinkedIn (linkedin.com/in/prathamh), or email (prathamhanda10@gmail.com).",
  "contact information": "Feel free to reach out via email at prathamhanda10@gmail.com or connect with me on LinkedIn at linkedin.com/in/prathamh.",
  "how are you": "I am doing well, thanks for asking. I am building AI and full stack projects and always up for learning something new.",
  "hi": "Hello. Ask me anything about my projects, skills, internships, or experience.",
  "hello": "Hello. Ask me anything about my projects, skills, internships, or experience.",
  "hey": "Hey. Ask me anything about my projects, skills, internships, or experience.",
  "who are you": "I am Pratham Handa, a Computer Science student at Thapar Institute and a full stack and AI engineer. Feel free to ask about my projects or internships.",
  "what do you do": "I am a full stack and AI engineer. I build web platforms and machine learning systems, and I am currently focused on applied AI and developer tooling.",
};

function getFallbackResponse(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim().replace(/[?.!]+$/, "");

  // Exact match first.
  if (fallbackResponses[normalizedQuery]) {
    return fallbackResponses[normalizedQuery];
  }

  // Then substring match: the query contains a known key (e.g. "tell me about your skills").
  for (const [key, value] of Object.entries(fallbackResponses)) {
    if (normalizedQuery.includes(key)) {
      return value;
    }
  }

  // Finally, a known key contains the query, but only for keys long enough
  // to avoid very short queries matching unrelated topics.
  for (const [key, value] of Object.entries(fallbackResponses)) {
    if (normalizedQuery.length >= 4 && key.includes(normalizedQuery)) {
      return value;
    }
  }

  return null;
}

export async function queryAI(query: string): Promise<string> {
  try {
    let startIndex = 0;
    try {
      const stored = localStorage.getItem('gemini_key_index');
      if (stored) {
        startIndex = parseInt(stored, 10);
      } else {
        // Fallback assumption, though the server determines the random start if absent
        startIndex = Math.floor(Math.random() * 5); 
      }
    } catch (e) {
      // Ignore localStorage errors
    }

    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, startIndex }),
    });

    if (!resp.ok) {
      const txt = await resp.text();

      // Server-side failures surface a real diagnostic; surface it in dev only
      // so production users never see internal details or console noise.
      if (import.meta.env.DEV) {
        console.error("[ai] /api/chat failed:", resp.status, txt.slice(0, 300));
      }

      const fallback = getFallbackResponse(query);
      if (fallback) return fallback;
      return "I apologize, but I'm having trouble processing your query at the moment. Please try again or rephrase your question.";
    }

    const data = await resp.json();

    if (data.nextIndex !== undefined) {
      try {
        localStorage.setItem('gemini_key_index', String(data.nextIndex));
      } catch (e) {}
    }

    if (!data.text) {
      const fallback = getFallbackResponse(query);
      if (fallback) return fallback;
      return "I'm sorry, but I couldn't generate a meaningful response. Please try rephrasing your question.";
    }

    return data.text;
  } catch (error) {
    if (import.meta.env.DEV) console.error("[ai] queryAI error:", error);
    
    // Try to get a fallback response
    const fallback = getFallbackResponse(query);
    if (fallback) {
      return fallback;
    }
    
    return "I apologize, but I'm having trouble processing your request. Please try again in a moment.";
  }
}

/**
 * Real health check for the Gemini pipeline.
 * queryAI() swallows errors and falls back to canned text, so it can never be
 * used to detect a broken API. This talks to the server directly and reports
 * the underlying status so misconfiguration is actually visible.
 */
export async function checkGeminiHealth(): Promise<{
  ok: boolean;
  status: number;
  model?: string;
  error?: string;
}> {
  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "ping", startIndex: 0 }),
    });

    const txt = await resp.text();
    if (!resp.ok) {
      let details = txt;
      try {
        details = JSON.parse(txt).details || JSON.parse(txt).error || txt;
      } catch {
        /* keep raw text */
      }
      return { ok: false, status: resp.status, error: String(details).slice(0, 200) };
    }

    const data = JSON.parse(txt);
    return { ok: !!data.text, status: resp.status, model: data.model };
  } catch (e: any) {
    return { ok: false, status: 0, error: String(e?.message || e) };
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
