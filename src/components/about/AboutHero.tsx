import Image from "next/image";

export type AboutHeroData = {
  heading?: string;
  intro: string;
  image: string;
  imageAlt?: string;
  journeyHeading: string;
  journeyPoints: string[];
};

export default function AboutHero({ data }: { data: AboutHeroData }) {
  return (
    <section className="bg-neutral-950 px-5 pt-6 pb-10 text-white sm:px-10 sm:pt-24 sm:pb-14">
      <div className="mx-auto grid w-full max-w-[1800px] gap-8 sm:gap-12 lg:grid-cols-[3fr_2fr] lg:items-start">
        <div>
          <h1
            className="hero-fade-up font-light tracking-tight text-[#c1c7c7]"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 76px)" }}
          >
            {data.heading ?? "Our beginnings"}
          </h1>
          <p
            className="hero-fade-up mt-4 max-w-xl text-base font-light leading-snug text-[#c1c7c7]"
            style={{ animationDelay: "0.15s" }}
          >
            {data.intro}
          </p>

          <div
            className="hero-fade-up mt-10 sm:mt-14"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-lg font-medium leading-tight text-[#eaefef]">
              {data.journeyHeading}
            </p>
            <ul className="mt-4 list-disc space-y-2.5 pl-6 text-base font-light leading-snug text-[#c1c7c7] marker:text-accent">
              {data.journeyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-[240px] items-center justify-center lg:mx-0 lg:flex lg:max-w-none">
          <Image
            src={data.image}
            alt={data.imageAlt ?? ""}
            fill
            sizes="240px"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
