import { Button } from "@/components/ui/button";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Contact = () => {
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation();
  
  return (
    <section id="contact" ref={contactRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${contactVisible ? 'scroll-animate' : ''}`}>
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Get in Touch
              </p>
              <h2 className="text-5xl font-bold mb-6">Let's work together</h2>
              <p className="text-lg text-muted-foreground">
                I'm actively seeking SDE and AI/ML internship opportunities for Summer 2026. Whether you need a full stack developer, want to discuss intelligent systems, or have an interesting problem to solve, I'd love to connect.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                  <Mail className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">prathamhanda10@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Patiala, Punjab, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - CTA Card */}
          <div className={`glass-card rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-6 ${contactVisible ? 'scroll-animate scroll-animate-delay-2' : ''}`}>
            <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-background" />
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-3">Ready to start a project?</h3>
              <p className="text-muted-foreground">
                Drop me an email and I'll get back to you within 24 hours to discuss your ideas and requirements.
              </p>
            </div>
          <a href="https://tally.so/r/mYLgYq" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full gap-2 px-8 py-6 mt-4   text-base font-medium">
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Button>
            </a>
            <p className="text-sm text-muted-foreground">Opens in a new tab</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
