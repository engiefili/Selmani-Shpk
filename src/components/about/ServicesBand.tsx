import CtaButton from "../CtaButton";

export type ServicesBandData = {
  eyebrow?: string;
  heading: string;
  backgroundImage: string;
  intro: string;
  bullets: { label: string; description: string }[];
  ctaLabel?: string;
};

export default function ServicesBand({ data }: { data: ServicesBandData }) {
  return (
    <section className="bg-neutral-950 px-5 py-4 sm:px-10">
      <div className="relative mx-auto w-full max-w-[1800px] overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-neutral-950 from-30% via-neutral-950/85 to-neutral-950/20" />

        <div className="relative z-10 ml-auto flex flex-col gap-8 px-6 py-14 text-white sm:px-12 sm:py-20 lg:w-[65%] lg:min-w-[680px]">
          <span className="inline-flex items-center gap-2 text-sm font-light text-[#eaefef]">
            <span className="h-2 w-2 rounded-full bg-[#eaefef]" />
            {data.eyebrow ?? "Services"}
          </span>
          <h2
            className="max-w-3xl font-light leading-tight text-[#eaefef]"
            style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
          >
            {data.heading}
          </h2>
          <div className="max-w-2xl border-t border-white/10 pt-6 text-base font-light text-[#c1c7c7]">
            <p className="mb-4">{data.intro}</p>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">
              {data.bullets.map((bullet) => (
                <li key={bullet.label}>
                  <span className="font-medium text-[#eaefef]">
                    {bullet.label}:
                  </span>{" "}
                  {bullet.description}
                </li>
              ))}
            </ul>
          </div>
          <CtaButton
            label={data.ctaLabel ?? "Explore Services"}
            href="#"
            className="mt-2 w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
