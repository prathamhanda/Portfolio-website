const TechStackScroller = () => {
  const techStack = [
    "React",
    "Node.js",
    "AI Engineering",
    "UI/UX Design",
    "TypeScript",
    "Next.js",
    "Product Design",
    "JavaScript",
    "React",
    "Node.js",
    "AI Engineering",
    "UI/UX Design",
    "TypeScript",
    "Next.js",
    "Product Design",
    "JavaScript",
  ];

  return (
    <div className="relative py-12 bg-white/50 backdrop-blur-sm overflow-hidden">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white/80 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/80 to-transparent z-10" />
      
      <div className="flex animate-scroll">
        {techStack.map((tech, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-4 text-2xl font-medium text-foreground/60"
          >
            {tech}
            <span className="mx-4 text-foreground/30">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackScroller;
