import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceSection from "@/components/services/ServiceSection";
import SelectedWork from "@/components/services/SelectedWork";
import { renderTabContent } from "@/components/services/renderTabContent";
import { getLocale } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedServices } from "@/sanity/lib/localizedFetch";
import { servicesByPageQuery } from "@/sanity/lib/queries";
import type { ServiceDoc } from "@/sanity/lib/types";

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
                images={section.gallery.map((img) =>
                  urlForImage(img).width(900).url()
                )}
                locale={locale}
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
