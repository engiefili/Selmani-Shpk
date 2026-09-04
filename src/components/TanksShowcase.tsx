"use client";

import Image from "next/image";
import { useState } from "react";
import CtaButton from "./CtaButton";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export type TanksShowcaseData = {
  eyebrow?: string;
  title: string;
  image: string;
  imageAlt?: string;
  tanks: { title: string; description: string; image?: string; imageAlt?: string }[];
  ctaLabel?: string;
};

export default function TanksShowcase({
  data,
  href = "#",
}: {
  data: TanksShowcaseData;
  href?: string;
}) {
  const [selected, setSelected] = useState(0);
  const active = data.tanks[selected];
  const displayImage = active?.image ?? data.image;
  const displayAlt = active?.image ? active.imageAlt ?? active.title : data.imageAlt ?? "";

  return (
    <section id="industries" className="hidden bg-neutral-950 px-5 py-4 sm:block sm:px-10">
      <div className="mx-auto w-full max-w-[1800px] overflow-hidden rounded-2xl bg-neutral-900 p-6 text-white sm:p-12">
        <div className="grid gap-8 sm:gap-12 xl:grid-cols-2 xl:items-center">
          <Reveal
            className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-accent/70 bg-gradient-to-br from-[#2a2c2c] to-black"
            style={{ boxShadow: "0 0 22px 2px rgba(1, 135, 148, 0.3)" }}
          >
            <Image
              key={displayImage}
              src={displayImage}
              alt={displayAlt}
              fill
              sizes="(min-width: 1280px) 50vw, 100vw"
              className="object-contain p-8 transition-opacity duration-300 sm:p-12"
            />
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>{data.eyebrow ?? "Services"}</Eyebrow>
            <h2
              className="mt-3 font-light tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
            >
              {data.title}
            </h2>

            <ul className="mt-6 sm:mt-8">
              {data.tanks.map((tank, i) => {
                const isActive = i === selected;
                return (
                  <li
                    key={tank.title}
                    className="border-t border-white/10 first:border-t-0"
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={isActive}
                      className="flex w-full items-start gap-4 rounded-lg py-4 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 sm:gap-5 sm:py-5"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold transition ${
                          isActive
                            ? "bg-accent text-white"
                            : "border border-[#9ba0a0] text-[#9ba0a0]"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-white transition-all ${isActive ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
                        >
                          {tank.title}
                        </h3>
                        <p className="mt-1 text-base font-light text-[#9ba0a0] sm:text-xl">
                          {tank.description}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <CtaButton
              label={data.ctaLabel ?? "Learn More"}
              href={href}
              className="mt-6 w-full max-w-md sm:mt-8"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
