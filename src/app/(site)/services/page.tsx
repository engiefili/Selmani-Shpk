import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceSection from "@/components/services/ServiceSection";
import SelectedWork from "@/components/services/SelectedWork";
import { renderTabContent } from "@/components/services/renderTabContent";
import { getLocale, localizePath } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedServices } from "@/sanity/lib/localizedFetch";
import { servicesByPageQuery } from "@/sanity/lib/queries";
import type { ServiceDoc } from "@/sanity/lib/types";

// Services page sections use one slug convention ("hot-dip-galvanizing"),
// while the Projects page's gallery tabs use a slightly different one
// ("hot-dip-galvanising", British spelling) — this maps a section to the
// matching Projects tab so "See All" opens the right gallery pre-selected.
const PROJECTS_TAB_BY_SECTION: Record<string, string> = {
  "hot-dip-galvanizing": "hot-dip-galvanising",
  "metal-constructions": "metal-constructions",
  "tanks-containers": "tanks-containers",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    path: "/services",
    locale,
    title:
      locale === "sq"
        ? "Shërbimet: Zinkim, Konstruksione Metalike & Depozita"
        : "Services: Hot Dip Galvanizing, Metal Constructions & Tanks",
    description:
      locale === "sq"
        ? "Zbuloni shërbimet e Selmani për zinkim në të nxehtë, konstruksione metalike dhe depozita e kontenierë çeliku sipas kërkesës."
        : "Explore Selmani's hot-dip galvanizing, metal construction, and custom steel tank and container services.",
  });
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const sections = await fetchLocalizedServices<ServiceDoc>(
    servicesByPageQuery,
    "services",
    locale
  );

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <ServicesHero locale={locale} />

        {sections.map((section) => (
          <div key={section._id}>
            <ServiceSection
              id={section.sectionId.current}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              image={urlForImage(section.image).width(1600).url()}
              imageAlt={section.imageAlt}
              imageFit={section.imageFit}
              pdfLabel={section.pdfLabel}
              tabs={section.tabs.map((tab) => ({
                label: tab.label,
                image: tab.image
                  ? urlForImage(tab.image).width(1600).url()
                  : undefined,
                imageAlt: tab.imageAlt,
                content: renderTabContent(tab.content),
              }))}
            />
            {section.gallery && section.gallery.length > 0 && (
              <SelectedWork
                images={section.gallery.map((img, i) => ({
                  src: urlForImage(img).width(900).url(),
                  alt: img.alt ?? `${section.title} — selected work ${i + 1}`,
                }))}
                locale={locale}
                href={localizePath(
                  `/projects?tab=${
                    PROJECTS_TAB_BY_SECTION[section.sectionId.current] ??
                    section.sectionId.current
                  }`,
                  locale
                )}
              />
            )}
          </div>
        ))}

        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
