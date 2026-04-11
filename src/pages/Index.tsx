import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStackScroller from "@/components/TechStackScroller";
import About from "@/components/About";
import Timeline from "../components/Timeline";
import Projects from "@/components/Projects";
import CodingDashboard from "@/components/CodingDashboard";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileFAB from "@/components/MobileFAB";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Handle hash navigation when component mounts
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  // Dynamically measure the footer's height to ensure perfect scrolling
  useEffect(() => {
    if (!footerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setFooterHeight(entry.contentRect.height);
      }
    });
    
    resizeObserver.observe(footerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Mobile: keep normal static scroll (no curtain / fixed footer)
  if (isMobile) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <Hero />
        <TechStackScroller />
        <About />
        <Timeline />
        <Projects />
        <CodingDashboard />
        <FAQ />
        <Contact />
        <Footer />
        <MobileFAB />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      
      {/* MAIN CONTENT CURTAIN 
        Given z-10 and a solid background to cover the footer.
        The margin-bottom allows you to scroll past the content just enough to reveal the footer.
      */}
      <main 
        className="relative z-10 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-[2.5rem] sm:rounded-b-[3rem] overflow-hidden"
        style={{ marginBottom: footerHeight }}
      >
        <Navbar />
        <Hero />
        <TechStackScroller />
        <About />
        <Timeline />
        <Projects />
        <CodingDashboard />
        <FAQ />
        <Contact />
      </main>
{/* FIXED FOOTER */}
      {/* 1. inset-0 and h-full make this wrapper cover the whole screen behind the curtain.
        2. flex & justify-end push the actual footer to the very bottom.
        3. IMPORTANT: Change 'bg-black' to whatever background color class your <Footer /> component uses!
      */}
      <div 
        className="fixed inset-0 w-full h-full z-0 flex flex-col justify-end bg-[#0a0a0a]"
      >
        <div ref={footerRef} className="w-full">
          <Footer />
        </div>
      </div>

      {/* Kept outside the stacking contexts so it remains floating above all */}
      <MobileFAB />
    </div>
  );
};

export default Index;