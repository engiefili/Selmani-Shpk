import {
  PageSideNavDesktop,
  PageSideNavMobile,
  type PageNavSection,
} from "./PageSideNav";

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
    <section className="relative min-h-dvh overflow-hidden bg-neutral-950 text-white lg:h-[90vh] lg:min-h-[760px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/35" />

      {/* Mobile mirrors the desktop hierarchy: title/description is the
          first thing seen near the top, big and bold enough to actually
          read as the hero's headline, with quick-nav pills separate in
          the bottom right corner. lg reverts to everything vertically
          centered together, with PageSideNavDesktop as its own
          bottom-right block below. */}
      <div className="absolute inset-0 mx-auto flex w-full max-w-[1800px] flex-col justify-between gap-6 px-5 pt-[30vh] pb-10 sm:px-10 lg:justify-center lg:py-24">
        <div className="flex flex-col gap-6">
          <h1
            className="whitespace-pre-line font-heading font-black leading-[0.95] tracking-tight text-white"
            style={{ fontSize: "clamp(3.75rem, 6.5vw, 7rem)" }}
          >
            {title}
          </h1>
          {description && (
            <p className="max-w-xl text-lg font-light leading-snug text-[#c1c7c7] sm:text-xl">
              {description}
            </p>
          )}
        </div>
        <div className="flex justify-end lg:hidden">
          <PageSideNavMobile sections={sections} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto hidden w-full max-w-[1800px] justify-end px-5 pb-12 sm:px-10 lg:flex">
        <PageSideNavDesktop sections={sections} />
      </div>
    </section>
  );
}
