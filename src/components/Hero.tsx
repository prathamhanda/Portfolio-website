import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  
  return (
    <section ref={heroRef} className="min-h-screen gradient-bg relative overflow-hidden pt-32 pb-20">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-200/30 blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-purple-200/20 blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-pink-200/20 blur-xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full bg-cyan-200/30 blur-lg animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className={`space-y-8 ${heroVisible ? 'scroll-animate' : ''}`}>
          <div className="inline-block">
            <span className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
              Product Designer & Developer
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Building digital experiences that make an impact
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg">
            I'm a full-stack developer and designer creating AI-enhanced solutions and crafting thoughtful user experiences.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full gap-2 px-8 py-6 text-base font-medium">
              View my work
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2 px-8 py-6 text-base font-medium border-2 border-black hover:bg-black hover:text-white"
            >
              Download Resume
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Content - Profile Image */}
        <div className={`relative ${heroVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl glass-card group">
            <img
              src="https://images.unsplash.com/photo-1622675272083-44c36a2c7ff3?w=800&h=1000&fit=crop"
              alt="Profile"
              className="w-full h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-6 text-foreground dark:text-white border-white/30">
              <p className="text-xs uppercase tracking-wider mb-2 text-muted-foreground dark:text-white/70">Available for work</p>
              <p className="text-lg font-semibold">Let's collaborate on your next project</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
