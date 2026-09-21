export type KeyFiguresData = {
  items: string[];
};

export default function KeyFiguresMarquee({ data }: { data: KeyFiguresData }) {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="overflow-hidden bg-[#001c20] py-5">
      {/* Content is duplicated once below so a -50% translate loops
          seamlessly — see .marquee-track in globals.css. */}
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1 || undefined}>
            {items.map((item, i) => (
              <div key={`${copy}-${i}`} className="flex items-center">
                <span className="whitespace-nowrap px-8 text-2xl leading-[0.9] text-[#c1c7c7] sm:px-10">
                  {item}
                </span>
                <span className="h-8 w-px shrink-0 bg-white/15" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
