import Image from "next/image";
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
        <div className="border-t border-[#e6e6e6]/35 pt-6">
          <h3
            className="font-light leading-none text-[#c1c7c7]"
            style={{ fontSize: "44px" }}
          >
            {locale === "sq" ? "Punime të Përzgjedhura" : "Selected Work"}
          </h3>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((src, i) => (
            <div
              key={src}
              // Below lg the grid is 2-3 columns, so a 5th (or later) image
              // leaves an orphaned row; only the 5-column desktop layout
              // has room for the full set.
              className={`relative aspect-[358/442] overflow-hidden rounded-xl bg-[#1c1e1e] ${
                i >= 4 ? "hidden lg:block" : ""
              }`}
            >
              <Image
                src={src}
                alt={`Selected work ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:justify-end">
          <CtaButton
            label={locale === "sq" ? "Shiko të gjitha" : "See All"}
            href={href}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
