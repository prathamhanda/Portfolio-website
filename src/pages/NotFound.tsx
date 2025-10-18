import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // 404 page accessed
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Grid overlay */}
      <div className="grid-overlay" aria-hidden />
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-200/20 blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 rounded-full bg-purple-200/15 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 rounded-full bg-pink-200/15 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-cyan-200/20 blur-2xl animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-6 animate-in fade-in zoom-in duration-500">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[120px] md:text-[180px] font-bold leading-none bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
            404
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Oops! Page not found
        </h2>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for seems to have taken an unexpected turn. Like a misdirected API call, it doesn't exist here.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/">
            <Button size="lg" className="rounded-full gap-2 px-8 py-6 text-base font-medium">
              <Home className="w-5 h-5" />
              Return Home
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/#projects">
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full gap-2 px-8 py-6 text-base font-medium border-2 border-black dark:border-white hover:bg-black hover:text-white hover:border-white dark:hover:bg-white dark:hover:text-black"
            >
              Explore Projects
            </Button>
          </Link>
        </div>

        {/* Suggestion */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 border border-blue-500/20 dark:border-blue-500/10 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground mb-3">
            💡 <span className="font-semibold">Pro tip:</span> Press <kbd className="px-2 py-1 mx-1 bg-gray-300/60 dark:bg-gray-800/60 border border-black/20 dark:border-white/20 rounded text-xs font-mono font-semibold">Ctrl+K</kbd> to open the command palette and navigate anywhere!
          </p>
        </div>
      </div>

      {/* Error Code Watermark */}
      <div className="absolute bottom-8 right-8 text-right opacity-20 pointer-events-none">
        <p className="text-sm text-muted-foreground font-mono">Error: PAGE_NOT_FOUND</p>
        <p className="text-xs text-muted-foreground font-mono">Status Code: 404</p>
      </div>
    </div>
  );
};

export default NotFound;
