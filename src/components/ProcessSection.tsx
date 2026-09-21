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

export default function ProcessSection({ data }: { data: ProcessSectionData }) {
  return (
    <section className="bg-neutral-950 px-5 py-8 text-white sm:px-[45px] sm:py-10">
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
              {data.description}
            </p>
          </div>
        </Reveal>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[49px] hidden h-px bg-white/15 lg:block"
          />
          <div className="relative grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-[90px] lg:gap-y-0">
            {data.steps.map((step, i) => (
              <Reveal
                key={step.title}
                delay={Math.min(i * 60, 240)}
                className="flex flex-col gap-[22px]"
              >
                <span className="text-2xl leading-[0.9] text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                <p className="text-2xl leading-[0.9] text-white">{step.title}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
