"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Eyebrow from "./Eyebrow";

export type ServiceCardData = {
  key: string;
  eyebrow?: string;
  title: string;
  image: string;
  imageAlt?: string;
  /** "contain" for product-on-plain-background shots that shouldn't be
   * cropped (e.g. the tank photo) — "cover" for full-bleed scene photos. */
  imageFit?: "cover" | "contain";
  ctaLabel: string;
  href: string;
};

// Phone-only swipeable card set standing in for the Hot Dip Galvanizing /
// Metallic Constructions / Tanks & Containers bands, which on larger
// screens render as three full-width sections. Scrolling through three
// tall desktop-style banners is a lot of vertical distance on a phone;
// this trades that for a single horizontal gesture — image, title, and
// a tap-through per card, kept deliberately text-light since the full
// detail lives one tap away on the Services page.
export default function MobileServiceCarousel({
  title,
  cards,
}: {
  title: string;
  cards: ServiceCardData[];
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = cardRefs.current.findIndex((el) => el === entry.target);
          if (idx !== -1) setActive(idx);
        });
      },
      { root: track, threshold: 0.6 }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [cards.length]);

  return (
    <section className="bg-neutral-950 pt-2 pb-8 sm:hidden">
      <div className="px-5 pb-4">
        <Eyebrow>{title}</Eyebrow>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* With snap-mandatory, the browser rests scroll position at the
            nearest snap point on load — a plain leading spacer isn't one,
            so it immediately snapped past it to the first card, hiding it.
            Marking the spacer itself snap-start makes position 0 (spacer +
            full first card) a valid resting point. */}
        <div className="w-5 shrink-0 snap-start" aria-hidden="true" />
        {cards.map((card, i) => (
          <a
            key={card.key}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            href={card.href}
            className={`flex w-[80vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-neutral-900 text-white ${
              i < cards.length - 1 ? "mr-4" : ""
            }`}
          >
            <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-neutral-900">
              <Image
                src={card.image}
                alt={card.imageAlt ?? ""}
                fill
                sizes="80vw"
                className={card.imageFit === "contain" ? "object-contain" : "object-cover"}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-2xl font-bold leading-tight text-white">
                  {card.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center p-5">
              <span className="inline-flex items-center gap-1.5 text-base font-medium text-accent">
                {card.ctaLabel}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        ))}
        <div className="w-5 shrink-0" aria-hidden="true" />
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {cards.map((card, i) => (
          <span
            key={card.key}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-accent" : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
