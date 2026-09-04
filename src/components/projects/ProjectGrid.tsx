"use client";

import Image from "next/image";
import { Lightbox, useLightbox } from "../Lightbox";
import Reveal from "../Reveal";
import TiltCard from "../TiltCard";

export type ProjectImage = {
  src: string;
  full: string;
  alt: string;
};

export default function ProjectGrid({ images }: { images: ProjectImage[] }) {
  const { openIndex, setOpenIndex, close, showPrev, showNext } = useLightbox(images.length);

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        {images.map((img, i) => (
          <Reveal key={img.src} delay={Math.min((i % 10) * 40, 240)} y={16}>
            <TiltCard
              as="button"
              onClick={() => setOpenIndex(i)}
              aria-label={img.alt}
              className="group relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={images}
        openIndex={openIndex}
        onClose={close}
        onPrev={showPrev}
        onNext={showNext}
      />
    </>
  );
}
