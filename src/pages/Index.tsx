import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStackScroller from "@/components/TechStackScroller";
import About from "@/components/About";
import Projects from "@/components/Projects";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CommandPalette from "@/components/CommandPalette";

const Index = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <Hero />
      <TechStackScroller />
      <About />
      <Projects />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollToTop />
      <CommandPalette />
    </div>
  );
};

export default Index;
