import Image from "next/image";
import Eyebrow from "./Eyebrow";

export type AboutUsData = {
  eyebrow?: string;
  text: string;
  image: string;
  imageAlt?: string;
};

export default function AboutUs({ data }: { data: AboutUsData }) {
  return (
    <section
      id="about"
      className="bg-neutral-950 px-5 py-10 text-white sm:px-10 sm:py-16"
    >
      <div className="mx-auto grid w-full max-w-[1800px] gap-6 sm:gap-8 lg:grid-cols-[5fr_2fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <Eyebrow>{data.eyebrow ?? "About Us"}</Eyebrow>
          <p
            className="max-w-none font-medium leading-snug text-[#c1c7c7]"
            style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
          >
            {data.text}
          </p>
        </div>

        <div className="relative hidden aspect-square w-full overflow-hidden rounded-full sm:block sm:max-w-sm sm:justify-self-end">
          <Image
            src={data.image}
            alt={data.imageAlt ?? ""}
            fill
            sizes="384px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
