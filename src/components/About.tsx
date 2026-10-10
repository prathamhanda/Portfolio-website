import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation();
  
  const skills = {
    fullstack: [
      "C++",
      "C",
      "Python", 
      "JavaScript",
      "TypeScript",
      "React",
      "Java",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "SQL",
      "gRPC-Web",
      "Data Structures",
      "Algorithms",
      "REST API Design",
    ],
    ml: [
      "PyTorch",
      "TensorFlow", 
      "TensorFlow Lite",
      "LLMs",
      "RAG",
      "Transformers",
      "OpenCV",
      "Deep Learning",
      "Computer Vision",
      "YOLO",
      "Model Deployment"
    ],
    tools: [
      "Git",
      "Docker",
      "Postman",
      "SUMO",
      "Google Drive API",
      "CI/CD"
    ],
  };

  return (
    <section id="about" ref={aboutRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className={`space-y-8 ${aboutVisible ? 'scroll-animate' : ''}`}>
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                About Me
              </p>
              <h2 className="text-5xl font-bold mb-8">My background</h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                I'm a Computer Science undergraduate at Thapar Institute of Engineering and Technology with a <span className="font-bold text-black dark:text-white">9.83 CGPA</span> and industry and research experience at <span className="font-bold text-black dark:text-white">Google</span> and <span className="font-bold text-black dark:text-white">Samsung PRISM</span>.
              </p>

              <p>
                At Google, I built LLM-powered semantic search and RAG pipelines over 20K+ product documents. At Samsung PRISM, I worked on on-device topic modeling, optimising ML pipelines for efficient mobile inference.
              </p>

              <p>
                Beyond internships, I enjoy building systems from the ground up. My projects include a 3D brain tumour segmentation pipeline using nnU-Net and PyTorch, and a real-time traffic intelligence system using OpenCV that processes video at 45 FPS with sub-50ms processing latency. 
                
              </p>
                <p>
                  I've solved <span className="font-bold text-black dark:text-white">1,400+ DSA problems</span>, earned <span className="font-bold text-black dark:text-white">LeetCode's Knight</span> badge, and been recognised as a <span className="font-bold text-black dark:text-white">Reliance Undergraduate Scholar</span>. I'm also a Joint Secretary of TIET's LEAD Society and was selected for <span className="font-bold text-black dark:text-white">Amazon ML Summer School 2026</span>.
                  </p>

              <p>
                I'm drawn to challenging problems at the intersection of AI, systems, and software engineering. I enjoy going beyond theory, understanding problems deeply, and turning ideas into useful, reliable solutions.
              </p>
            </div>

          </div>

          {/* Right Content - Skills Card */}
          <div className={`glass-card rounded-3xl p-8 shadow-xl ${aboutVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
            <h3 className="text-2xl font-bold mb-8">Skills & Expertise</h3>

            <div className="space-y-8">
              {/* Software & Full-Stack Development */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Software & Full-Stack Development
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.fullstack.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full text-sm font-medium border border-border hover:border-black dark:hover:border-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Machine Learning & Computer Vision */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Machine Learning & Computer Vision
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.ml.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full text-sm font-medium border border-border hover:border-black dark:hover:border-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Developer Tools & Ecosystem */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Developer Tools & Ecosystem
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full text-sm font-medium border border-border hover:border-black dark:hover:border-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
