import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsTabs from "@/components/projects/ProjectsTabs";
import { getLocale } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import { fetchLocalizedSingleton } from "@/sanity/lib/localizedFetch";
import { projectsPageQuery } from "@/sanity/lib/queries";
import type { ProjectsPageDoc } from "@/sanity/lib/types";

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
        src: urlForImage(img).width(600).height(600).url(),
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
