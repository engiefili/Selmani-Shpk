import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import ServiceSection from "@/components/services/ServiceSection";
import { renderTabContent } from "@/components/services/renderTabContent";
import ProcessSteps from "@/components/technology/ProcessSteps";
import { getLocale } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedServices } from "@/sanity/lib/localizedFetch";
import { servicesByPageQuery } from "@/sanity/lib/queries";
import type { ServiceDoc } from "@/sanity/lib/types";
import {
  Droplets,
  Droplet,
  FlaskConical,
  Beaker,
  Sun,
  Container,
  Snowflake,
} from "lucide-react";

const HERO_IMAGE = "/technology/hero.jpg";

const SECTIONS_EN = [
  { id: "hot-dip-galvanizing", label: "Hot Dip Galvanizing" },
  { id: "steel-fabrication", label: "Steel Fabrication" },
];

const SECTIONS_SQ = [
  { id: "hot-dip-galvanizing", label: "Zinkim në të Nxehtë" },
  { id: "steel-fabrication", label: "Fabrikim Metalik" },
];

const PROCESS_STEPS_EN = [
  { label: "Degreasing", icon: Droplets },
  { label: "Rinsing", icon: Droplet },
  { label: "Pickling", icon: FlaskConical },
  { label: "Rinsing", icon: Droplet },
  { label: "Flux Solution", icon: Beaker },
  { label: "Drying & Pre-heating", icon: Sun },
  { label: "HD Galvanizing", icon: Container },
  { label: "Cooling and Inspection", icon: Snowflake },
];

const PROCESS_STEPS_SQ = [
  { label: "Heqja e vajrave", icon: Droplets },
  { label: "Shpëlarja me ujë", icon: Droplet },
  { label: "Zhveshja nga oksidet përmes trajtimit në tretësirë acide", icon: FlaskConical },
  { label: "Shpëlarja", icon: Droplet },
  { label: "Fluksimi ose trajtimi me kripëra", icon: Beaker },
  { label: "Tharja dhe parangrohja", icon: Sun },
  { label: "Zinkimi në të nxehtë", icon: Container },
  { label: "Ftohja dhe inspektimi", icon: Snowflake },
];

export default async function TechnologyPage() {
  const locale = await getLocale();
  const sections = await fetchLocalizedServices<ServiceDoc>(
    servicesByPageQuery,
    "technology",
    locale
  );
  const hotDip = sections.find((s) => s.sectionId.current === "hot-dip-galvanizing");
  const steelFabrication = sections.find(
    (s) => s.sectionId.current === "steel-fabrication"
  );

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <PageHero
          title={locale === "sq" ? "Teknologjia" : "Technology"}
          image={HERO_IMAGE}
          imageAlt={
            locale === "sq"
              ? "Komponentë çeliku të varur për zinkim në të nxehtë"
              : "Steel components suspended for hot-dip galvanizing"
          }
          sections={locale === "sq" ? SECTIONS_SQ : SECTIONS_EN}
        />

        {hotDip && (
          <ServiceSection
            id={hotDip.sectionId.current}
            eyebrow={hotDip.eyebrow}
            title={hotDip.title}
            description={hotDip.description}
            image={urlForImage(hotDip.image).width(1600).url()}
            imageAlt={hotDip.imageAlt}
            imageFit={hotDip.imageFit}
            pdfLabel={hotDip.pdfLabel}
            tabs={hotDip.tabs.map((tab) => ({
              label: tab.label,
              image: tab.image
                ? urlForImage(tab.image).width(1600).url()
                : undefined,
              imageAlt: tab.imageAlt,
              content: renderTabContent(tab.content),
            }))}
            extra={
              <div className="mt-16">
                <h3 className="border-t border-[#e6e6e6]/20 pt-6 text-3xl font-light text-[#c1c7c7] sm:text-4xl">
                  {locale === "sq" ? "Etapat e Përgatitjes së Sipërfaqes" : "Surface Preparation Stages"}
                </h3>
                <ProcessSteps
                  steps={locale === "sq" ? PROCESS_STEPS_SQ : PROCESS_STEPS_EN}
                  pdfLabel={locale === "sq" ? "Dokument Teknik PDF" : "PDF Technical Doc"}
                />
              </div>
            }
          />
        )}

        {steelFabrication && (
          <ServiceSection
            id={steelFabrication.sectionId.current}
            eyebrow={steelFabrication.eyebrow}
            title={steelFabrication.title}
            description={steelFabrication.description}
            image={urlForImage(steelFabrication.image).width(1600).url()}
            imageAlt={steelFabrication.imageAlt}
            imageFit={steelFabrication.imageFit}
            pdfLabel={steelFabrication.pdfLabel}
            tabs={steelFabrication.tabs.map((tab) => ({
              label: tab.label,
              image: tab.image
                ? urlForImage(tab.image).width(1600).url()
                : undefined,
              imageAlt: tab.imageAlt,
              content: renderTabContent(tab.content),
            }))}
          />
        )}

        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
