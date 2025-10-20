import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

const timelineData: TimelineItem[] = [
  {
    date: "January 15, 2024",
    title: "Phase I",
    description: "Initial data collection and model architecture design for the AI system.",
  },
  {
    date: "March 30, 2024",
    title: "Phase II",
    description: "Model training and validation with core dataset implementation.",
  },
  {
    date: "June 15, 2024",
    title: "Phase III",
    description: "Integration of advanced features and performance optimization.",
  },
  {
    date: "September 1, 2024",
    title: "Phase IV",
    description: "Final testing, deployment, and continuous improvement system launch.",
  },
];

const Timeline = () => {
  const { ref, isVisible } = useScrollAnimation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate when element is in viewport
      const startScroll = elementTop - windowHeight + 200;
      const endScroll = elementTop + elementHeight - windowHeight / 2;

      if (elementTop < windowHeight && elementTop > -elementHeight) {
        const progress = Math.max(
          0,
          Math.min(100, ((windowHeight - elementTop) / (windowHeight + elementHeight)) * 100)
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={timelineRef}
      className="py-24 px-6 lg:px-8 relative overflow-hidden"
      id="timeline"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div ref={ref} className={isVisible ? "scroll-animate" : "opacity-0"}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-20">
            Timeline
          </h2>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block relative">
          {/* Background Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-border" />
          
          {/* Animated Progress Line */}
          <div
            className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-accent via-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* Timeline Items */}
          <div className="grid grid-cols-4 gap-8 relative">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`relative ${
                  isVisible ? `scroll-animate scroll-animate-delay-${index + 1}` : "opacity-0"
                }`}
              >
                {/* Dot */}
                <div className="relative flex justify-center mb-8">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      scrollProgress > (index / (timelineData.length - 1)) * 100
                        ? "bg-accent border-accent shadow-lg shadow-accent/50 scale-125"
                        : "bg-background border-border"
                    }`}
                  />
                </div>

                {/* Content Card */}
                <div className="glass-card p-6 rounded-xl group cursor-default border border-black/60 dark:border-gray-400">
                  <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden relative pl-8">
          {/* Background Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Animated Progress Line */}
          <div
            className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-accent via-primary to-accent transition-all duration-300 ease-out"
            style={{ height: `${scrollProgress}%` }}
          />

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`relative ${
                  isVisible ? `scroll-animate scroll-animate-delay-${index + 1}` : "opacity-0"
                }`}
              >
                {/* Dot */}
                <div className="absolute -left-[26px] top-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      scrollProgress > (index / (timelineData.length - 1)) * 100
                        ? "bg-accent border-accent shadow-lg shadow-accent/50 scale-125"
                        : "bg-background border-border"
                    }`}
                  />
                </div>

                {/* Content Card */}
                <div className="glass-card p-6 rounded-xl group cursor-default border border-black/60 dark:border-gray-400 ml-4">
                  <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
