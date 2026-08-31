import CtaButton from "./CtaButton";
import { localizePath } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

// Falls back to a bundled local photo until an image is set on Site
// Settings in Studio ("Let's shape your vision" background image),
// so this section never renders broken or empty.
const FALLBACK_IMAGE = "/hero_pipes.jpg";

export default async function CtaBand({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  const { settings } = await getSiteSettings(locale);
  const backgroundImage = settings.ctaBandImage
    ? urlForImage(settings.ctaBandImage).width(1800).url()
    : FALLBACK_IMAGE;

  return (
    <section className="bg-neutral-950 px-5 py-4 sm:px-10">
      <div className="relative mx-auto flex w-full max-w-[1800px] flex-col justify-center overflow-hidden rounded-2xl bg-neutral-900 px-5 py-8 text-white sm:px-12 sm:py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 to-black/80" />

        <div className="relative z-10 flex max-w-3xl flex-col gap-6 sm:gap-10">
          <div className="flex flex-col gap-3">
            <h2
              className="font-light leading-tight text-[#c1c7c7]"
              style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
            >
              {locale === "sq"
                ? "Na tregoni për vizionin tuaj. Le ta zhvillojmë së bashku."
                : "Let's shape your vision, together."}
            </h2>
            <p className="text-base font-light leading-snug text-[#eaefef] sm:text-xl">
              {locale === "sq"
                ? "Duam të dimë më shumë rreth projektit tuaj"
                : "We want to know more about your project"}
            </p>
          </div>
          <CtaButton
            label={locale === "sq" ? "NA KONTAKTONI!" : "Get in Touch"}
            href={localizePath("/contact", locale)}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
