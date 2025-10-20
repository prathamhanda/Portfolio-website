import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detect active section based on scroll position
      const sections = ['hero', 'about', 'projects', 'products', 'faq'];
      const scrollPosition = window.scrollY + 100; // Offset for better detection
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId) || document.querySelector(`[data-section="${sectionId}"]`);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId === 'hero' ? 'home' : sectionId);
            break;
          }
        }
      }
      
      // Default to home if we're at the top
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const calculateEyePosition = (eyeElement: HTMLDivElement | null) => {
    if (!eyeElement) return { x: 0, y: 0 };
    // avoid calculations when not on desktop to prevent layout jank on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) return { x: 0, y: 0 };
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
    { name: "Home", path: "/", section: "home" },
    { name: "About", path: "#about", section: "about" },
    { name: "Projects", path: "#projects", section: "projects" },
    { name: "Products", path: "#products", section: "products" },
    { name: "FAQ", path: "#faq", section: "faq" },
  ];

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  // When opening the mobile menu, blur any currently focused element so Radix can safely
  // hide the rest of the app without blocking aria-hidden on a focused element.
  useEffect(() => {
    if (mobileMenuOpen) {
      try {
        const active = document.activeElement as HTMLElement | null;
        if (active && typeof active.blur === "function") active.blur();
      } catch (e) {
        /* ignore */
      }
    }
  }, [mobileMenuOpen]);

  if (!isMounted) return null;

  return (
    
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
      isScrolled ? "px-6 pt-6" : "px-0 pt-0"
    }`}>
      <nav className={`mx-auto px-8 py-4 grid grid-cols-3 items-center relative transition-all duration-300 ${
        isScrolled 
          ? "max-w-[85em] rounded-full backdrop-blur-xl bg-white/70 dark:bg-black/70 border border-gray-200/50 dark:border-gray-700/50 shadow-lg" 
          : "max-w-full rounded-none backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-gray-200/30 dark:border-gray-700/30 shadow-none"
      }`}>
        {/* Left - Logo/Name */}
        <Link to="/" className="text-xl font-bold z-10 justify-self-start pointer-events-auto">
          <span className="text-foreground">pratham</span>
          <span className="text-muted-foreground">.codes</span>
        </Link>

  {/* Center - Eyeballs */}
  <div className="hidden md:flex items-center gap-1.5 z-10 justify-self-center pointer-events-auto">
          <div 
            ref={leftEyeRef}
            className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center relative overflow-hidden"
          >
            <div
              className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full absolute transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${(isDesktop ? calculateEyePosition(leftEyeRef.current).x : 0)}px, ${(isDesktop ? calculateEyePosition(leftEyeRef.current).y : 0)}px)`,
              }}
            />
          </div>
          <div 
            ref={rightEyeRef}
            className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center relative overflow-hidden"
          >
            <div
              className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full absolute transition-transform duration-100 ease-out"
              style={{
                transform: `translate(${(isDesktop ? calculateEyePosition(rightEyeRef.current).x : 0)}px, ${(isDesktop ? calculateEyePosition(rightEyeRef.current).y : 0)}px)`,
              }}
            />
          </div>
        </div>

        {/* Right - All Navigation & Actions (desktop and mobile share same grid cell) */}
        <div className="z-10 justify-self-end col-start-3 flex items-center gap-2 pointer-events-auto">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === link.section
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {link.name}
              </a>
            ))}
            <ThemeToggle />
            <a href="https://tally.so/r/mYLgYq" target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full gap-2 px-6 py-2.5 text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 ml-2">
                Let's talk
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <div className="z-50">
              <ThemeToggle />
            </div>
            <div className="z-50">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    aria-label="Open menu"
                    className="relative z-50 flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-accent/90 text-white shadow-md pointer-events-auto"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[300px] sm:w-[400px] z-[60]"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Primary navigation and actions</SheetDescription>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.path}
                        onClick={closeMenu}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          activeSection === link.section
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        {link.name}
                      </a>
                    ))}
                    <a href="https://tally.so/r/mYLgYq" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                      <Button className="w-full rounded-full gap-2 px-6 py-6 text-base font-medium mt-4">
                        Let's talk
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
