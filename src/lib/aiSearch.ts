// Resume context for AI assistant
const RESUME_CONTEXT = `
Pratham Handa: A 3rd-year Computer Science student at Thapar Institute (9.75 CGPA)[cite: 4, 5].

WORK EXPERIENCE:
- Full Stack Developer Intern at DBuck: Developed a MERN stack web app for a student housing startup, serving over 10,000 students[cite: 9, 10, 17, 18].

KEY SKILLS:
- Languages: C++, Python, JavaScript[cite: 32].
- AI/ML: PyTorch, YOLO, OpenCV, Scikit-learn, TensorFlow[cite: 32].
- Web Dev: React, Node.js, Express.js, MongoDB, Docker, REST APIs[cite: 32].
- Core CS: Data Structures & Algorithms, OS, DBMS, OOP[cite: 32].

PROJECT HIGHLIGHTS:
- Brain Tumor Detector: Achieved 99.3% classification accuracy and 97.2% IoU using a deep learning pipeline[cite: 21].
- AI-RoadIntelligence: Engineered a real-time traffic management system with YOLOv8[cite: 24].
- RoomsonRent: Deployed a containerized MERN stack platform for student housing[cite: 26, 28].

ACHIEVEMENTS & LEADERSHIP:
- Solved 1,000+ DSA problems on LeetCode/GeeksforGeeks; earned Knight Badge on LeetCode (Top 3.5% globally)[cite: 44, 48].
- Recipient of Reliance Undergraduate Scholarship and Merit III Scholarship.
- Student Placement Representative for the CSE branch[cite: 45].
- Joint Secretary of LEAD Society, where I built the official website and mentored 50+ students in DSA[cite: 34, 37, 38].
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

export async function queryAI(query: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return "AI feature not configured.";
    }

    const prompt = `You are an AI assistant for Pratham Handa's portfolio. Answer briefly (1-2 sentences) based on this info:

${RESUME_CONTEXT}

Question: ${query}

Answer as Pratham would, professionally and concisely.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
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
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const error = JSON.parse(errorText);
      return `API Error (${response.status}): ${error.error?.message || "Unable to process query"}`;
    }

    const data: GeminiResponse = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate response";

    return text;
  } catch (error) {
    return "Error processing AI query.";
  }
}

export function isHardcodedQuery(query: string): boolean {
  const hardcodedKeywords = [
    "projects",
    "about",
    "contact",
    "github",
    "linkedin",
    "resume",
    "theme",
    "dark",
    "light",
    "brain tumor",
    "road intelligence",
    "roomsonrent",
    "lead society",
  ];

  const lowerQuery = query.toLowerCase().trim();
  
  // Check if query starts with or matches any hardcoded keyword (prefix matching)
  return hardcodedKeywords.some((keyword) =>
    keyword.startsWith(lowerQuery) || lowerQuery.startsWith(keyword)
  );
}
