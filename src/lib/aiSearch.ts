// Resume context for AI assistant
const RESUME_CONTEXT = `
PERSONAL INFORMATION & CONTACT:
Name: Pratham Handa
Role: Computer Science Student & Full Stack Developer
Education: 3rd Year, Computer Science Engineering at Thapar Institute (9.75 CGPA)
Email: prathamhanda10@gmail.com
LinkedIn: linkedin.com/in/prathamh
GitHub: github.com/prathamhanda
Portfolio: pratham.codes

PROFESSIONAL SUMMARY:
A passionate Computer Science student and Full Stack Developer with expertise in AI/ML and web development. Known for delivering high-performance solutions and maintaining excellent academic performance. Strong problem-solving skills demonstrated through competitive programming achievements.

WORK EXPERIENCE:
1. Full Stack Developer Intern at DBuck (2023)
   - Led development of a MERN stack web application for student housing
   - Served 10,000+ active student users
   - Implemented real-time booking system and payment integration
   - Technologies: React, Node.js, Express, MongoDB, Docker
   - Improved platform efficiency by 40% through optimization
2. Upcoming Intern at Google (Summer 2026)
    - Selected for Web Solutions Engineer Internship
    - Will work on scalable web solutions and cloud technologies
    - Focus on enhancing web performance and user experience
    - Collaborate with cross-functional teams on innovative projects
    - Gain hands-on experience with Google's web technologies

TECHNICAL SKILLS:
Programming Languages:
- Advanced: C++, Python, JavaScript/TypeScript
- Intermediate: Java, SQL, HTML/CSS
- Basic: Rust, Go

Frameworks & Technologies:
- Web Development: React, Next.js, Node.js, Express.js, MongoDB, PostgreSQL
- AI/ML: PyTorch, TensorFlow, YOLO, OpenCV, Scikit-learn
- DevOps: Docker, Git, AWS, CI/CD
- Tools: VS Code, PyCharm, Postman, Jupyter

PROJECT PORTFOLIO:
1. Brain Tumor Detector (AI/Healthcare)
   - Achieved 99.3% classification accuracy and 97.2% IoU
   - Built deep learning pipeline using PyTorch and YOLO
   - Deployed as a web application using FastAPI
   - GitHub: github.com/prathamhanda/BrainTumor-Detector

2. AI-RoadIntelligence (Computer Vision)
   - Real-time traffic optimization using YOLOv8
   - Reduced average traffic wait time by 35%
   - Implemented on actual traffic intersections
   - GitHub: github.com/prathamhanda/AI-RoadIntelligence

3. RoomsOnRent (Full Stack)
   - Containerized dual-portal platform for student housing
   - Features: Real-time availability, virtual tours, instant booking
   - Tech Stack: MERN + Docker + AWS
   - Live: roomsonrent.prathamhanda.com

4. LEAD Society Website (Web Development)
   - Official website with event management system
   - 500+ active monthly users
   - Live: www.leadtiet.netlify.app

ACHIEVEMENTS & LEADERSHIP:
Competitive Programming:
- LeetCode Knight Badge (Top 3.5% globally)
- 1000+ DSA problems solved on LeetCode/GeeksforGeeks
- Regular participant in coding competitions

Academic Excellence:
- Current CGPA: 9.75/10
- Reliance Undergraduate Scholarship recipient
- Merit III Scholarship awardee

Leadership:
- Student Placement Representative for CSE branch
- Joint Secretary of LEAD Society
- Mentored 50+ students in DSA and web development
- Organized 10+ technical workshops and hackathons

WORK STYLE & APPROACH:
- Collaborative team player with strong communication skills
- Detail-oriented with focus on clean, maintainable code
- Quick learner adapting to new technologies
- Agile methodology practitioner
- Regular contributor to open-source projects
- Emphasis on documentation and code reviews

ADDITIONAL INFORMATION:
Languages: English (Professional), Hindi (Native)
Interests: Competitive Programming, Open Source, Tech Blogging
Availability: Open to Full-time opportunities from May 2024
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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API key not configured");
      return "AI feature not configured. Please check the environment variables.";
    }

    // Enhanced prompt with better context and instructions
    const prompt = `You are an AI assistant for Pratham Handa's portfolio website. You have access to Pratham's complete professional profile and should provide helpful, accurate responses to visitors' questions. Consider the following detailed information:

${RESUME_CONTEXT}

Question: ${query}

Instructions for providing responses:
1. Voice and Tone:
   - Answer in Pratham's voice (first person)
   - Maintain a professional yet approachable tone
   - Be confident but humble

2. Content Guidelines:
   - Provide specific, data-backed information when available
   - Include relevant links or contact methods when appropriate
   - Highlight achievements and metrics that support your answer
   - Connect different aspects of experience when relevant

3. Response Structure:
  - Prefer concise answers, but always finish sentences and include proper punctuation. Do not truncate important details. And DON'T Exceed 3 lines in response.
  - Start with the most relevant information
  - Include a call-to-action when appropriate (e.g., "Check out my project at [link]")

4. Special Cases:
   - For contact requests: Provide appropriate contact method(s)
   - For technical questions: Reference specific projects/skills
   - For availability: Mention timeline and preferred roles
   - For location/collaboration: Specify remote/onsite preferences

5. Always:
   - Be accurate and truthful
   - Stay within the scope of the provided information
   - Maintain consistency with the portfolio website
   - Provide actionable information when possible

Remember: You are representing a professional developer's portfolio. Your responses should reflect technical expertise while remaining accessible to all visitors.`;

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
                    maxOutputTokens: 1500,
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                  },
        }),
      }
    );

    if (!response.ok) {
      console.error("API Error:", response.status);
      const errorText = await response.text();
      console.error("API Error details:", errorText);
      
      // Try to get a fallback response
      const fallback = getFallbackResponse(query);
      if (fallback) {
        return fallback;
      }
      
      return `I apologize, but I'm having trouble processing your query at the moment. Please try again or rephrase your question.`;
    }

    const data: GeminiResponse = await response.json();
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
