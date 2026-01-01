import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation();
  
  const skills = {
    fullstack: [
      "C++",
      "Python", 
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Data Structures",
      "Algorithms",
      "REST API Design",
    ],
    ml: [
      "PyTorch",
      "TensorFlow", 
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
      "VS Code",
      "Streamlit",
      "SUMO",
      "JWT Authentication",
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
                I'm a third-year Computer Science Engineering student at Thapar Institute of Engineering & Technology, maintaining a <span className="font-bold text-black dark:text-white">CGPA of 9.75</span>. Currently, I work as a Full Stack Developer Intern at DBuck, where I've built and scaled a web platform used by 10,000+ students for housing solutions, working end-to-end with the MERN stack.
              </p>

              <p>
                My work lies at the intersection of software engineering and applied AI. I have designed deep learning pipelines for medical diagnostics achieving 99.3% accuracy, and built containerized web applications that reduced response times by up to 75%. Alongside this, I actively strengthen my problem solving skills, having solved <span className="font-bold text-black dark:text-white">1000+ DSA problems</span> on competitive platforms and earning a Knight Badge on LeetCode, placing me in the <span className="font-bold text-black dark:text-white">top 3.5 %</span> globally with a contest rating of 1939. </p>

              <p>
                What truly drives me is solving real-world problems with measurable impact. Whether it's optimizing traffic systems to run at 45 FPS, architecting scalable platforms, or building AI models that assist in surgical planning, I approach every challenge with precision, curiosity, and a strong focus on delivering results that matter.
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
