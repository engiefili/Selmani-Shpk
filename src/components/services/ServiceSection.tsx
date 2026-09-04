"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";
import Reveal from "../Reveal";

export type ServiceTab = {
  label: string;
  content: ReactNode;
  image?: string;
  imageAlt?: string;
};

export default function ServiceSection({
  id,
  eyebrow = "Services and Products",
  title,
  description,
  tabs,
  image,
  imageAlt,
  imageFit = "cover",
  pdfLabel = "PDF Technical Doc",
  extra,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  tabs: ServiceTab[];
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  pdfLabel?: string;
  extra?: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(0);
  // Direction the content should swipe in from, based on whether the
  // newly selected tab sits to the right or left of the current one.
  const [tabDirection, setTabDirection] = useState(1);
  const activeImage = tabs[activeTab]?.image ?? image;
  const activeImageAlt = tabs[activeTab]?.imageAlt ?? imageAlt;

  const selectTab = (i: number) => {
    if (i === activeTab) return;
    setTabDirection(i > activeTab ? 1 : -1);
    setActiveTab(i);
  };

  return (
    <section
      id={id}
      className="scroll-mt-4 bg-neutral-950 px-5 pt-16 pb-4 text-white sm:px-10"
    >
      <div className="mx-auto w-full max-w-[1800px]">
        <Reveal className="flex max-w-3xl flex-col gap-[30px]">
          <span className="inline-flex items-center gap-2 text-xl font-light tracking-wide text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {eyebrow}
          </span>
          <h2
            className="font-light leading-none text-[#eaefef]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
          >
            {title}
          </h2>
          <p className="max-w-2xl text-xl font-light leading-snug text-[#c1c7c7]">
            {description}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-3 lg:grid-cols-2">
          {/* Tab card — ordered after the image on mobile so the photo
              gives context before the reader hits the detail text;
              lg:order-none restores source order (card first) side by side. */}
          <Reveal
            delay={100}
            className="order-2 flex flex-col rounded-xl bg-[#171919] p-8 lg:order-none lg:min-h-[820px] lg:p-10"
          >
            <div className="flex w-full gap-3" role="tablist">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  id={`tab-${id}-${i}`}
                  role="tab"
                  aria-selected={activeTab === i}
                  aria-controls={`tabpanel-${id}-${i}`}
                  onClick={() => selectTab(i)}
                  className={`flex-1 rounded-md px-4 py-3 text-center text-xl font-medium tracking-wide transition-all duration-300 ease-out active:scale-[0.97] ${
                    activeTab === i
                      ? "border border-accent bg-accent text-[#eaefef]"
                      : "border border-[#9ba0a0] text-[#9ba0a0] hover:border-[#c1c7c7] hover:text-[#c1c7c7]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Every tab's content stays in the DOM at all times — only
                the active one is shown (via the "hidden" utility) — so
                search engines can crawl all of it, not just whichever tab
                happened to be open. Toggling display:none also naturally
                replays the swipe-in animation each time a panel becomes
                visible, so no remount/key trick is needed. */}
            <div className="mt-8 flex flex-1 flex-col">
              {tabs.map((tab, i) => (
                <div
                  key={tab.label}
                  id={`tabpanel-${id}-${i}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${id}-${i}`}
                  aria-hidden={activeTab !== i}
                  className={`tab-swipe-in flex flex-1 flex-col ${activeTab === i ? "" : "hidden"}`}
                  style={{ "--tab-dir": tabDirection } as CSSProperties}
                >
                  {tab.content}
                </div>
              ))}
            </div>

            <div className="pt-8">
              <div className="inline-flex h-[58px] w-fit items-stretch gap-2">
                <a
                  href="#"
                  className="inline-flex h-full min-w-[280px] items-center justify-center rounded-md border border-[#e6e6e6]/45 px-6 text-sm text-[#e6e6e6] transition hover:border-accent hover:text-accent"
                >
                  {pdfLabel}
                </a>
                <a
                  href="#"
                  aria-label={pdfLabel}
                  className="flex h-full w-[58px] shrink-0 items-center justify-center"
                >
                  <Image
                    src="/icons/download.png"
                    alt=""
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Image */}
          <Reveal
            delay={200}
            className="order-1 relative min-h-[360px] overflow-hidden rounded-xl bg-neutral-800 lg:order-none lg:h-full"
          >
            <Image
              src={activeImage}
              alt={activeImageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={
                imageFit === "contain"
                  ? "object-contain p-8 sm:p-12"
                  : "object-cover"
              }
            />
            {imageFit !== "contain" && (
              <div className="pointer-events-none absolute inset-0 bg-black/20" />
            )}
          </Reveal>
        </div>

        {extra}
      </div>
    </section>
  );
}
