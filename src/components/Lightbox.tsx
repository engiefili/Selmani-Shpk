"use client";

import { useCallback, useEffect, useState } from "react";

export type LightboxImage = { src: string; alt: string; full?: string };

/** Open/close + prev/next state and keyboard handling for a Lightbox below. */
export function useLightbox(count: number) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i - 1 + count) % count));
  }, [count]);
  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % count));
  }, [count]);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, showPrev, showNext]);

  return { openIndex, setOpenIndex, close, showPrev, showNext };
}

/**
 * Full-screen image viewer with prev/next/close controls and a counter.
 * Pair with `useLightbox` for the open/close state — e.g.:
 *
 *   const { openIndex, setOpenIndex, close, showPrev, showNext } = useLightbox(images.length);
 *   ...
 *   <button onClick={() => setOpenIndex(i)}>...</button>
 *   ...
 *   <Lightbox images={images} openIndex={openIndex} onClose={close} onPrev={showPrev} onNext={showNext} />
 */
export function Lightbox({
  images,
  openIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: LightboxImage[];
  openIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const active = openIndex !== null ? images[openIndex] : null;
  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={active.alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#c1c7c7]/60 text-[#eaefef] transition hover:border-accent hover:text-accent sm:right-8 sm:top-8"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Previous image"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c1c7c7]/60 text-[#eaefef] transition hover:border-accent hover:text-accent sm:left-8"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next image"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c1c7c7]/60 text-[#eaefef] transition hover:border-accent hover:text-accent sm:right-8"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={active.full ?? active.src}
        alt={active.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain"
      />

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-light text-[#c1c7c7]"
        onClick={(e) => e.stopPropagation()}
      >
        {openIndex! + 1} / {images.length}
      </div>
    </div>
  );
}
