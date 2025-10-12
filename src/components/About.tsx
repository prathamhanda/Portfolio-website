const About = () => {
  const skills = {
    development: [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "TanStack",
    ],
    design: ["UI/UX", "Figma", "Adobe Suite", "Prototyping", "Motion Design"],
    tools: ["Git", "AWS", "Firebase", "Docker", "Vercel", "Linux"],
  };

  return (
    <section id="about" className="py-24 gradient-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                About Me
              </p>
              <h2 className="text-5xl font-bold mb-8">My background</h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                I'm a creative, independent, and passionate developer with extensive
                experience creating impactful digital experiences and solutions.
              </p>

              <p>
                With a strong background in both development and design, I bring a
                unique perspective to every project I work on. I believe in creating
                solutions that not only look great but also solve real problems for
                users.
              </p>

              <p>
                My journey in tech started with UI design, which naturally evolved
                into frontend development, and eventually full-stack skills. Today, I
                specialize in building modern web applications with a focus on
                performance, accessibility, and user experience.
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
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
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
