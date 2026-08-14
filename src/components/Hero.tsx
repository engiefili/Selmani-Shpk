export type HeroData = {
  heading: string;
  subheading: string;
  backgroundImage: string;
  backgroundImageAlt?: string;
  certifications?: { line1: string; line2: string }[];
  ctaLabel?: string;
};

export default function Hero({ data }: { data: HeroData }) {
  const certifications = data.certifications ?? [];
  const headingLines = data.heading.split("\n");

  return (
    <section className="relative flex h-[90vh] min-h-[720px] flex-col overflow-hidden bg-neutral-950 px-5 pb-8 pt-24 text-white sm:px-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.backgroundImage}
        alt={data.backgroundImageAlt ?? ""}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/35 to-transparent" />

      <div className="relative z-10 flex flex-1 max-w-[85%] flex-col justify-center">
        <h1
          className="font-heading font-black leading-[0.95] tracking-tight text-[#eaefef]"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
        >
          {headingLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headingLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-2xl text-2xl font-light text-[#c1c7c7]">
          {data.subheading}
        </p>
      </div>

      <div className="relative z-10 mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6">
        <div className="flex flex-wrap items-center gap-8">
          {certifications.map((cert, i) => (
            <div key={cert.line2} className="flex items-center gap-8">
              {i > 0 && <span className="h-12 w-px bg-accent/40" />}
              <div className="flex items-center">
                <span className="z-10 -mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent bg-neutral-950 text-accent text-sm">
                  ↘
                </span>
                <span className="pl-5 text-lg leading-tight text-[#c1c7c7]">
                  {cert.line1}
                  <br />
                  {cert.line2}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button className="rounded-md border border-[#c1c7c7] px-8 py-3.5 text-base font-medium text-[#c1c7c7] transition hover:border-accent hover:text-accent">
            {data.ctaLabel ?? "Explore our work"}
          </button>
          <span className="text-sm text-white/50">Scroll Down</span>
        </div>
      </div>
    </section>
  );
}
