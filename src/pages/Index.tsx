import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStackScroller from "@/components/TechStackScroller";
import About from "@/components/About";
import Timeline from "../components/Timeline";
import Projects from "@/components/Projects";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
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
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;
