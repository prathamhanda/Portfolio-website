import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FAQ = () => {
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const faqs = [
    {
      question: "How do I contact you for inquiries or collaborations?",
      answer:
        "You can directly drop me a message through the contact form on this website or simply email me at your.email@gmail.com. I typically respond within 24-48 hours.",
    },
    {
      question: "What services do you offer as a freelancer?",
      answer:
        "I offer full-stack web development, UI/UX design, product design, and technical consulting. I specialize in React, Next.js, Node.js, and modern web technologies. I can help with everything from building MVPs to scaling existing applications.",
    },
    {
      question: "How long does it take to complete a project?",
      answer:
        "Project timelines vary depending on scope and complexity. A simple landing page might take 1-2 weeks, while a full web application could take 2-3 months. I provide detailed timelines during our initial consultation and keep you updated throughout the process.",
    },
    {
      question: "What is your approach to freelancing projects?",
      answer:
        "I believe in close collaboration and transparent communication. I start with understanding your goals and requirements, then move through design, development, and testing phases. You'll have regular check-ins and opportunities to provide feedback throughout the process.",
    },
  ];

  return (
    <section id="faq" ref={faqRef} className="py-24 gradient-bg">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-16 ${faqVisible ? 'scroll-animate' : ''}`}>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Questions & Answers
          </p>
          <h2 className="text-5xl font-bold">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`bg-transparent rounded-2xl px-6 border-none transition-all hover:bg-muted/30 ${
                faqVisible ? `scroll-animate scroll-animate-delay-${Math.min(index % 3 + 1, 3)}` : ''
              }`}
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 relative after:absolute after:bottom-5 after:left-0 after:w-0 after:h-0.5 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
