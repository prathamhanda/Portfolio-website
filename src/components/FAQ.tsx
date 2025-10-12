import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
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
    <section id="faq" className="py-24 gradient-bg">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
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
              className="bg-white/60 backdrop-blur-sm rounded-2xl border-none overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-lg font-medium hover:no-underline hover:bg-white/40 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-muted-foreground">
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
