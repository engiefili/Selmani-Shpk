import PageSideNav, { type PageNavSection } from "./PageSideNav";

export default function PageHero({
  title,
  description,
  image,
  imageAlt,
  imagePosition = "center",
  sections,
}: {
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  sections: PageNavSection[];
}) {
  return (
    <section className="relative h-[90vh] min-h-[760px] overflow-hidden bg-neutral-950 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/35" />

      <div className="relative mx-auto flex h-full w-full max-w-[1800px] flex-col justify-center px-5 sm:px-10">
        <div className="flex flex-col gap-6">
          <h1
            className="whitespace-pre-line font-heading font-black leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
          >
            {title}
          </h1>
          {description && (
            <p className="max-w-xl text-lg font-light leading-snug text-[#c1c7c7] sm:text-xl">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-[1800px] justify-end px-5 pb-12 sm:px-10">
        <PageSideNav sections={sections} />
      </div>
    </section>
  );
}
