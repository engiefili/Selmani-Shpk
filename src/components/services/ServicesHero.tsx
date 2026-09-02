import { ServiceSideNavDesktop, ServiceSideNavMobile } from "./ServiceSideNav";

const HERO_IMAGE = "/services/hero_scene.jpg";

export default function ServicesHero({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-neutral-950 text-white lg:h-[90vh] lg:min-h-[760px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Selmani steel tanks"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/35" />

      {/* Mobile mirrors the desktop hierarchy: title is the first thing
          seen near the top, big and bold enough to actually read as the
          hero's headline, with quick-nav pills separate in the bottom
          right corner. lg reverts to the title vertically centered on its
          own, with ServiceSideNavDesktop as the separate bottom-right block
          below. */}
      <div className="absolute inset-0 mx-auto flex w-full max-w-[1800px] flex-col justify-between gap-6 px-5 pt-[30vh] pb-10 sm:px-10 lg:justify-center lg:py-24">
        <h1
          className="font-heading font-black leading-none tracking-tight text-[#c1c7c7]"
          style={{ fontSize: "clamp(3.75rem, 6.5vw, 7rem)" }}
        >
          {locale === "sq" ? "Shërbime & Produkte" : "Services & Products"}
        </h1>
        <div className="flex justify-end lg:hidden">
          <ServiceSideNavMobile locale={locale} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto hidden w-full max-w-[1800px] justify-end px-5 pb-12 sm:px-10 lg:flex">
        <ServiceSideNavDesktop locale={locale} />
      </div>
    </section>
  );
}
