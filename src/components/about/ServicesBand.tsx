import Image from "next/image";
import CtaButton from "../CtaButton";
import Reveal from "../Reveal";
import { localizePath, type Locale } from "@/lib/locale";

export type ServicesBandData = {
  eyebrow?: string;
  heading: string;
  backgroundImage: string;
  intro: string;
  bullets: { label: string; description: string }[];
  ctaLabel?: string;
};

export default function ServicesBand({
  data,
  locale = "en",
}: {
  data: ServicesBandData;
  locale?: Locale;
}) {
  return (
    <section className="bg-neutral-950 px-5 py-4 sm:px-[45px]">
      <div className="relative mx-auto w-full overflow-hidden rounded-2xl">
        <Image
          src={data.backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Mobile: text spans the full card width, so a uniform dark
            wash keeps it legible. Desktop/tablet: original side gradient,
            since text sits in a narrower right-aligned column there. */}
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/80 sm:hidden" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-l from-neutral-950 from-30% via-neutral-950/85 to-neutral-950/20 sm:block" />

        <Reveal className="relative z-10 ml-auto flex flex-col gap-6 px-5 py-8 text-white sm:gap-8 sm:px-12 sm:py-20 lg:w-[65%] lg:min-w-[680px]">
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
            href={localizePath("/services", locale)}
            className="mt-2 w-full max-w-md"
          />
        </Reveal>
      </div>
    </section>
  );
}
