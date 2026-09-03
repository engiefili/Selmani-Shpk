import Image from "next/image";
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
    <div className="mt-3 flex flex-col rounded-xl bg-[#171919] p-6 sm:p-8 lg:p-10">
      {/* Below sm: an 8-item icon grid doesn't read as a sequence, so this
          renders as a connected vertical stepper instead — numbered,
          top-to-bottom, one step at a time. */}
      <div className="flex flex-col sm:hidden">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === steps.length - 1;
          return (
            <div key={`${i}-${step.label}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent text-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.5} absoluteStrokeWidth />
                </div>
                {!isLast && <div className="w-px flex-1 bg-[#e6e6e6]/20" />}
              </div>
              <div className={isLast ? "pb-0.5 pt-2" : "pb-7 pt-2"}>
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  Step {i + 1}
                </p>
                <p className="mt-1 text-lg font-light leading-snug text-[#c1c7c7]">
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden grid-cols-2 gap-x-8 gap-y-8 sm:grid sm:grid-cols-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={`${i}-${step.label}`} className="flex flex-col gap-4">
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
          <Image
            src="/icons/download.png"
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-contain"
          />
        </a>
      </div>
    </div>
  );
}
