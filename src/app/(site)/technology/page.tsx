import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import ServiceSection from "@/components/services/ServiceSection";
import { renderTabContent } from "@/components/services/renderTabContent";
import ProcessSteps from "@/components/technology/ProcessSteps";
import FAQSection from "@/components/technology/FAQSection";
import { getLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
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

const FAQ_EN = [
  {
    question: "How long does hot-dip galvanizing last?",
    answer:
      "Properly hot-dip galvanized steel typically lasts 50+ years in most environments, thanks to zinc's sacrificial protection against corrosion.",
  },
  {
    question: "How is it different from painting?",
    answer:
      "Unlike paint, which sits on the surface and can chip or peel, galvanizing bonds zinc directly to the steel, including edges and welds paint often misses.",
  },
  {
    question: "What's the largest structure you can galvanize in one piece?",
    answer:
      "Our galvanizing kettle measures 6.5 by 1.7 by 2.6 meters, so we can treat large structural components in a single dip instead of joining smaller galvanized sections.",
  },
  {
    question: "Can you galvanize steel we've already had fabricated elsewhere?",
    answer:
      "Yes, we regularly galvanize customer-supplied steel, not just pieces we've built ourselves.",
  },
  {
    question: "Is hot-dip galvanizing environmentally friendly?",
    answer:
      "Zinc is non-toxic, occurs naturally, and is fully recyclable. Galvanized steel needs far less repainting over its life than uncoated steel.",
  },
  {
    question: "Are your services certified?",
    answer:
      "Yes, our processes are certified to ISO 9001, EQA 2011005, and OHSAS540 standards.",
  },
];

const FAQ_SQ = [
  {
    question: "Sa zgjat zinkimi në të nxehtë?",
    answer:
      "Çeliku i zinkuar siç duhet në të nxehtë zgjat zakonisht mbi 50 vjet në shumicën e mjediseve, falë mbrojtjes sakrifikuese që zinku ofron kundër korrozionit.",
  },
  {
    question: "Si ndryshon nga lyerja?",
    answer:
      "Ndryshe nga bojra, e cila qëndron vetëm në sipërfaqe dhe mund të plasaritet apo shkëputet, zinkimi lidh zinkun drejtpërdrejt me çelikun, duke përfshirë skajet dhe saldimet që bojra shpesh nuk i mbulon dot.",
  },
  {
    question: "Cila është struktura më e madhe që mund të zinkoni në një copë të vetme?",
    answer:
      "Kazani ynë i zinkimit ka përmasa 6.5 x 1.7 x 2.6 metra, çka na mundëson të trajtojmë komponentë strukturorë të mëdhenj në një zhytje të vetme, pa pasur nevojë t'i bashkojmë prej pjesësh më të vogla të zinkuara veç e veç.",
  },
  {
    question: "A mund të zinkoni çelik të fabrikuar diku tjetër?",
    answer:
      "Po, ne zinkojmë rregullisht struktura çeliku të sjella nga klientët, jo vetëm pjesë të prodhuara nga ne.",
  },
  {
    question: "A është zinkimi në të nxehtë i miqësor me mjedisin?",
    answer:
      "Zinku është jo-toksik, gjendet natyrshëm dhe është plotësisht i riciklueshëm. Çeliku i zinkuar ka nevojë për shumë më pak rilyerje gjatë jetës së tij krahasuar me çelikun e palyer.",
  },
  {
    question: "A janë shërbimet tuaja të certifikuara?",
    answer:
      "Po, proceset tona janë të certifikuara sipas standardeve ISO 9001, EQA 2011005 dhe OHSAS540.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    path: "/technology",
    locale,
    title:
      locale === "sq"
        ? "Teknologjia e Zinkimit dhe Fabrikimit të Çelikut"
        : "Hot-Dip Galvanizing & Steel Fabrication Technology",
    description:
      locale === "sq"
        ? "Shihni si procesi i zinkimit në të nxehtë dhe fabrikimit të çelikut nga Selmani mbron strukturat prej korrozionit për dekada."
        : "See how Selmani's hot-dip galvanizing and steel fabrication process protects steel structures from corrosion for decades.",
  });
}

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
          title={locale === "sq" ? "Teknologjia dhe Procesi" : "Technology & Process"}
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

        <FAQSection
          eyebrow={locale === "sq" ? "Pyetje" : "FAQ"}
          heading={locale === "sq" ? "Pyetje të Shpeshta" : "Frequently Asked Questions"}
          items={locale === "sq" ? FAQ_SQ : FAQ_EN}
        />

        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
