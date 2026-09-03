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
          <h1 className="text-3xl font-light tracking-tight text-[#c1c7c7] sm:text-4xl lg:text-5xl">
            {data.heading ?? "Our beginnings"}
          </h1>
          <p className="mt-4 max-w-xl text-sm font-light leading-snug text-[#c1c7c7]">
            {data.intro}
          </p>

          <div className="mt-10 sm:mt-32">
            <p className="text-lg font-medium leading-tight text-[#eaefef]">
              {data.journeyHeading}
            </p>
            <ul className="mt-4 list-disc space-y-2.5 pl-6 text-sm font-light leading-tight text-[#c1c7c7] marker:text-accent">
              {data.journeyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center sm:mx-0 sm:max-w-none">
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
