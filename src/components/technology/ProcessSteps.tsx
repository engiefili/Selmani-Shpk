import type { LucideIcon } from "lucide-react";

export type ProcessStep = {
  label: string;
  icon: LucideIcon;
};

export default function ProcessSteps({
  steps,
  pdfLabel = "PDF Technical Doc",
}: {
  steps: ProcessStep[];
  pdfLabel?: string;
}) {
  return (
    <div className="mt-3 flex flex-col rounded-xl bg-[#171919] p-8 lg:p-10">
      <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex flex-col gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e6e6e6]/35">
                <Icon
                  className="h-6 w-6 text-white"
                  strokeWidth={1}
                  absoluteStrokeWidth
                />
              </div>
              <p className="border-t border-[#e6e6e6]/15 pt-4 text-xl font-light text-[#c1c7c7]">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 inline-flex h-[58px] w-fit items-stretch gap-2">
        <a
          href="#"
          className="inline-flex h-full min-w-[280px] items-center justify-center rounded-md border border-[#e6e6e6]/45 px-6 text-sm text-[#e6e6e6] transition hover:border-accent hover:text-accent"
        >
          {pdfLabel}
        </a>
        <a
          href="#"
          aria-label={pdfLabel}
          className="flex h-full w-[58px] shrink-0 items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/download.png" alt="" className="h-full w-full object-contain" />
        </a>
      </div>
    </div>
  );
}
