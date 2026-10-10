import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface TimelineItem {
  date: string;
  title: string;
  company?: string;
  companyUrl?: string;
  period?: string;
  summary: string;
  tags: string[];
}

const timelineData: TimelineItem[] = [
  {
    date: "MAY 2026 – JUL 2026",
    title: "Web Solutions Engineer Intern",
    company: "Google",
    companyUrl: "https://about.google/",
    period: "MAY 2026 – JUL 2026",
    summary:
      "Architected two parallel LLM/RAG pipelines over 20K+ product changelog documents, saving 33,500+ manual hours, and built an Angular and gRPC-Web editor for real-time article diff reviews.",
    tags: ["Gemini Embeddings", "LLMs", "RAG", "Angular", "gRPC-Web", "Google Drive API"],
  },
  {
    date: "NOV 2025 – MAR 2026",
    title: "Samsung PRISM Research Intern",
    company: "Samsung Research (PRISM)",
    companyUrl: "https://research.samsung.com/",
    period: "NOV 2025 – MAR 2026",
    summary:
      "Designed an on-device notification topic extraction pipeline trained on 5,500+ messages with RAKE pseudo-labels; benchmarked transformer models and deployed INT8-quantized TensorFlow Lite models (4× smaller) for mobile NPUs.",
    tags: ["Transformers", "PyTorch", "TensorFlow Lite", "INT8", "NLP", "MobileBERT"],
  },
  {
    date: "APR 2025 – JUN 2026",
    title: "Full Stack Developer Intern",
    company: "DBuck Technologies Pvt. Ltd.",
    companyUrl: "https://dbuck.in",
    period: "APR 2025 – JUN 2026",
    summary:
      "Built and deployed a student housing platform with separate student and owner portals, supporting 10k+ users with a containerized backend and APIs.",
    tags: ["React", "Node.js", "MongoDB", "Docker", "APIs", "Software Architecture"],
  },
  {
    date: "JUN – JUL 2025",
    title: "Experiential Learning Center Intern",
    company: "Thapar Institute of Engineering & Technology",
    companyUrl:
      "https://www.thapar.edu/academics/centers/experiential-learning-centre1",
    period: "JUN 2025 – JUL 2025",
    summary:
      "Prototyped a real-time traffic monitoring and simulation workflow (~45 FPS, low latency) to evaluate signal strategies for demos.",
    tags: ["Python", "Machine Learning", "OpenCV", "Simulation", "SUMO"],
  },
  // {
  //   date: "AUG 2024 – PRESENT",
  //   title: "Student Placement Representative",
  //   company: "Thapar Institute of Engineering & Technology",
  //   companyUrl: "https://thapar.edu",
  //   period: "Aug 2024 – Present",
  //   summary:
  //     "Supported campus placements by onboarding companies, managing schedules, and keeping recruiter–student communication smooth as an SPO liaison.",
  //   tags: ["Coordination", "Recruiter Relations", "Operations", "Communication"],
  // },
];

const Timeline = () => {
  const { ref, isVisible } = useScrollAnimation();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const scrollAccumulator = useRef(0);
  const [hasPassedProjects, setHasPassedProjects] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight && elementTop > -elementHeight) {
        const progress = Math.max(
          0,
          Math.min(100, ((windowHeight - elementTop) / (windowHeight + elementHeight)) * 100)
        );
        setScrollProgress(progress);
      }

      // One-time check: if user has scrolled past the #projects section, mark flag
      if (!hasPassedProjects) {
        const projectsEl = document.getElementById('projects') || document.querySelector('[data-section="projects"]') as HTMLElement | null;
        if (projectsEl) {
          const projBottom = projectsEl.getBoundingClientRect().bottom + window.scrollY;
          if (window.scrollY > projBottom) {
            setHasPassedProjects(true);
            setVisibleItems(timelineData.length);
            setScrollProgress(100);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!timelineRef.current) return;
      
      // Only apply scroll-jacking on desktop (lg breakpoint = 1024px)
      if (window.innerWidth < 1024) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const isInView = rect.top <= 100 && rect.bottom >= window.innerHeight / 2;

      if (isInView && visibleItems < timelineData.length) {
        e.preventDefault();

        scrollAccumulator.current += e.deltaY;

        if (Math.abs(scrollAccumulator.current) > 100) {
          if (scrollAccumulator.current > 0 && visibleItems < timelineData.length) {
            setVisibleItems((prev) => Math.min(prev + 1, timelineData.length));
          } else if (scrollAccumulator.current < 0 && visibleItems > 1) {
            setVisibleItems((prev) => Math.max(prev - 1, 1));
          }
          scrollAccumulator.current = 0;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [visibleItems]);

  return (
    <section
      ref={timelineRef}
      className="py-0 px-6 lg:px-8 relative overflow-hidden"
      id="timeline"
    >
      <div className="max-w-7xl mx-auto">
        {/* Experience and leadership timeline */}
        <div ref={ref} className={`${isVisible ? "scroll-animate" : "opacity-0"} flex items-center justify-center gap-8 mb-20 flex-wrap`}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center">
           Tracing the Arc...
          </h2>
           <img 
            src="/icons/google-intern.png" 
            alt="Google Intern '26" 
            className="object-contain w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 flex-shrink-0"
          />
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block relative">
          {/* Background Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-border" />
          
          {/* Animated Progress Line */}
          <div
            className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-accent via-primary to-accent transition-all duration-300 ease-out"
            style={{ width: `${(visibleItems / timelineData.length) * 100}%` }}
          />

          {/* Timeline Items */}
          <div className="grid grid-flow-col auto-cols-fr gap-8 relative items-stretch">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`relative transition-all duration-700 ${
                  index < visibleItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {/* Dot */}
                <div className="relative flex justify-center mb-8">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      index < visibleItems
                        ? "bg-accent border-accent shadow-lg shadow-accent/50 scale-125"
                        : "bg-background border-border"
                    }`}
                  />
                </div>

                {/* Content Card */}
                <div className="glass-card p-5 rounded-xl group cursor-default border border-black/60 dark:border-gray-400 transition-transform duration-200 ease-out transform hover:-translate-y-1 hover:shadow-lg bg-white/5 dark:bg-white/3 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.period || item.date}</p>
                      <div className="mt-2 flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-foreground leading-snug">{item.title}</h3>
                      </div>
                      {item.company && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.companyUrl ? (
                            <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline relative pr-6">
                              <span>{item.company}</span>
                              <ArrowRight className="absolute top-0 right-0 w-5 h-5 -rotate-45 text-accent" />
                            </a>
                          ) : (
                            <>{item.company}</>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted/80 text-foreground font-medium dark:bg-muted/70 dark:text-foreground"
                        style={{ borderRadius: '9999px' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
                  <p className="text-sm text-muted-foreground">{item.period || item.date}</p>
                  <h3 className="text-xl font-bold mb-1 text-foreground">{item.title}</h3>
                  {item.company && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.companyUrl ? (
                        <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline relative pr-6">
                          <span>{item.company}</span>
                          <ArrowRight className="absolute top-0 right-0 w-5 h-5 -rotate-45 text-accent" />
                        </a>
                      ) : (
                        <>{item.company}</>
                      )}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted/80 text-foreground font-medium dark:bg-muted/70 dark:text-foreground"
                        style={{ borderRadius: '9999px' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
