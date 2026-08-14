import CtaButton from "./CtaButton";
import Eyebrow from "./Eyebrow";

export type TanksShowcaseData = {
  eyebrow?: string;
  title: string;
  image: string;
  imageAlt?: string;
  tanks: { title: string; description: string }[];
  ctaLabel?: string;
};

export default function TanksShowcase({ data }: { data: TanksShowcaseData }) {
  return (
    <section id="industries" className="bg-neutral-950 px-5 py-4 sm:px-10">
      <div className="mx-auto w-full max-w-[1800px] overflow-hidden rounded-2xl bg-neutral-900 p-8 text-white sm:p-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-accent/70"
            style={{ boxShadow: "0 0 22px 2px rgba(1, 135, 148, 0.3)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt={data.imageAlt ?? ""}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <Eyebrow>{data.eyebrow ?? "Services"}</Eyebrow>
            <h2
              className="mt-3 font-light tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
            >
              {data.title}
            </h2>

            <ul className="mt-8">
              {data.tanks.map((tank, i) => (
                <li
                  key={tank.title}
                  className="flex items-start gap-5 border-t border-white/10 py-5 first:border-t-0"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
                      i === 0
                        ? "bg-accent text-white"
                        : "border border-[#9ba0a0] text-[#9ba0a0]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-white ${i === 0 ? "text-2xl" : "text-xl"}`}
                    >
                      {tank.title}
                    </h3>
                    <p className="mt-1 text-xl font-light text-[#9ba0a0]">
                      {tank.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <CtaButton
              label={data.ctaLabel ?? "Learn More"}
              className="mt-8 w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
