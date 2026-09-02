export type ProjectsHeroData = {
  title: string;
  image: string;
  imageAlt?: string;
};

export default function ProjectsHero({ data }: { data: ProjectsHeroData }) {
  return (
    <section className="relative h-[64vh] min-h-[560px] overflow-hidden bg-neutral-950 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.image}
        alt={data.imageAlt ?? ""}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-neutral-950/30" />

      <div className="relative mx-auto flex h-full w-full max-w-[1800px] items-center px-5 sm:px-10">
        <h1
          className="font-heading font-black leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
        >
          {data.title}
        </h1>
      </div>
    </section>
  );
}
