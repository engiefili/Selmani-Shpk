import CtaButton from "../CtaButton";

export default function SelectedWork({
  images,
  locale = "en",
  href = "#",
}: {
  images: string[];
  locale?: "en" | "sq";
  href?: string;
}) {
  return (
    <section className="bg-neutral-950 px-5 pb-16 pt-10 text-white sm:px-10">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[#e6e6e6]/35 pt-6">
          <h3
            className="font-light leading-none text-[#c1c7c7]"
            style={{ fontSize: "44px" }}
          >
            {locale === "sq" ? "Punime të Përzgjedhura" : "Selected Work"}
          </h3>
          <CtaButton
            label={locale === "sq" ? "Shiko të gjitha" : "See All"}
            href={href}
            className="w-full max-w-md"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[358/442] overflow-hidden rounded-xl bg-[#1c1e1e]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Selected work ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
