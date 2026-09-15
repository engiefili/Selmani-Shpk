"use client";

import Image from "next/image";
import CtaButton from "../CtaButton";
import { Lightbox, useLightbox } from "../Lightbox";
import Reveal from "../Reveal";
import TiltCard from "../TiltCard";

export type SelectedWorkImage = { src: string; alt: string; full?: string };

export default function SelectedWork({
  images,
  locale = "en",
  href = "#",
}: {
  images: SelectedWorkImage[];
  locale?: "en" | "sq";
  href?: string;
}) {
  const { openIndex, setOpenIndex, close, showPrev, showNext } = useLightbox(images.length);

  return (
    <section className="bg-neutral-950 px-5 pb-16 pt-10 text-white sm:px-[45px]">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="border-t border-[#e6e6e6]/35 pt-6">
          <h3
            className="font-light leading-none text-[#c1c7c7]"
            style={{ fontSize: "44px" }}
          >
            {locale === "sq" ? "Punime të Përzgjedhura" : "Selected Work"}
          </h3>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {images.map(({ src, alt }, i) => (
            <Reveal
              key={src}
              delay={Math.min(i * 60, 240)}
              // Below lg the grid is 2-3 columns, so a 5th (or later) image
              // leaves an orphaned row; only the 5-column desktop layout
              // has room for the full set.
              className={i >= 4 ? "hidden lg:block" : ""}
            >
              <TiltCard
                as="button"
                onClick={() => setOpenIndex(i)}
                aria-label={alt}
                className="group relative aspect-[358/442] w-full overflow-hidden rounded-xl bg-[#1c1e1e]"
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:justify-end">
          <CtaButton
            label={locale === "sq" ? "Shiko të gjitha" : "See All"}
            href={href}
            className="w-full max-w-md"
          />
        </div>
      </div>

      <Lightbox
        images={images}
        openIndex={openIndex}
        onClose={close}
        onPrev={showPrev}
        onNext={showNext}
      />
    </section>
  );
}
