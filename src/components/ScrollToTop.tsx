import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={handleClick}
          aria-label="Open command palette"
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full shadow-2xl hidden sm:block bg-accent text-accent-foreground hover:scale-105 transform transition overflow-hidden p-0"
        >
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="/sparkles.gif" 
              alt="" 
              className="w-full h-full object-cover"
              aria-hidden
            />
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
