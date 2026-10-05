import type { PortableTextBlock } from "sanity";

import type { Locale } from "@/lib/locale";
import { localizePath } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/image";
import type { InsightCardDoc } from "@/sanity/lib/types";

// Plain text of a Portable Text body — used for read-time and anchors.
export function blockText(block: unknown): string {
  const children = (block as { children?: { text?: string }[] }).children ?? [];
  return children.map((c) => c.text ?? "").join("");
}

export function readMinutes(body: PortableTextBlock[]): number {
  const words = body
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function tocFromBody(body: PortableTextBlock[]) {
  return body
    .filter((b) => ["h2", "h3"].includes((b as { style?: string }).style ?? ""))
    .map((b) => {
      const text = blockText(b);
      return { id: slugify(text), text, level: (b as { style?: string }).style === "h3" ? 3 : 2 };
    });
}

export function formatDate(iso: string, locale: Locale): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
    locale === "sq" ? "sq-AL" : "en-GB",
    { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }
  );
}



export function toCardData(doc: InsightCardDoc, locale: Locale, minutes?: number) {
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    excerpt: doc.excerpt,
    image: urlForImage(doc.coverImage).width(1400).quality(85).url(),
    imageAlt: doc.coverImageAlt,
    minutes,
    date: doc.publishedAt,
    href: localizePath(`/insights/${doc.slug}`, locale),
  };
}
