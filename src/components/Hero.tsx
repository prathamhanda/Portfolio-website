import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  
  return (
    <section ref={heroRef} className="min-h-screen bg-background relative overflow-hidden pt-32 pb-20">
      {/* Command Palette Hint */}
      <div className="absolute top-20 right-6 z-20">
        <div className="bg-gradient-to-r from-gray-100/95 to-gray-200/90 dark:from-gray-900/95 dark:to-black/90 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-black/20 dark:border-white/10">
          Press <kbd className="px-2 py-0.5 mx-1 bg-gray-300/60 dark:bg-gray-800/60 border border-black/20 dark:border-white/20 rounded text-xs font-mono font-semibold">Ctrl+K</kbd> to open the command palette
        </div>
      </div>

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
              Full Stack Developer & AI Engineer
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Building intelligent systems where AI meets full stack development
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg">
            Third year CSE student at Thapar Institute with a 9.75 CGPA. I specialize in creating AI-powered applications and scalable web platforms, combining deep learning expertise with full stack development. Knight Badge holder on LeetCode, ranking in the top 3.5% globally.
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
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            {/* subtle framed border */}
            <div className="rounded-3xl p-1 bg-white/60 dark:bg-black/30">
              <img
                src="/Pratham-PFP.jpg"
                alt="Profile"
                className="w-full h-[420px] sm:h-[500px] md:h-[550px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* bottom overlay */}
            <div className="absolute bottom-4 left-4 right-4  rounded-2xl p-6 text-white  border-white/10 ">
              <p className="text-s uppercase tracking-wider mb-2 text-white/80">Available for work</p>
              <p className="text-lg font-semibold">Let's collaborate on your next project</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
