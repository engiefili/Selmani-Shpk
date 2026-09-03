import { ExclusiveAccordionGroup } from "@/components/services/Accordion";

export type FAQItem = { question: string; answer: string };

export default function FAQSection({
  eyebrow = "FAQ",
  heading = "Frequently Asked Questions",
  items,
}: {
  eyebrow?: string;
  heading?: string;
  items: FAQItem[];
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="bg-neutral-950 px-5 py-16 text-white sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="flex max-w-3xl flex-col gap-[30px]">
          <span className="inline-flex items-center gap-2 text-xl font-light tracking-wide text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {eyebrow}
          </span>
          <h2
            className="font-light leading-none text-[#eaefef]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
          >
            {heading}
          </h2>
        </div>

        <div className="mt-10 max-w-3xl">
          <ExclusiveAccordionGroup
            defaultOpenIndex={0}
            items={items.map((item) => ({
              title: item.question,
              content: (
                <p className="max-w-3xl text-lg font-light leading-relaxed text-[#c1c7c7]">
                  {item.answer}
                </p>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
