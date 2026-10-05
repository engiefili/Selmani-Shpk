import type { Metadata } from "next";

import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Eyebrow from "@/components/Eyebrow";
import InsightsIndex from "@/components/insights/InsightsIndex";
import Reveal from "@/components/Reveal";
import { toCardData } from "@/lib/insights";
import { insightsCopy } from "@/lib/insightsCopy";
import { getLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { insightsListQuery } from "@/sanity/lib/queries";
import type { InsightCardDoc } from "@/sanity/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = insightsCopy[locale];
  return pageMetadata({
    path: "/insights",
    locale,
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function InsightsPage() {
  const locale = await getLocale();
  const t = insightsCopy[locale];
  const docs = await sanityFetch<InsightCardDoc[]>(insightsListQuery);
  const items = docs.map((d) => toCardData(d, locale));

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden bg-neutral-950 px-5 pb-16 pt-36 text-white sm:px-[45px] sm:pb-24 sm:pt-52">
          {/* Faint blueprint grid, fading out toward the bottom — a quiet
              nod to technical drawings without competing with the type. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          />
          <div className="relative mx-auto flex w-full flex-col gap-16 sm:gap-24">
            <Reveal className="flex flex-col gap-6">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1
                className="font-heading font-black leading-[0.95] tracking-tight text-[#eaefef]"
                style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)" }}
              >
                {t.title}
              </h1>
              <p className="max-w-2xl text-lg font-light leading-snug text-[#9ba0a0] sm:text-2xl">
                {t.intro}
              </p>
            </Reveal>

            {items.length > 0 ? (
              <InsightsIndex items={items} locale={locale} />
            ) : (
              <p className="text-lg text-[#9ba0a0]">{t.empty}</p>
            )}
          </div>
        </section>
        <CtaBand locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
