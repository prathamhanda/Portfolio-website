import { Link } from "react-router-dom";
import { Github, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Left Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">yourname.dev</h3>
            <p className="text-white/70">
              Building digital products, brands, and experiences that people love.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              System status
            </div>
          </div>

          {/* Middle Column - Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-white/70 hover:text-white transition-colors">
                Home
              </a>
              <a href="#projects" className="block text-white/70 hover:text-white transition-colors">
                Projects
              </a>
              <a href="#about" className="block text-white/70 hover:text-white transition-colors">
                About
              </a>
              <a href="#contact" className="block text-white/70 hover:text-white transition-colors">
                Contact
              </a>
              <a href="#faq" className="block text-white/70 hover:text-white transition-colors">
                FAQs
              </a>
            </nav>
          </div>

          {/* Right Column - CTA */}
          <div className="bg-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="text-xl font-semibold">Let's talk</h4>
            <p className="text-white/70 text-sm">
              Have a project in mind? Let's create something amazing together.
            </p>
            <a
              href="mailto:your.email@gmail.com"
              className="text-sm text-white hover:underline flex items-center gap-2"
            >
              your.email@gmail.com
              <ArrowUp className="w-4 h-4 rotate-45" />
            </a>
            <Button
              onClick={scrollToTop}
              variant="outline"
              className="w-full rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back to top
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              © 2025 Your Name. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-white/70">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Performance: 98
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Security: A+
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Uptime: 99.9%
              </span>
            </div>
            <p className="text-sm text-white/70">
              Made with ❤️ in Your City
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
