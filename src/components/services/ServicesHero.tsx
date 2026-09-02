import { ServiceSideNavDesktop, ServiceSideNavMobile } from "./ServiceSideNav";

const HERO_IMAGE = "/services/hero_scene.jpg";

export default function ServicesHero({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  return (
    <section className="relative min-h-[520px] overflow-hidden bg-neutral-950 text-white sm:min-h-[600px] lg:h-[90vh] lg:min-h-[760px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Selmani steel tanks"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/35" />

      <div className="absolute inset-0 mx-auto flex w-full max-w-[1800px] flex-col justify-center gap-6 px-5 py-24 sm:px-10">
        <h1
          className="font-heading font-black leading-none tracking-tight text-[#c1c7c7]"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
        >
          {locale === "sq" ? "Shërbime & Produkte" : "Services & Products"}
        </h1>
        <ServiceSideNavMobile locale={locale} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto hidden w-full max-w-[1800px] justify-end px-5 pb-12 sm:px-10 lg:flex">
        <ServiceSideNavDesktop locale={locale} />
      </div>
    </section>
  );
}
