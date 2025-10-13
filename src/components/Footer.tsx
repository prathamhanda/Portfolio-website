import { Link } from "react-router-dom";
import { Github, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-card/30 py-16 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Left Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">yourname.dev</h3>
            <p className="text-muted-foreground">
              Building digital products, brands, and experiences that people love.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary dark:bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary dark:bg-muted hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System status
            </div>
          </div>

          {/* Middle Column - Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="#projects" className="block text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <a href="#faq" className="block text-muted-foreground hover:text-foreground transition-colors">
                FAQs
              </a>
            </nav>
          </div>

          {/* Right Column - CTA with glass effect */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 dark:from-accent/10 dark:to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-2xl p-6 space-y-4 border border-border/50 dark:border-border/30">
              <h4 className="text-xl font-semibold">Let's talk</h4>
              <p className="text-muted-foreground text-sm">
                Have a project in mind? Let's create something amazing together.
              </p>
              <a
                href="mailto:your.email@gmail.com"
                className="text-sm text-foreground hover:text-accent flex items-center gap-2 transition-colors"
              >
                your.email@gmail.com
                <ArrowUp className="w-4 h-4 rotate-45" />
              </a>
              <Button
                onClick={scrollToTop}
                variant="outline"
                className="w-full rounded-full border-border/50 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                Back to top
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 dark:border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Your Name. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Performance: 98
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Security: A+
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Uptime: 99.9%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ in Your City
            </p>
          </div>
          
          {/* Command Palette Hint */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 dark:bg-muted/30 px-4 py-2 rounded-full border border-border/30">
              <span>Press</span>
              <kbd className="px-2 py-1 text-xs font-semibold bg-card dark:bg-card/60 border border-border/50 rounded">
                Ctrl+K
              </kbd>
              <span>to open the command palette</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
