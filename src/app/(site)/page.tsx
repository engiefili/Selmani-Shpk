import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import MetallicConstructions from "@/components/MetallicConstructions";
import HotDipGalvanizing from "@/components/HotDipGalvanizing";
import TanksShowcase from "@/components/TanksShowcase";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { getLocale } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedSingleton } from "@/sanity/lib/localizedFetch";
import { homePageQuery } from "@/sanity/lib/queries";
import type { HomePageDoc } from "@/sanity/lib/types";

export default async function Home() {
  const locale = await getLocale();
  const home = await fetchLocalizedSingleton<HomePageDoc>(
    homePageQuery,
    "homePage",
    locale
  );

  if (!home) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-neutral-950 px-5 py-24 text-center text-white">
          <p className="text-lg text-[#c1c7c7]">
            Home page content hasn&apos;t been added in Sanity yet.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero
          data={{
            heading: home.hero.heading,
            subheading: home.hero.subheading,
            backgroundImage: urlForImage(home.hero.backgroundImage).width(2400).url(),
            backgroundImageAlt: home.hero.backgroundImageAlt,
            certifications: home.hero.certifications,
            ctaLabel: home.hero.ctaLabel,
          }}
        />
        <AboutUs
          data={{
            eyebrow: home.aboutUs.eyebrow,
            text: home.aboutUs.text,
            image: urlForImage(home.aboutUs.image).width(800).url(),
            imageAlt: home.aboutUs.imageAlt,
          }}
        />
        <HotDipGalvanizing
          data={{
            eyebrow: home.hotDipGalvanizing.eyebrow,
            title: home.hotDipGalvanizing.title,
            beforeImage: urlForImage(home.hotDipGalvanizing.beforeImage).width(1200).url(),
            beforeLabel: home.hotDipGalvanizing.beforeLabel,
            afterImage: urlForImage(home.hotDipGalvanizing.afterImage).width(1200).url(),
            afterLabel: home.hotDipGalvanizing.afterLabel,
            benefits: home.hotDipGalvanizing.benefits,
            ctaLabel: home.hotDipGalvanizing.ctaLabel,
          }}
        />
        <MetallicConstructions
          data={{
            eyebrow: home.metallicConstructions.eyebrow,
            title: home.metallicConstructions.title,
            services: home.metallicConstructions.services.map((s) => ({
              title: s.title,
              industries: s.industries,
              icon: s.icon ? urlForImage(s.icon).width(128).height(128).url() : undefined,
            })),
            description: home.metallicConstructions.description,
            ctaLabel: home.metallicConstructions.ctaLabel,
          }}
        />
        <TanksShowcase
          data={{
            eyebrow: home.tanksShowcase.eyebrow,
            title: home.tanksShowcase.title,
            image: urlForImage(home.tanksShowcase.image).width(1200).url(),
            imageAlt: home.tanksShowcase.imageAlt,
            tanks: home.tanksShowcase.tanks,
            ctaLabel: home.tanksShowcase.ctaLabel,
          }}
        />
        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
