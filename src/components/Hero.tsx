export type HeroData = {
  heading: string;
  subheading: string;
  backgroundImage: string;
  backgroundImageAlt?: string;
  certifications?: { line1: string; line2: string }[];
  ctaLabel?: string;
};

export default function Hero({
  data,
  href = "#",
}: {
  data: HeroData;
  href?: string;
}) {
  const certifications = data.certifications ?? [];
  const headingLines = data.heading.split("\n");

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-neutral-950 px-5 pb-10 pt-20 text-white sm:px-10 sm:pb-8 sm:pt-24 lg:h-[90vh] lg:min-h-[720px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.backgroundImage}
        alt={data.backgroundImageAlt ?? ""}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/35 to-transparent" />

      <div className="relative z-10 flex max-w-full flex-1 flex-col justify-center sm:max-w-[85%]">
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
        <p className="mt-4 max-w-2xl text-lg font-light text-[#c1c7c7] sm:mt-6 sm:text-2xl">
          {data.subheading}
        </p>
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-stretch gap-8 border-t border-white/10 pt-5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6 sm:pt-6">
        {/* Mobile: equal-width badge chips, so certifications with
            different text lengths still line up cleanly in a row. */}
        <div className="grid grid-cols-3 gap-2 sm:hidden">
          {certifications.map((cert) => (
            <div
              key={cert.line2}
              className="flex flex-col items-center justify-center gap-1 rounded-md border border-accent/40 bg-white/[0.03] px-2 py-3 text-center"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                {cert.line1}
              </span>
              <span className="text-[11px] leading-tight text-[#c1c7c7]">
                {cert.line2}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop / tablet: original wide layout with connecting arrow badges. */}
        <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-8">
          {certifications.map((cert, i) => (
            <div key={cert.line2} className="flex items-center gap-8">
              {i > 0 && <span className="h-12 w-px shrink-0 bg-accent/40" />}
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

        <a
          href={href}
          className="w-full rounded-md border border-[#c1c7c7] px-8 py-3.5 text-center text-base font-medium text-[#c1c7c7] transition hover:border-accent hover:text-accent sm:w-auto"
        >
          {data.ctaLabel ?? "Explore our work"}
        </a>
      </div>
    </section>
  );
}
