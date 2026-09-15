import Image from "next/image";
import CtaButton from "./CtaButton";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export type MetallicConstructionsData = {
  eyebrow?: string;
  title: string;
  services: { title: string; industries: string; icon?: string }[];
  description: string;
  ctaLabel?: string;
};

export default function MetallicConstructions({
  data,
  href = "#",
}: {
  data: MetallicConstructionsData;
  href?: string;
}) {
  return (
    <section
      id="services"
      className="hidden bg-neutral-950 px-5 py-8 text-white sm:block sm:px-[45px] sm:py-10"
    >
      <div className="mx-auto w-full max-w-[1800px]">
        <Reveal>
          <Eyebrow>{data.eyebrow ?? "Services"}</Eyebrow>
          <h2
            className="mt-3 font-light tracking-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
          >
            {data.title}
          </h2>
        </Reveal>

        <ul className="mt-6 grid gap-x-16 sm:mt-10 sm:grid-cols-2">
          {data.services.map((service, i) => (
            <Reveal
              key={service.title}
              as="li"
              delay={Math.min(i * 60, 240)}
              className="flex items-center gap-4 py-5 sm:gap-6 sm:py-7"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                {service.icon && (
                  <Image
                    src={service.icon}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white sm:text-xl">
                  {service.title}
                </h3>
                <p className="mt-3 flex items-baseline gap-3 border-t border-white/10 pt-3 text-sm text-[#777b7b]">
                  <span>Industries</span>
                  <span className="text-[#c1c7c7]">
                    {service.industries}
                  </span>
                </p>
              </div>
            </Reveal>
          ))}

          <li className="flex items-center gap-4 py-5 sm:gap-6 sm:py-7">
            <div className="h-14 w-14 shrink-0" aria-hidden="true" />
            <div className="flex flex-1 flex-col justify-center gap-4">
              <p className="max-w-md text-base text-white/50">
                {data.description}
              </p>
              <CtaButton
                label={data.ctaLabel ?? "Learn More"}
                href={href}
                className="w-full max-w-md"
              />
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
