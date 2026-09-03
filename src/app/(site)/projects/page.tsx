import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsTabs from "@/components/projects/ProjectsTabs";
import { getLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedSingleton } from "@/sanity/lib/localizedFetch";
import { projectsPageQuery } from "@/sanity/lib/queries";
import type { ProjectsPageDoc } from "@/sanity/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMetadata({
    path: "/projects",
    locale,
    title: locale === "sq" ? "Projektet Tona" : "Our Projects",
    description:
      locale === "sq"
        ? "Shfletoni projektet e përfunduara të zinkimit, konstruksioneve metalike dhe depozitave të realizuara nga Selmani në të gjithë Shqipërinë."
        : "Browse completed hot-dip galvanizing, metal construction, and tank projects delivered by Selmani across Albania.",
  });
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const page = await fetchLocalizedSingleton<ProjectsPageDoc>(
    projectsPageQuery,
    "projectsPage",
    locale
  );

  if (!page) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-neutral-950 px-5 py-24 text-center text-white">
          <p className="text-lg text-[#c1c7c7]">
            Projects page content hasn&apos;t been added in Sanity yet.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const tabsData = page.tabs.map((tab) => ({
    id: tab.tabId.current,
    label: tab.label,
    groups: tab.groups.map((group) => ({
      subLabel: group.subLabel,
      images: group.images.map((img, i) => ({
        src: urlForImage(img).width(700).height(700).quality(90).url(),
        full: urlForImage(img).width(900).fit("max").quality(95).url(),
        alt: `${tab.label} project photo ${i + 1}`,
      })),
    })),
  }));

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <ProjectsHero
          data={{
            title: page.heroTitle,
            image: urlForImage(page.heroImage).width(2400).url(),
            imageAlt: page.heroImageAlt,
          }}
        />
        <Suspense fallback={null}>
          <ProjectsTabs data={tabsData} locale={locale} />
        </Suspense>
        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
