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
      question: "What's your technical background?",
      answer:
        "I'm a third year CSE student at Thapar Institute with a 9.75 CGPA, specializing in full stack development with React, Node.js, and MongoDB alongside deep learning using PyTorch and TensorFlow. With 600+ DSA problems solved and a Knight Badge on LeetCode (top 3.5% globally, contest rating 1939), I combine strong algorithmic thinking with practical development skills.",
    },
    {
      question: "What kind of projects have you built?",
      answer:
        "I've built AI-powered systems like a Brain Tumor Detector with 99.3% accuracy, real-time traffic optimization using YOLOv8 at 45 FPS, and production-ready web applications like RoomsOnRent serving 10K+ students. My work spans from deep learning pipelines to containerized full stack platforms, always focusing on solving real-world problems with measurable impact.",
    },
    {
      question: "Are you open to internship opportunities?",
      answer:
        "Absolutely! I'm actively seeking SDE and AI/ML internship opportunities for Summer 2026. Currently interning as a Full Stack Developer at DBuck, I'm looking for roles where I can work on challenging problems at the intersection of AI and scalable web development. Reach out at prathamhanda10@gmail.com to discuss opportunities.",
    },
    {
      question: "What makes your approach different?",
      answer:
        "I don't just code, I solve problems with precision. Every project I build has a clear metric of success, whether it's 99.3% accuracy, 45 FPS performance, or 75% response time reduction. With leadership roles like Joint Secretary at LEAD Society and experience conducting DSA workshops for 50+ students, I bring both technical excellence and the ability to collaborate effectively.",
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
