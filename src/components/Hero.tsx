"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ArrowUpRight from "./icons/ArrowUpRight";

export type HeroSlideData = {
  image: string;
  imageAlt?: string;
  heading: string;
  subheading: string;
};

export type HeroData = {
  slides: HeroSlideData[];
  certifications?: { line1: string; line2: string }[];
  ctaLabel?: string;
};

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

export default function Hero({
  data,
  href = "#",
}: {
  data: HeroData;
  href?: string;
}) {
  const slides = data.slides;
  const certifications = data.certifications ?? [];
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const restartAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const goTo = (index: number) => {
    setActive(((index % slides.length) + slides.length) % slides.length);
    restartAutoplay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(active + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  const current = slides[active];
  const headingLines = current.heading.split("\n");

  return (
    <section
      className="relative flex min-h-dvh flex-col overflow-hidden bg-neutral-950 px-5 pb-10 pt-20 text-white sm:px-[45px] sm:pb-8 sm:pt-24 lg:h-[90vh] lg:min-h-[720px]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-parallax-bg absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== active}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt ?? ""}
              fill
              priority={i === 0}
              quality={65}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/35 to-transparent" />
      {/* Extra darkening under the certifications/nav row, so it stays
          legible over a busy part of the photo regardless of slide. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-black mix-blend-multiply" />

      <div className="relative z-10 flex max-w-full flex-1 flex-col justify-center gap-5 sm:max-w-[85%]">
        <h1
          className="hero-fade-up font-heading font-black leading-[0.95] tracking-tight text-[#eaefef]"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 7rem)" }}
        >
          {headingLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headingLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p
          className="hero-fade-up max-w-2xl text-lg font-light text-[#c1c7c7] sm:text-2xl"
          style={{ animationDelay: "0.15s" }}
        >
          {current.subheading}
        </p>
        <a
          href={href}
          className="hero-fade-up inline-flex w-fit items-center justify-center rounded-md bg-accent-hover px-6 py-[19px] text-center text-xl font-medium tracking-[0.5px] text-white transition hover:bg-accent"
          style={{ animationDelay: "0.25s" }}
        >
          {data.ctaLabel ?? "Explore our work"}
        </a>
      </div>

      <div
        className="hero-fade-up relative z-10 mt-4 flex flex-col items-stretch gap-8 pt-6 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6"
        style={{ animationDelay: "0.4s" }}
      >
        {/* Mobile: equal-width badge chips, so certifications with
            different text lengths still line up cleanly in a row. */}
        <div className="grid grid-cols-3 gap-2 sm:hidden">
          {certifications.map((cert) => (
            <div
              key={cert.line2}
              className="flex flex-col items-center justify-center gap-1 rounded-md border border-accent/40 bg-white/[0.03] px-2 py-3 text-center"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                {cert.line1}
              </span>
              <span className="text-[11px] leading-tight text-[#c1c7c7]">
                {cert.line2}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop / tablet: icon-over-text badges, connected by thin
            vertical dividers. */}
        <div className="hidden sm:flex sm:items-center sm:gap-[30px]">
          {certifications.map((cert, i) => (
            <div key={cert.line2} className="flex items-center gap-[30px]">
              {i > 0 && <span className="h-24 w-px shrink-0 bg-white/15" />}
              <div className="flex w-[150px] flex-col items-start gap-[7px]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-accent">
                  <ArrowUpRight className="h-4 w-4 text-accent" />
                </span>
                <span className="text-2xl leading-[0.9] text-[#c1c7c7]">
                  {cert.line1}
                  <br />
                  {cert.line2}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Slide navigation — desktop only, bottom-right of the row.
            Mobile relies on autoplay + swipe. */}
        {slides.length > 1 && (
          <div className="hidden items-center gap-[50px] sm:flex">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(active - 1)}
              className="flex h-6 w-6 items-center justify-center text-[#c1c7c7] transition hover:text-accent"
            >
              <ArrowUpRight className="h-4 w-4 rotate-[-135deg]" />
            </button>
            <div className="flex items-center gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === active ? "bg-accent" : "bg-[#777b7b] hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(active + 1)}
              className="flex h-6 w-6 items-center justify-center text-[#c1c7c7] transition hover:text-accent"
            >
              <ArrowUpRight className="h-4 w-4 -scale-y-100 rotate-[-45deg]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
