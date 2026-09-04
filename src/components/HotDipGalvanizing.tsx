import CompareSlider from "./CompareSlider";
import CtaButton from "./CtaButton";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export type HotDipHomeData = {
  eyebrow?: string;
  title: string;
  beforeImage: string;
  beforeLabel?: string;
  afterImage: string;
  afterLabel?: string;
  benefits: { title: string; description: string }[];
  ctaLabel?: string;
};

export default function HotDipGalvanizing({
  data,
  href = "#",
}: {
  data: HotDipHomeData;
  href?: string;
}) {
  return (
    <section id="technology" className="hidden bg-neutral-950 px-5 py-4 sm:block sm:px-10">
      <div className="mx-auto w-full max-w-[1800px] overflow-hidden rounded-2xl bg-[#d7dcdc] text-neutral-900">
        <div className="grid lg:grid-cols-2">
          {/* Before / after comparison slider — drag to reveal */}
          <Reveal className="relative">
            <CompareSlider
              beforeSrc={data.beforeImage}
              beforeAlt="Hot-dip galvanized steel surface"
              beforeLabel={data.beforeLabel ?? "Hot-dip galvanized"}
              afterSrc={data.afterImage}
              afterAlt="Non-galvanized, rusted steel surface"
              afterLabel={data.afterLabel ?? "Non-galvanized"}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/25 to-transparent p-6 sm:p-10 lg:p-12">
              <Eyebrow>{data.eyebrow ?? "Services"}</Eyebrow>
              <h2
                className="mt-3 font-bold tracking-tight text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
              >
                {data.title}
              </h2>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="flex flex-col p-6 sm:p-10 lg:min-h-[660px] lg:p-12"
          >
            <ul>
              {data.benefits.map((benefit, i) => (
                <li
                  key={benefit.title}
                  className="flex items-start gap-4 border-t border-[#c1c7c7] py-4 first:border-t-0 sm:gap-5 sm:py-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#9ba0a0] text-base font-semibold text-[#555858]">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-base font-light text-[#555858] sm:text-xl">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-auto w-full max-w-md pt-8 sm:pt-12">
              <CtaButton label={data.ctaLabel ?? "Learn More"} href={href} className="w-full" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
