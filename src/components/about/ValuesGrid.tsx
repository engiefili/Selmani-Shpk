import Image from "next/image";
import Reveal from "../Reveal";

export type ValuesGridData = {
  values: { title: string; description: string; image?: string }[];
};

const DEFAULT_HEADING = "Our Values";

function ValueText({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-xl font-normal text-[#c1c7c7] sm:text-2xl">{title}</h3>
      <p className="mt-1 max-w-md text-base font-light leading-relaxed text-[#c1c7c7]">
        {description}
      </p>
    </div>
  );
}

export default function ValuesGrid({
  data,
  heading = DEFAULT_HEADING,
}: {
  data: ValuesGridData;
  heading?: string;
}) {
  const [performanceValue, customer, durability] = data.values;

  return (
    <section className="bg-neutral-950 px-5 py-8 text-white sm:px-[45px] sm:py-10">
      <div className="mx-auto w-full">
        <Reveal as="div">
          <h2
            className="pb-8 font-light tracking-tight text-[#eaefef]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
          >
            {heading}
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto grid w-full grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3 lg:items-stretch">
        {/* Left: caption above image. */}
        <Reveal as="div" className="flex flex-col gap-5 sm:gap-6">
          <ValueText title={performanceValue.title} description={performanceValue.description} />
          {performanceValue.image && (
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
              <Image
                src={performanceValue.image}
                alt="Performance-oriented facility"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </Reveal>

        {/* Center: vertically centered caption. */}
        <Reveal
          as="div"
          delay={100}
          className="flex flex-col items-center justify-center gap-8 px-4 text-center"
        >
          <div className="max-w-sm">
            <ValueText title={customer.title} description={customer.description} />
          </div>
        </Reveal>

        {/* Right: image above caption — mirrors the left column. */}
        <Reveal as="div" delay={200} className="flex flex-col gap-5 sm:gap-6">
          {durability.image && (
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
              <Image
                src={durability.image}
                alt="Durability-driven manufacturing"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <ValueText title={durability.title} description={durability.description} />
        </Reveal>
      </div>
    </section>
  );
}
