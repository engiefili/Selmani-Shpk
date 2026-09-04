import Image from "next/image";
import CtaButton from "./CtaButton";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export type TanksShowcaseData = {
  eyebrow?: string;
  title: string;
  image: string;
  imageAlt?: string;
  tanks: { title: string; description: string }[];
  ctaLabel?: string;
};

export default function TanksShowcase({
  data,
  href = "#",
}: {
  data: TanksShowcaseData;
  href?: string;
}) {
  return (
    <section id="industries" className="hidden bg-neutral-950 px-5 py-4 sm:block sm:px-10">
      <div className="mx-auto w-full max-w-[1800px] overflow-hidden rounded-2xl bg-neutral-900 p-6 text-white sm:p-12">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal
            className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-accent/70"
            style={{ boxShadow: "0 0 22px 2px rgba(1, 135, 148, 0.3)" }}
          >
            <Image
              src={data.image}
              alt={data.imageAlt ?? ""}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>{data.eyebrow ?? "Services"}</Eyebrow>
            <h2
              className="mt-3 font-light tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
            >
              {data.title}
            </h2>

            <ul className="mt-6 sm:mt-8">
              {data.tanks.map((tank, i) => (
                <li
                  key={tank.title}
                  className="flex items-start gap-4 border-t border-white/10 py-4 first:border-t-0 sm:gap-5 sm:py-5"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
                      i === 0
                        ? "bg-accent text-white"
                        : "border border-[#9ba0a0] text-[#9ba0a0]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-white ${i === 0 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
                    >
                      {tank.title}
                    </h3>
                    <p className="mt-1 text-base font-light text-[#9ba0a0] sm:text-xl">
                      {tank.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <CtaButton
              label={data.ctaLabel ?? "Learn More"}
              href={href}
              className="mt-6 w-full max-w-md sm:mt-8"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
