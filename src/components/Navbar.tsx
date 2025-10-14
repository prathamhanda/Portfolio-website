import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        {/* Left - Logo/Name */}
        <Link to="/" className="text-xl font-bold">
          <span className="text-foreground">yourname</span>
          <span className="text-muted-foreground">.dev</span>
        </Link>

        {/* Center - Eyeballs (Desktop only) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2">
          <div 
            ref={leftEyeRef}
            className="w-10 h-10 rounded-full bg-background dark:bg-card border-2 border-foreground dark:border-muted-foreground flex items-center justify-center relative overflow-hidden"
          >
            <div
              className="w-2.5 h-2.5 bg-foreground dark:bg-foreground rounded-full absolute transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${calculateEyePosition(leftEyeRef.current).x}px, ${
                  calculateEyePosition(leftEyeRef.current).y
                }px)`,
              }}
            />
          </div>
          <div 
            ref={rightEyeRef}
            className="w-10 h-10 rounded-full bg-background dark:bg-card border-2 border-foreground dark:border-muted-foreground flex items-center justify-center relative overflow-hidden"
          >
            <div
              className="w-2.5 h-2.5 bg-foreground dark:bg-foreground rounded-full absolute transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${calculateEyePosition(rightEyeRef.current).x}px, ${
                  calculateEyePosition(rightEyeRef.current).y
                }px)`,
              }}
            />
          </div>
        </div>

        {/* Right - Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                location.pathname === link.path || location.hash === link.path
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {link.name}
            </a>
          ))}
          <ThemeToggle />
          <Button className="rounded-full gap-2 px-6 py-2.5 text-sm font-medium">
            Let's talk
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      location.pathname === link.path || location.hash === link.path
                        ? "bg-foreground text-background"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
                <Button className="rounded-full gap-2 px-6 py-6 text-base font-medium mt-4">
                  Let's talk
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
