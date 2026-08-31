import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import ValuesGrid from "@/components/about/ValuesGrid";
import ServicesBand from "@/components/about/ServicesBand";
import ClientsGrid from "@/components/about/ClientsGrid";
import CommitmentGrid from "@/components/about/CommitmentGrid";
import CtaBand from "@/components/CtaBand";
import { getLocale } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedSingleton } from "@/sanity/lib/localizedFetch";
import { aboutPageQuery } from "@/sanity/lib/queries";
import type { AboutPageDoc } from "@/sanity/lib/types";

export default async function AboutPage() {
  const locale = await getLocale();
  const about = await fetchLocalizedSingleton<AboutPageDoc>(
    aboutPageQuery,
    "aboutPage",
    locale
  );

  if (!about) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-neutral-950 px-5 py-24 text-center text-white">
          <p className="text-lg text-[#c1c7c7]">
            About page content hasn&apos;t been added in Sanity yet.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col pt-[76px]">
        <AboutHero
          data={{
            heading: about.hero.heading,
            intro: about.hero.intro,
            image: urlForImage(about.hero.image).width(1200).url(),
            imageAlt: about.hero.imageAlt,
            journeyHeading: about.hero.journeyHeading,
            journeyPoints: about.hero.journeyPoints,
          }}
        />
        <ValuesGrid
          data={{
            values: about.valuesGrid.values.map((v) => ({
              title: v.title,
              description: v.description,
              image: v.image ? urlForImage(v.image).width(900).url() : undefined,
            })),
          }}
        />
        <ServicesBand
          data={{
            eyebrow: about.servicesBand.eyebrow,
            heading: about.servicesBand.heading,
            backgroundImage: urlForImage(about.servicesBand.backgroundImage).width(1800).url(),
            intro: about.servicesBand.intro,
            bullets: about.servicesBand.bullets,
            ctaLabel: about.servicesBand.ctaLabel,
          }}
          locale={locale}
        />
        <ClientsGrid
          data={{ heading: about.clientsGrid.heading, clients: about.clientsGrid.clients }}
          locale={locale}
        />
        <CommitmentGrid
          data={{
            heading: about.commitmentGrid.heading,
            intro: about.commitmentGrid.intro,
            commitments: about.commitmentGrid.commitments.map((c) => ({
              label: c.label,
              icon: c.icon ? urlForImage(c.icon).width(300).url() : undefined,
            })),
          }}
        />
        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
