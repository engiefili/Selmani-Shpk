import Image from "next/image";
import { LinkList } from "@/components/services/FeatureGrid";

function Applications({
  items,
  locale,
}: {
  items: string[];
  locale: "en" | "sq";
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-light text-[#eaefef]">
        {locale === "sq"
          ? "Aplikimet e zakonshme përfshijnë:"
          : "Typical applications include:"}
      </p>
      <LinkList items={items} />
    </div>
  );
}

function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="inline-flex items-center gap-2 text-xl font-light tracking-wide text-accent">
        <span className="h-2 w-2 rounded-full bg-accent" />
        {eyebrow}
      </span>
      <h2
        className="font-bold leading-tight text-[#eaefef]"
        style={{ fontSize: "clamp(2rem, 4vw, 56px)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-xl font-light leading-snug text-[#c1c7c7]">
          {description}
        </p>
      )}
    </div>
  );
}

export default function IndustrySection({
  id,
  eyebrow = "Industries",
  title,
  description,
  applications,
  closing,
  image,
  imageAlt,
  imagePosition = "right",
  locale = "en",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  applications: string[];
  closing?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  locale?: "en" | "sq";
}) {
  // Image always renders first on mobile — visual context before the
  // reading detail — regardless of which side it sits on at desktop
  // width, where imagePosition controls left/right placement instead.
  const imageOrderClass = imagePosition === "left" ? "" : "order-1 lg:order-2";
  const textOrderClass = imagePosition === "left" ? "" : "order-2 lg:order-1";

  const imageBlock = image ? (
    <div
      className={`relative min-h-[320px] overflow-hidden rounded-xl bg-neutral-800 lg:h-full ${imageOrderClass}`}
    >
      <Image
        src={image}
        alt={imageAlt ?? ""}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
    </div>
  ) : null;

  // With an image: one column is the photo, the other holds
  // heading -> applications -> optional closing paragraph, in that order.
  if (image) {
    const textBlock = (
      <div className={`flex flex-col gap-8 ${textOrderClass}`}>
        <Heading eyebrow={eyebrow} title={title} description={description} />
        <Applications items={applications} locale={locale} />
        {closing && (
          <p className="max-w-xl text-xl font-light leading-snug text-[#c1c7c7]">
            {closing}
          </p>
        )}
      </div>
    );

    return (
      <section
        id={id}
        className="scroll-mt-4 bg-neutral-950 px-5 py-12 text-white sm:px-10"
      >
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 items-stretch gap-x-16 gap-y-8 lg:grid-cols-2">
          {imagePosition === "left" ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      </section>
    );
  }

  // No image: heading on one side, applications list on the other.
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-neutral-950 px-5 py-12 text-white sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 items-start gap-x-16 gap-y-8 lg:grid-cols-2">
        <Heading eyebrow={eyebrow} title={title} description={description} />
        <div className="lg:pt-[92px]">
          <Applications items={applications} locale={locale} />
        </div>
      </div>
    </section>
  );
}
