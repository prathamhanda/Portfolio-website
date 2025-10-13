import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const calculateEyePosition = (eyeElement: HTMLDivElement | null) => {
    if (!eyeElement) return { x: 0, y: 0 };
    
    const rect = eyeElement.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);
    const distance = Math.min(4, Math.hypot(mousePos.x - eyeCenterX, mousePos.y - eyeCenterY) / 100);
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "#about" },
    { name: "Projects", path: "#projects" },
    { name: "Products", path: "#products" },
    { name: "FAQ", path: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 dark:bg-background/90 backdrop-blur-lg shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Animated Eyes */}
            <div 
              ref={leftEyeRef}
              className="w-10 h-10 rounded-full bg-card dark:bg-muted border-2 border-foreground flex items-center justify-center relative overflow-hidden"
            >
              <div
                className="w-3 h-3 bg-foreground rounded-full absolute transition-transform duration-100 ease-out"
                style={{
                  transform: `translate(${calculateEyePosition(leftEyeRef.current).x}px, ${
                    calculateEyePosition(leftEyeRef.current).y
                  }px)`,
                }}
              />
            </div>
            <div 
              ref={rightEyeRef}
              className="w-10 h-10 rounded-full bg-card dark:bg-muted border-2 border-foreground flex items-center justify-center relative overflow-hidden"
            >
              <div
                className="w-3 h-3 bg-foreground rounded-full absolute transition-transform duration-100 ease-out"
                style={{
                  transform: `translate(${calculateEyePosition(rightEyeRef.current).x}px, ${
                    calculateEyePosition(rightEyeRef.current).y
                  }px)`,
                }}
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                location.pathname === link.path || location.hash === link.path
                  ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
                  : "text-foreground hover:bg-secondary dark:hover:bg-secondary"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button className="rounded-full gap-2 px-6 py-5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
            Let's talk
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
