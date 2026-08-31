export type ValuesGridData = {
  values: { title: string; description: string; image?: string }[];
};

function ValueText({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-xl font-normal text-[#c1c7c7] sm:text-2xl">{title}</h3>
      <p className="mt-1 max-w-md text-base font-light leading-relaxed text-[#c1c7c7]">
        {description}
      </p>
    </div>
  );
}

export default function ValuesGrid({ data }: { data: ValuesGridData }) {
  const [performance, customer, durability] = data.values;

  return (
    <section className="bg-neutral-950 px-5 py-8 text-white sm:px-10 sm:py-10">
      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3 lg:items-stretch">
        {/* Left: caption above image */}
        <div className="flex flex-col gap-5 sm:gap-6">
          <ValueText title={performance.title} description={performance.description} />
          {performance.image && (
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={performance.image}
                alt="Performance-oriented facility"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Center: text only */}
        <div className="flex items-center justify-center px-4">
          <div className="max-w-sm">
            <ValueText title={customer.title} description={customer.description} />
          </div>
        </div>

        {/* Right: image above caption */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {durability.image && (
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={durability.image}
                alt="Durability-driven manufacturing"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <ValueText title={durability.title} description={durability.description} />
        </div>
      </div>
    </section>
  );
}
