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
    question: "What do you do and what have you recently worked on?",
    answer:
      "I am pursuing a B.Tech. in Computer Science & Engineering at Thapar Institute (2023–2027) with a 9.83/10 CGPA. I have interned as a Web Solutions Engineer at Google and a Research Intern at Samsung PRISM, working across full-stack systems and applied AI.",
  },
  {
    question: "What kind of projects excite you the most?",
    answer:
      "I am most excited by projects that solve real problems and have a visible impact, from AI-powered learning tools such as StudyBud to real-time traffic intelligence and accessible web products. Seeing something I built being useful is what motivates me.",
  },
  {
    question: "What tools and technologies do you feel most comfortable with?",
    answer:
      "On the development side, I am most comfortable with React, Node.js, Express, and MongoDB. For machine learning and computer vision, I regularly work with PyTorch, TensorFlow, and OpenCV. I also use Docker and Git in most projects and enjoy learning new tools whenever a project demands it.",
  },
  {
    question: "How do you usually approach a new problem or project?",
    answer:
      "I like to start by clearly understanding the problem and deciding what success should look like. From there, I break things down, build step by step, and measure whether performance or usability improves. Solving 1,400+ DSA problems has helped me think systematically while balancing clean logic with practical execution.",
  },
];


  return (
    <section id="faq" ref={faqRef} className="py-24 bg-background">
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
              className={`bg-transparent rounded-2xl px-6 border-none transition-all group ${
                faqVisible ? `scroll-animate scroll-animate-delay-${Math.min(index % 3 + 1, 3)}` : ''
              }`}
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 relative border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 group-hover:border-black dark:group-hover:border-white">
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
