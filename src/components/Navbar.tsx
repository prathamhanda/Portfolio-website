import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

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

  const calculateEyePosition = (eyeRef: { x: number; y: number }) => {
    const angle = Math.atan2(mousePos.y - eyeRef.y, mousePos.x - eyeRef.x);
    const distance = Math.min(6, Math.hypot(mousePos.x - eyeRef.x, mousePos.y - eyeRef.y) / 50);
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
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Animated Eyes */}
            <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center relative overflow-hidden">
              <div
                className="w-3 h-3 bg-black rounded-full absolute transition-transform duration-100"
                style={{
                  transform: `translate(${calculateEyePosition({ x: 0, y: 0 }).x}px, ${
                    calculateEyePosition({ x: 0, y: 0 }).y
                  }px)`,
                }}
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center relative overflow-hidden">
              <div
                className="w-3 h-3 bg-black rounded-full absolute transition-transform duration-100"
                style={{
                  transform: `translate(${calculateEyePosition({ x: 0, y: 0 }).x}px, ${
                    calculateEyePosition({ x: 0, y: 0 }).y
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
                  ? "bg-black text-white"
                  : "text-foreground hover:bg-black/5"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <Button className="rounded-full gap-2 px-6 py-5 text-sm font-medium">
          Let's talk
          <ArrowRight className="w-4 h-4" />
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
