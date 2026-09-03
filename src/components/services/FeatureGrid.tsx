import Image from "next/image";
import type { LucideIcon } from "lucide-react";

export type FeatureItem = {
  label: string;
  icon?: LucideIcon;
  image?: string;
};

export function FeatureGrid({ items }: { items: FeatureItem[] }) {
  const rows: FeatureItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-1 gap-x-10 gap-y-4 border-b border-[#e6e6e6]/15 py-4 sm:grid-cols-2"
        >
          {row.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-6">
                {item.image ? (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                    <Image
                      src={item.image}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#e6e6e6]/35">
                    {Icon && (
                      <Icon
                        className="h-6 w-6 text-white"
                        strokeWidth={1.5}
                        absoluteStrokeWidth
                      />
                    )}
                  </div>
                )}
                <p className="text-xl font-light leading-[1.1] text-[#c1c7c7]">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function LinkList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col">
      {items.map((label) => (
        <div
          key={label}
          className="flex items-center gap-3 border-t border-[#e6e6e6]/15 py-2.5 first:border-t-0"
        >
          <Image
            src="/icons/list-arrow.png"
            alt=""
            width={48}
            height={48}
            className="h-4 w-4 shrink-0 object-contain"
          />
          <p className="text-xl font-light text-[#c1c7c7]">{label}</p>
        </div>
      ))}
    </div>
  );
}
