import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full shadow-2xl"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
      )}
    </>
  );
};

export default ScrollToTop;
