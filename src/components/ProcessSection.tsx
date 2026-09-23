import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

export type ProcessStepData = {
  title: string;
};

export type ProcessSectionData = {
  eyebrow?: string;
  title: string;
  description: string;
  steps: ProcessStepData[];
};

// Renders a string as its own lines wherever it contains "\n", so content
// authors control exactly where text wraps (matching the design's fixed
// two-line treatment) instead of leaving it to the browser.
function renderLines(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

export default function ProcessSection({ data }: { data: ProcessSectionData }) {
  return (
    <section className="bg-neutral-950 px-5 py-16 text-white sm:px-[45px] sm:py-24">
      <div className="mx-auto flex w-full flex-col gap-10 sm:gap-[53px]">
        <Reveal className="flex flex-col gap-2">
          <Eyebrow>{data.eyebrow ?? "Integrated Production"}</Eyebrow>
          <div className="flex flex-col gap-5">
            <h2
              className="font-light leading-none tracking-tight text-[#eaefef]"
              style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
            >
              {data.title}
            </h2>
            <p className="max-w-[1360px] text-2xl leading-[0.9] text-[#9ba0a0]">
              {renderLines(data.description)}
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[49px] hidden h-px bg-white/15 lg:block"
          />
          {/* Below lg: a 2-column card grid — each step is a numbered
              circle + title (the same "numbered list item" language as the
              Hot Dip benefits / Tanks list above), with a divider between
              the 3 rows so it still reads as one sequence, not a scattered
              grid of facts. lg+: the original connected timeline. */}
          <div className="relative grid grid-cols-2 gap-x-8 gap-y-0 lg:grid-cols-6 lg:gap-x-[90px]">
            {data.steps.map((step, i) => (
              <Reveal
                key={step.title}
                delay={Math.min(i * 60, 240)}
                className={`flex items-center gap-4 pb-6 lg:flex-col lg:items-start lg:gap-[22px] lg:pb-0 ${
                  i >= 2 ? "border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0" : ""
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 text-base font-semibold text-white lg:hidden">
                  {i + 1}
                </span>
                <span className="hidden text-2xl leading-[0.9] text-white/50 lg:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="hidden h-2.5 w-2.5 rounded-full bg-white lg:block" />
                <p className="text-lg leading-tight text-white lg:text-2xl lg:leading-[0.9]">
                  {renderLines(step.title)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
