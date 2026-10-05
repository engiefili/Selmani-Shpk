"use client";

import { useMemo, useState } from "react";

import type { Locale } from "@/lib/locale";
import { insightsCopy } from "@/lib/insightsCopy";
import InsightCard, { type InsightCardData } from "./InsightCard";

// The filter is purely a client-side view over the already-fetched list —
// no extra requests. "All" shows the first article large, the rest in a
// two-column grid; a category filter just shows its matches in the grid.
export default function InsightsIndex({
  items,
  locale,
}: {
  items: InsightCardData[];
  locale: Locale;
}) {
  const t = insightsCopy[locale];
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((i) => counts.set(i.category, (counts.get(i.category) ?? 0) + 1));
    return [...counts.entries()];
  }, [items]);

  const visible = category ? items.filter((i) => i.category === category) : items;
  const [lead, ...rest] = visible;
  const showLead = !category && lead;
  const grid = showLead ? rest : visible;

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* Text-only filter: active item gets an accent underline, nothing
          is boxed — same minimalist language as the header. */}
      <div
        role="tablist"
        aria-label="Categories"
        className="flex gap-x-8 overflow-x-auto whitespace-nowrap border-b border-white/10 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:gap-y-3 [&::-webkit-scrollbar]:hidden"
      >
        {[{ label: t.all, value: null as string | null, count: items.length }, ...categories.map(([c, n]) => ({ label: c, value: c as string | null, count: n }))].map(
          (opt) => {
            const active = category === opt.value;
            return (
              <button
                key={opt.label}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={`relative -mb-[17px] pb-4 text-[15px] tracking-wide transition-colors ${
                  active ? "text-white" : "text-[#9ba0a0] hover:text-white"
                }`}
              >
                {opt.label}
                <sup className="ml-1 text-[10px] text-[#777b7b]">{opt.count}</sup>
                <span
                  className={`absolute inset-x-0 bottom-0 h-px bg-accent transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          }
        )}
      </div>

      {showLead && (
        <InsightCard item={lead} index={1} locale={locale} size="lg" />
      )}

      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {grid.map((item, i) => (
          <InsightCard
            key={item.slug}
            item={item}
            index={showLead ? i + 2 : i + 1}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
