import Image from "next/image";
import Link from "next/link";

import ArrowUpRight from "@/components/icons/ArrowUpRight";
import type { Locale } from "@/lib/locale";
import { insightsCopy } from "@/lib/insightsCopy";

export type InsightCardData = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  minutes?: number;
  date: string;
  href: string;
};

// Editorial card: big image, a small index number over it, then category ·
// read-time, title, excerpt. No box/border around the text — the image is
// the only framed element, which keeps the grid light.
export default function InsightCard({
  item,
  index,
  locale,
  size = "md",
}: {
  item: InsightCardData;
  index?: number;
  locale: Locale;
  size?: "md" | "lg";
}) {
  const t = insightsCopy[locale];
  return (
    <Link
      href={item.href}
      className={`group flex flex-col gap-5 ${
        size === "lg" ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-14" : ""
      }`}
    >
      <div
        className={`relative aspect-[3/2] overflow-hidden rounded-xl bg-neutral-900 ${
          size === "lg" ? "lg:col-span-7" : ""
        }`}
      >
        <Image
          src={item.image}
          alt={item.imageAlt ?? ""}
          fill
          sizes={size === "lg" ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 640px) 46vw, 100vw"}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {index !== undefined && (
          <span className="absolute left-5 top-5 text-sm font-medium tracking-[0.2em] text-white/80">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className={`flex flex-col gap-3 ${size === "lg" ? "lg:col-span-5 lg:gap-5" : ""}`}>
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">
          <span>{item.category}</span>
          {item.minutes && (
            <>
              <span className="h-px w-5 bg-white/25" />
              <span className="text-[#9ba0a0]">
                {item.minutes} {t.minRead}
              </span>
            </>
          )}
        </p>
        <h3
          className={`font-normal leading-[1.1] tracking-tight text-[#eaefef] transition-colors group-hover:text-white ${
            size === "lg" ? "text-3xl sm:text-4xl lg:text-[44px]" : "text-2xl sm:text-[28px]"
          }`}
        >
          {item.title}
        </h3>
        <p className="max-w-xl text-base font-light leading-relaxed text-[#9ba0a0]">
          {item.excerpt}
        </p>
        <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#eaefef] transition-colors group-hover:text-accent">
          {t.readArticle}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
