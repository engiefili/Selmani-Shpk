import ServiceSideNav from "./ServiceSideNav";

const HERO_IMAGE = "/services/hero_scene.jpg";

export default function ServicesHero({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  return (
    <section className="relative h-[90vh] min-h-[760px] overflow-hidden bg-neutral-950 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Selmani steel tanks"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-neutral-950/35" />

      <div className="relative mx-auto flex h-full w-full max-w-[1800px] flex-col px-5 sm:px-10">
        <div className="flex flex-1 items-end pb-10">
          <h1
            className="font-heading font-black leading-none tracking-tight text-[#c1c7c7]"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
          >
            {locale === "sq" ? "Shërbime & Produkte" : "Services & Products"}
          </h1>
        </div>

        <div className="flex justify-end pb-12">
          <ServiceSideNav locale={locale} />
        </div>
      </div>
    </section>
  );
}
