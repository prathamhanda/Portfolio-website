import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const { ref: aboutRef, isVisible: aboutVisible } = useScrollAnimation();
  
  const skills = {
    development: [
      "C++",
      "Python",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "PyTorch",
      "TensorFlow",
      "OpenCV"
    ],
    design: ["Deep Learning", "Computer Vision", "YOLO", "Data Structures", "Algorithms"],
    tools: ["Git", "Docker", "POSTMAN", "VS Code", "SUMO", "Streamlit"],
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
                I'm a third year Computer Science Engineering student at Thapar Institute of Engineering & Technology with a CGPA of 9.75. Currently working as a Full Stack Developer Intern at DBuck, where I built a web platform serving 10K+ students for housing solutions using the MERN stack.
              </p>

              <p>
                My journey spans from building deep learning pipelines that achieve 99.3% accuracy in medical diagnostics to creating containerized web applications with 75% response time reductions. I've solved 600+ DSA problems on competitive coding platforms and earned a Knight Badge on LeetCode, ranking in the top 3.5% globally with a contest rating of 1939.
              </p>

              <p>
                What drives me is solving real-world problems with measurable impact. Whether it's optimizing traffic systems at 45 FPS, architecting scalable platforms, or building AI models that aid surgical planning, I approach each challenge with precision and a focus on delivering quantifiable results.
              </p>
            </div>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 text-lg font-medium border-b-2 border-black pb-1 hover:gap-4 transition-all"
            >
              See my work
            </a>
          </div>

          {/* Right Content - Skills Card */}
          <div className={`glass-card rounded-3xl p-8 shadow-xl ${aboutVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
            <h3 className="text-2xl font-bold mb-8">Skills & Expertise</h3>

            <div className="space-y-8">
              {/* Development */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Development
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.development.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-border hover:border-black transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Design */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Design
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.design.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-border hover:border-black transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-border hover:border-black transition-colors"
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
