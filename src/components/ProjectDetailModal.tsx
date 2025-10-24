import { useState, useEffect } from "react";
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { projectsData } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectDetailModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Safe fallbacks for undefined properties
  const images = project.images || [project.image].filter(Boolean);
  const tagline = project.tagline || project.description || "";
  const keyFeatures = project.keyFeatures || project.features || [];
  const technical = project.technical || {
    approach: project.implementation?.approach || "",
    technologyChoices: project.implementation?.technologies || [],
    architecture: project.architecture || ""
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 915);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, images.length]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Mobile Sheet Layout
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[100] bg-black/80 animate-in fade-in-0 duration-300"
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <div
          className="fixed inset-x-0 bottom-0 z-[101] h-[90vh] bg-background rounded-t-[24px] shadow-2xl animate-in slide-in-from-bottom-full duration-300 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-muted rounded-full" />
          </div>

          <ScrollArea className="flex-1 px-4 sm:px-6">
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden mb-4 h-48 w-full">
              <img
                src={images[currentImageIndex]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Title & CTAs on Hero */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 break-words">{project.title}</h2>
                <div className="flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full gap-2 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 whitespace-nowrap"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full gap-2 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 whitespace-nowrap"
                      asChild
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-[40%] -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-[40%] -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          idx === currentImageIndex
                            ? "bg-white w-4"
                            : "bg-white/50"
                        )}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tech Badges */}
            <div className="flex flex-wrap gap-2 mb-6 max-w-full">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full text-xs whitespace-nowrap">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-6">
              <div className="sticky top-0 z-50 pb-4 bg-background/95 backdrop-blur-md">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="overview" className="rounded-full">Overview</TabsTrigger>
                  <TabsTrigger value="technical" className="rounded-full">Technical</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Full Description */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">About</h3>
                  <p className="text-muted-foreground leading-relaxed break-words overflow-wrap-anywhere">{project.fullDescription}</p>
                </div>

                {/* Key Features */}
                {keyFeatures && keyFeatures.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Key Features</h3>
                    <div className="space-y-2">
                      {keyFeatures.map((feature, idx) => (
                        <div key={idx} className="glass-card p-3 rounded-xl border border-border/80 bg-background/50 w-full overflow-hidden">
                          {typeof feature === 'string' ? (
                            <p className="text-sm break-words overflow-wrap-anywhere">{feature}</p>
                          ) : (
                            <>
                              <h4 className="font-medium text-sm mb-1 break-words">{feature.title || feature}</h4>
                              {feature.description && (
                                <p className="text-xs text-muted-foreground break-words overflow-wrap-anywhere">{feature.description}</p>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenges */}
                {project.challenges && project.challenges.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Challenges & Solutions</h3>
                    <div className="space-y-3">
                      {project.challenges.map((item, idx) => (
                        <div key={idx} className="glass-card p-3 rounded-xl border-l-4 border-l-accent border border-border/80 bg-background/50 w-full overflow-hidden">
                          {typeof item === 'string' ? (
                            <p className="text-sm break-words overflow-wrap-anywhere">{item}</p>
                          ) : (
                            <>
                              <p className="font-medium text-sm mb-1.5">Challenge</p>
                              <p className="text-xs text-muted-foreground mb-2 break-words overflow-wrap-anywhere">{item.challenge || item}</p>
                              {item.solution && (
                                <>
                                  <p className="font-medium text-sm mb-1.5">Solution</p>
                                  <p className="text-xs text-muted-foreground break-words overflow-wrap-anywhere">{item.solution}</p>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="technical" className="space-y-6 mt-0">
                {/* Implementation */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Implementation</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed break-words overflow-wrap-anywhere">{technical.approach}</p>
                </div>

                {/* Technology Choices */}
                {technical.technologyChoices && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Technology Choices</h3>
                    <div className="space-y-2">
                      {technical.technologyChoices.map((tech, idx) => (
                        <div key={idx} className="glass-card p-3 rounded-xl border border-border/80 bg-background/50 w-full overflow-hidden">
                          <h4 className="font-medium text-sm mb-1 break-words">{tech.name}</h4>
                          <p className="text-xs text-muted-foreground break-words overflow-wrap-anywhere">{tech.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architecture */}
                {technical.architecture && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Architecture</h3>
                    <pre className="glass-card p-3 rounded-xl text-xs overflow-x-auto font-mono border border-border/80 bg-background/50 whitespace-pre-wrap break-words max-w-full">
                      {technical.architecture}
                    </pre>
                  </div>
                )}

                {/* Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx} className="glass-card p-3 rounded-xl text-center border border-border/80 bg-background/50 w-full overflow-hidden">
                          <div className="text-2xl font-bold text-accent break-words">{metric.value}</div>
                          <div className="text-xs font-medium mt-1 break-words">{metric.label}</div>
                          {metric.description && (
                            <div className="text-xs text-muted-foreground mt-1 break-words overflow-wrap-anywhere">{metric.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="h-6" />
          </ScrollArea>

          {/* Close Button */}
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm z-[200]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </>
    );
  }

  // Desktop Modal Layout
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/80 animate-in fade-in-0 duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-[101] w-[90vw] max-w-[1100px] h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Fixed */}
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="absolute right-6 top-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 z-[200]"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Scrollable Container */}
        <ScrollArea className="flex-1">
          <div className="relative">
            {/* Hero Section - Scrolls */}
            <div className="relative h-[320px]">
              <img
                src={images[currentImageIndex]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Title on Left */}
              <div className="absolute bottom-6 left-8">
                <h2 className="text-4xl font-bold text-white">{project.title}</h2>
              </div>

              {/* CTAs on Right */}
              <div className="absolute bottom-6 right-8 flex gap-3">
                {project.githubUrl && (
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
                    asChild
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2 bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
                    asChild
                  >
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>

              {/* Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-[45%] -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          idx === currentImageIndex
                            ? "bg-white w-6"
                            : "bg-white/60 hover:bg-white/80"
                        )}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tech Badges - Sticky */}
            <div className="sticky top-0 z-40 px-8 py-4 border-b border-border bg-background/95 backdrop-blur-md">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs & Content */}
            <Tabs defaultValue="overview" className="px-8">
              {/* Sticky Tabs */}
              <div className="sticky top-[72px] z-50 pt-4 pb-2 flex justify-center">
                <div className="bg-background/95 backdrop-blur-md rounded-full p-1">
                  <TabsList className="inline-flex h-11 items-center justify-center rounded-full bg-muted p-1">
                    <TabsTrigger value="overview" className="rounded-full px-6">Overview</TabsTrigger>
                    <TabsTrigger value="technical" className="rounded-full px-6">Technical</TabsTrigger>
                    {project.metrics && <TabsTrigger value="metrics" className="rounded-full px-6">Metrics</TabsTrigger>}
                    {project.documentation && <TabsTrigger value="docs" className="rounded-full px-6">Docs</TabsTrigger>}
                  </TabsList>
                </div>
              </div>

              {/* Content */}
              <div className="py-6 pb-8">
                <TabsContent value="overview" className="mt-0 space-y-6">
                  {/* Full Description */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-xl">Project Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">{project.fullDescription}</p>
                  </div>

                  {/* Key Features */}
                  {keyFeatures && keyFeatures.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-xl">Key Features</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {keyFeatures.map((feature, idx) => (
                          <div key={idx} className="glass-card p-4 rounded-xl border border-border/80 bg-background/50">
                            {typeof feature === 'string' ? (
                              <p className="text-sm">{feature}</p>
                            ) : (
                              <>
                                <h4 className="font-semibold mb-2">{feature.title || feature}</h4>
                                {feature.description && (
                                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges & Solutions */}
                  {project.challenges && project.challenges.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-xl">Challenges & Solutions</h3>
                      <div className="space-y-4">
                        {project.challenges.map((item, idx) => (
                          <div key={idx} className="glass-card p-5 rounded-xl border-l-4 border-l-accent border border-border/80 bg-background/50">
                            {typeof item === 'string' ? (
                              <p className="text-foreground">{item}</p>
                            ) : (
                              <>
                                <div className="mb-3">
                                  <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Challenge</p>
                                  <p className="text-foreground">{item.challenge || item}</p>
                                </div>
                                {item.solution && (
                                  <div>
                                    <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Solution</p>
                                    <p className="text-foreground">{item.solution}</p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="technical" className="mt-0 space-y-6">
                  {/* Implementation Approach */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-xl">Implementation</h3>
                    <p className="text-muted-foreground leading-relaxed">{technical.approach}</p>
                  </div>

                  {/* Technology Choices */}
                  {technical.technologyChoices && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-xl">Technology Choices</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {technical.technologyChoices.map((tech, idx) => (
                          <div key={idx} className="glass-card p-4 rounded-xl border border-border/80 bg-background/50">
                            <h4 className="font-semibold mb-2">{tech.name}</h4>
                            <p className="text-sm text-muted-foreground">{tech.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Architecture */}
                  {technical.architecture && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-xl">Architecture</h3>
                      <pre className="glass-card p-4 rounded-xl text-sm overflow-x-auto font-mono leading-relaxed border border-border/80 bg-background/50">
                        {technical.architecture}
                      </pre>
                    </div>
                  )}
                </TabsContent>

                {project.metrics && (
                  <TabsContent value="metrics" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-xl">Performance Metrics</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        {project.metrics.map((metric, idx) => (
                          <div key={idx} className="glass-card p-6 rounded-xl text-center border border-border/80 bg-background/50">
                            <div className="text-4xl font-bold text-accent mb-2">{metric.value}</div>
                            <div className="text-sm font-semibold mb-1">{metric.label}</div>
                            {metric.description && (
                              <div className="text-xs text-muted-foreground">{metric.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                {project.documentation && (
                  <TabsContent value="docs" className="mt-0 space-y-6">
                    {/* Setup */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-xl">Setup</h3>
                      <pre className="glass-card p-4 rounded-xl text-sm overflow-x-auto font-mono bg-muted border border-border/80">
                        {project.documentation.setup}
                      </pre>
                    </div>

                    {/* Usage */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-xl">Usage</h3>
                      <p className="text-muted-foreground">{project.documentation.usage}</p>
                    </div>

                    {/* API */}
                    {project.documentation.api && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-xl">API Reference</h3>
                        <pre className="glass-card p-4 rounded-xl text-sm overflow-x-auto font-mono bg-muted border border-border/80">
                          {project.documentation.api}
                        </pre>
                      </div>
                    )}
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ProjectDetailModal;
