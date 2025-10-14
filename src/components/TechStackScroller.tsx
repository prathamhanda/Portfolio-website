import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TechStackScroller = () => {
  const { ref: scrollerRef, isVisible: scrollerVisible } = useScrollAnimation();
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
    <section ref={scrollerRef} className={`py-16 bg-foreground dark:bg-background overflow-hidden ${scrollerVisible ? 'scroll-animate' : ''}`}>
      <div className="relative">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-foreground dark:from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-foreground dark:from-background to-transparent z-10" />
      
      <div className="flex animate-scroll">
        {techStack.map((tech, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-4 text-2xl font-medium text-background dark:text-foreground"
          >
            {tech}
            <span className="mx-4 text-background/40 dark:text-foreground/40">•</span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default TechStackScroller;
