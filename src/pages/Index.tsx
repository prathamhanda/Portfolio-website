import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStackScroller from "@/components/TechStackScroller";
import About from "@/components/About";
import Timeline from "../components/Timeline";
import Projects from "@/components/Projects";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileFAB from "@/components/MobileFAB";

const Index = () => {
  useEffect(() => {
    // Handle hash navigation when component mounts
    const hash = window.location.hash;
    if (hash) {
      const elementId = hash.substring(1); // Remove the # symbol
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, []);
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      {/* Grid overlay */}
      <div className="grid-overlay" aria-hidden />

      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <TechStackScroller />
        <About />
        <Timeline />
        <Projects />
        <FAQ />
        <Contact />
        <Footer />
        <MobileFAB />
      </div>
    </div>
  );
};

export default Index;
