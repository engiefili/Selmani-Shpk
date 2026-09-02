import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import IndustriesIntro from "@/components/industries/IndustriesIntro";
import IndustrySection from "@/components/industries/IndustrySection";
import { getLocale } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedSingleton } from "@/sanity/lib/localizedFetch";
import { industriesPageQuery } from "@/sanity/lib/queries";
import type { IndustriesPageDoc } from "@/sanity/lib/types";

export default async function IndustriesPage() {
  const locale = await getLocale();
  const page = await fetchLocalizedSingleton<IndustriesPageDoc>(
    industriesPageQuery,
    "industriesPage",
    locale
  );

  if (!page) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-neutral-950 px-5 py-24 text-center text-white">
          <p className="text-lg text-[#c1c7c7]">
            Industries page content hasn&apos;t been added in Sanity yet.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const navSections = page.sections.map((s) => ({
    id: s.sectionId.current,
    label: s.title,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <PageHero
          title={page.heroTitle}
          image={urlForImage(page.heroImage).width(2400).url()}
          imageAlt={page.heroImageAlt ?? ""}
          sections={navSections}
        />

        <IndustriesIntro description={page.heroDescription} />

        {page.sections.map((section) => (
          <IndustrySection
            key={section._key}
            id={section.sectionId.current}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            applications={section.applications}
            closing={section.closing}
            image={section.image ? urlForImage(section.image).width(1200).url() : undefined}
            imageAlt={section.imageAlt}
            imagePosition={section.imagePosition}
            locale={locale}
          />
        ))}

        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
