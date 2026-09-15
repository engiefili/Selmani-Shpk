"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ProjectGrid, { type ProjectImage } from "./ProjectGrid";
import Reveal from "../Reveal";

export type ProjectsTabsData = {
  id: string;
  label: string;
  groups: { subLabel?: string; images: ProjectImage[] }[];
}[];

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="border-b border-[#2a2c2c] pb-4 text-2xl font-light text-[#eaefef] sm:text-3xl">
      {title}
    </h2>
  );
}

function SubEyebrow({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-light tracking-wide text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </span>
  );
}

export default function ProjectsTabs({
  data,
  locale = "en",
}: {
  data: ProjectsTabsData;
  locale?: "en" | "sq";
}) {
  // Supports deep-linking from other pages (e.g. a service section's
  // "See All" button) via /projects?tab=<tabId>, falling back to the
  // first tab when absent or unrecognized.
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab =
    requestedTab && data.some((tab) => tab.id === requestedTab)
      ? requestedTab
      : (data[0]?.id ?? "");
  const [active, setActive] = useState<string>(initialTab);
  const activeTab = data.find((tab) => tab.id === active);

  return (
    <section className="bg-neutral-950 px-5 pt-8 pb-16 text-white sm:px-[45px] sm:py-16">
      <div className="mx-auto flex w-full flex-col gap-10">
        <Reveal className="flex flex-col gap-4">
          <span className="text-2xl font-light text-[#eaefef]">
            {locale === "sq" ? "Shërbime:" : "Service:"}
          </span>
          <div className="flex flex-wrap gap-3" role="tablist">
            {data.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active === tab.id}
                onClick={() => setActive(tab.id)}
                className={`rounded-md border px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 ease-out active:scale-[0.97] ${
                  active === tab.id
                    ? "border-[#c1c7c7] bg-[#c1c7c7] text-[#171919]"
                    : "border-[#9ba0a0]/60 text-[#c1c7c7] hover:border-accent hover:text-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {activeTab && (
          <div className={`flex flex-col ${activeTab.groups.length > 1 ? "gap-10" : "gap-6"}`}>
            <SectionHeading title={activeTab.label} />
            {activeTab.groups.map((group, i) => (
              <div key={group.subLabel ?? i} className="flex flex-col gap-6">
                {group.subLabel && <SubEyebrow label={group.subLabel} />}
                <ProjectGrid images={group.images} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
