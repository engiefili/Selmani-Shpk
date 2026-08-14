import CtaButton from "./CtaButton";
import Eyebrow from "./Eyebrow";

export type MetallicConstructionsData = {
  eyebrow?: string;
  title: string;
  services: { title: string; industries: string; icon?: string }[];
  description: string;
  ctaLabel?: string;
};

export default function MetallicConstructions({
  data,
}: {
  data: MetallicConstructionsData;
}) {
  return (
    <section
      id="services"
      className="bg-neutral-950 px-5 py-10 text-white sm:px-10"
    >
      <div className="mx-auto w-full max-w-[1800px]">
        <Eyebrow>{data.eyebrow ?? "Services"}</Eyebrow>
        <h2
          className="mt-3 font-light tracking-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
        >
          {data.title}
        </h2>

        <ul className="mt-10 grid gap-x-16 sm:grid-cols-2">
          {data.services.map((service) => (
            <li
              key={service.title}
              className="flex items-center gap-6 py-7"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                {service.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.icon}
                    alt=""
                    className="h-11 w-11 object-contain"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 flex items-baseline gap-3 border-t border-white/10 pt-3 text-sm text-[#777b7b]">
                  <span>Industries</span>
                  <span className="text-[#c1c7c7]">
                    {service.industries}
                  </span>
                </p>
              </div>
            </li>
          ))}

          <li className="flex items-center gap-6 py-7">
            <div className="h-14 w-14 shrink-0" aria-hidden="true" />
            <div className="flex flex-1 flex-col justify-center gap-4">
              <p className="max-w-md text-base text-white/50">
                {data.description}
              </p>
              <CtaButton
                label={data.ctaLabel ?? "Learn More"}
                className="w-full max-w-md"
              />
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
