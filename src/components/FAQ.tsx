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
    question: "What do you do and what are you currently working on?",
    answer:
      "I am a third year Computer Science Engineering student at Thapar Institute with a CGPA of 9.75. Right now, I spend most of my time building full stack applications using React and Node.js, and experimenting with machine learning models using PyTorch and TensorFlow. I enjoy working on projects where I can take an idea from scratch and turn it into something real and useful.",
  },
  {
    question: "What kind of projects excite you the most?",
    answer:
      "I am most excited by projects that solve real problems and have a visible impact. This could be building an AI model that helps in medical diagnosis with high accuracy, optimizing traffic systems to work in real time, or creating web platforms that thousands of people actually use. Seeing something I built being used in the real world is what motivates me the most.",
  },
  {
    question: "What tools and technologies do you feel most comfortable with?",
    answer:
      "On the development side, I am most comfortable with React, Node.js, Express, and MongoDB. For machine learning and computer vision, I regularly work with PyTorch, TensorFlow, and OpenCV. I also use Docker and Git in most projects and enjoy learning new tools whenever a project demands it.",
  },
  {
    question: "How do you usually approach a new problem or project?",
    answer:
      "I like to start by clearly understanding the problem and deciding what success should look like. From there, I break things down into smaller parts, build step by step, and keep measuring whether I am actually improving performance or usability. Solving over 1000+ DSA problems has helped me think more systematically, but I always try to balance clean logic with practical execution.",
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
