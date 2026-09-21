import Image from "next/image";
import CtaButton from "./CtaButton";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export type MetallicShowcaseItem = {
  title: string;
  image?: string;
};

export type MetallicConstructionsData = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  showcase: MetallicShowcaseItem[];
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
      <div className="mx-auto flex w-full flex-col gap-[100px]">
        <div className="flex flex-col gap-14">
          <Reveal className="flex flex-col gap-2">
            <Eyebrow>{data.eyebrow ?? "Services"}</Eyebrow>
            <div className="flex flex-col gap-5">
              <h2
                className="font-light leading-none tracking-tight text-[#eaefef]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
              >
                {data.title}
              </h2>
              <p className="text-2xl leading-[0.9] text-[#9ba0a0]">
                {data.subtitle}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {data.showcase.map((item, i) => (
              <Reveal
                key={item.title}
                delay={Math.min(i * 100, 200)}
                className="flex flex-col gap-5"
              >
                <div className="relative aspect-[603/600] w-full overflow-hidden rounded-xl bg-neutral-900">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="text-[32px] leading-none text-[#eaefef]">
                  {item.title}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="flex flex-col gap-5">
          <p className="max-w-[760px] text-2xl leading-[0.9] text-[#9ba0a0]">
            {data.description}
          </p>
          <CtaButton
            label={data.ctaLabel ?? "Learn More"}
            href={href}
            className="w-full max-w-md"
          />
        </Reveal>
      </div>
    </section>
  );
}
