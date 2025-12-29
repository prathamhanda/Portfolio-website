import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TechStackScroller = () => {
  const { ref: scrollerRef, isVisible: scrollerVisible } = useScrollAnimation();
  const techStack = [
    "React.js",
    "Node.js",
    "Docker",
    "Python",
    "MySQL",
    "MongoDB",
    "TailwindCSS",
    "Docker",
    "Next.js",
    "JavaScript",
    "Node.js",
    "Python",
    "TypeScript",
    "TailwindCSS",
    "Next.js",
  ];

  return (
    <section ref={scrollerRef} className={`py-16 bg-foreground dark:bg-background ${scrollerVisible ? 'scroll-animate' : ''}`}>
      <div className="max-w-full overflow-hidden relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-foreground dark:from-background via-foreground/90 dark:via-background/90 to-transparent z-10" style={{ left: '-1px' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-foreground dark:from-background via-foreground/90 dark:via-background/90 to-transparent z-10" style={{ right: '-1px' }} />
        
        <div className="flex space-x-8 animate-scroll overflow-visible">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="flex items-center shrink-0 group"
            >
              <span className="text-2xl font-medium text-background dark:text-foreground whitespace-nowrap group-hover:text-background/80 dark:group-hover:text-foreground/80">{tech}</span>
              <span className="mx-8 text-background/40 dark:text-foreground/40 transition-colors group-hover:text-background/60 dark:group-hover:text-foreground/60">•</span>
            </div>
          ))}
      </div>
      </div>
    </section>
  );
};

export default TechStackScroller;

// Add styles to your index.css or a similar global stylesheet
const styles = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-scroll {
    animation: scroll 20s linear infinite;
    width: fit-content;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
