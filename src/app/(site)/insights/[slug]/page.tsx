import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CtaButton from "@/components/CtaButton";
import ArrowUpRight from "@/components/icons/ArrowUpRight";
import ArticleBody from "@/components/insights/ArticleBody";
import InsightCard from "@/components/insights/InsightCard";
import Reveal from "@/components/Reveal";
import { formatDate, readMinutes, toCardData, tocFromBody } from "@/lib/insights";
import { insightsCopy } from "@/lib/insightsCopy";
import { getLocale, localizePath } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { insightBySlugQuery } from "@/sanity/lib/queries";
import type { InsightDoc } from "@/sanity/lib/types";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const doc = await sanityFetch<InsightDoc | null>(insightBySlugQuery, { slug });
  if (!doc) return {};
  const meta = pageMetadata({
    path: `/insights/${slug}`,
    locale,
    title: doc.seoTitle || doc.title,
    description: doc.metaDescription || doc.excerpt,
  });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: doc.publishedAt,
      modifiedTime: doc.updatedAt ?? doc.publishedAt,
      images: [urlForImage(doc.coverImage).width(1200).height(630).fit("crop").url()],
    },
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = insightsCopy[locale];
  const doc = await sanityFetch<InsightDoc | null>(insightBySlugQuery, { slug });
  if (!doc) notFound();

  const minutes = readMinutes(doc.body);
  const toc = tocFromBody(doc.body);
  const updated = doc.updatedAt ?? doc.publishedAt;
  const cover = urlForImage(doc.coverImage).width(2000).quality(85).url();
  const related = (doc.related ?? []).filter(Boolean);
  const rfqHref = localizePath("/contact", locale);
  const insightsHref = localizePath("/insights", locale);
  const articleUrl = `${SITE_URL}${localizePath(`/insights/${doc.slug}`, locale)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: doc.seoTitle || doc.title,
      description: doc.metaDescription || doc.excerpt,
      image: urlForImage(doc.coverImage).width(1200).url(),
      datePublished: doc.publishedAt,
      dateModified: updated,
      author: { "@type": "Organization", name: "Selmani Steel Technical Team" },
      publisher: { "@type": "Organization", name: "Selmani Steel", url: SITE_URL },
      mainEntityOfPage: articleUrl,
      keywords: doc.keywords?.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}${localizePath("/", locale)}` },
        { "@type": "ListItem", position: 2, name: t.breadcrumbRoot, item: `${SITE_URL}${insightsHref}` },
        { "@type": "ListItem", position: 3, name: doc.title, item: articleUrl },
      ],
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-1 flex-col bg-neutral-950 text-white">
        {/* Article header */}
        <section className="px-5 pb-10 pt-32 sm:px-[45px] sm:pb-14 sm:pt-44">
          <div className="mx-auto flex w-full flex-col gap-8">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#9ba0a0]">
              <Link href={insightsHref} className="transition-colors hover:text-white">
                {t.breadcrumbRoot}
              </Link>
              <span className="text-[#555858]">/</span>
              <span className="uppercase tracking-[0.16em] text-accent">{doc.category}</span>
            </nav>

            <h1
              className="max-w-[1100px] font-heading font-bold leading-[1.02] tracking-tight text-[#eaefef]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 5rem)" }}
            >
              {doc.title}
            </h1>

            <p className="max-w-3xl text-lg font-light leading-snug text-[#c1c7c7] sm:text-2xl">
              {doc.excerpt}
            </p>

            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm text-[#9ba0a0]">
              <span className="text-[#eaefef]">{t.reviewedBy}</span>
              <span className="hidden h-3 w-px bg-white/20 sm:block" />
              <span>
                {t.updated} {formatDate(updated, locale)}
              </span>
              <span className="hidden h-3 w-px bg-white/20 sm:block" />
              <span>
                {minutes} {t.minRead}
              </span>
            </p>
          </div>
        </section>

        {/* Cover photo */}
        <div className="px-5 sm:px-[45px]">
          <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-900 sm:aspect-[21/9]">
            <Image
              src={cover}
              alt={doc.coverImageAlt ?? ""}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Body + sticky side column */}
        <section className="px-5 py-14 sm:px-[45px] sm:py-20">
          <div className="mx-auto grid w-full gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-10">
                {toc.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#777b7b]">
                      {t.inThisArticle}
                    </p>
                    <ol className="flex flex-col gap-3 border-l border-white/10">
                      {toc.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className={`-ml-px block border-l border-transparent leading-snug transition-colors hover:border-accent hover:text-white ${
                              h.level === 3
                                ? "pl-8 text-[13.5px] text-[#777b7b]"
                                : "pl-4 text-[15px] text-[#9ba0a0]"
                            }`}
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                  <p className="text-lg font-light leading-snug text-[#eaefef]">{t.sidebarCta}</p>
                  <CtaButton label={t.rfq} href={rfqHref} className="w-full" />
                </div>
              </div>
            </aside>

            <article className="min-w-0 max-w-[760px]">
              {doc.diagram && (
                <figure className="relative mb-12 aspect-[2.35/1] overflow-hidden rounded-xl bg-[#f6f7f9]">
                  {/* The supplied diagrams leave the lower third empty;
                      anchoring to the top crops that dead space. */}
                  <Image
                    src={urlForImage(doc.diagram).width(1600).url()}
                    alt={doc.diagramAlt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 760px, 100vw"
                    className="object-cover object-top"
                  />
                </figure>
              )}
              <ArticleBody value={doc.body} />
              {locale === "sq" && (
                <p className="mt-10 border-t border-white/10 pt-6 text-sm text-[#777b7b]">
                  {t.englishOnly}
                </p>
              )}
            </article>
          </div>
        </section>

        {/* Contextual service links */}
        <section className="px-5 pb-16 sm:px-[45px] sm:pb-24">
          <div className="mx-auto flex w-full flex-col gap-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#777b7b]">
              {t.relatedServices}
            </p>
            <div className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {t.services.map((s) => (
                <Link
                  key={s.href}
                  href={localizePath(s.href, locale)}
                  className="group flex items-center justify-between gap-4 border-b border-white/10 py-5 text-lg text-[#eaefef] transition-colors hover:text-accent sm:pr-8"
                >
                  {s.label}
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#777b7b] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Persistent RFQ call-to-action */}
        <section className="px-5 pb-16 sm:px-[45px] sm:pb-24">
          <Reveal className="mx-auto flex w-full flex-col gap-8 rounded-2xl bg-neutral-900 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-14 sm:py-14">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2
                className="font-light leading-tight text-[#eaefef]"
                style={{ fontSize: "clamp(1.75rem, 3vw, 40px)" }}
              >
                {t.ctaTitle}
              </h2>
              <p className="text-base font-light leading-relaxed text-[#9ba0a0] sm:text-lg">
                {t.ctaText}
              </p>
            </div>
            <CtaButton label={t.rfq} href={rfqHref} className="w-full shrink-0 sm:w-auto" />
          </Reveal>
        </section>

        {/* Related reading */}
        {related.length > 0 && (
          <section className="border-t border-white/10 px-5 py-16 sm:px-[45px] sm:py-24">
            <div className="mx-auto flex w-full flex-col gap-10">
              <h2 className="text-3xl font-light tracking-tight text-[#eaefef] sm:text-4xl">
                {t.relatedReading}
              </h2>
              <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <InsightCard key={r.slug} item={toCardData(r, locale)} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
