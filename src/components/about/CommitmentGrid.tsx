import Image from "next/image";

export type CommitmentGridData = {
  heading?: string;
  intro: string;
  commitments: { label: string; icon?: string }[];
};

export default function CommitmentGrid({ data }: { data: CommitmentGridData }) {
  return (
    <section className="bg-neutral-950 px-5 py-10 text-white sm:px-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2
          className="font-light tracking-tight text-[#eaefef]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
        >
          {data.heading ?? "Our Commitment to Clients"}
        </h2>
        <p className="mt-4 text-lg font-light text-[#eaefef] sm:mt-6">{data.intro}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {data.commitments.map((item) => (
            <div key={item.label} className="flex flex-col gap-3.5">
              <div className="relative flex h-[130px] items-center justify-center rounded-lg bg-accent p-6 sm:h-[190px] sm:p-10">
                {item.icon && (
                  <Image
                    src={item.icon}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                    className="object-contain p-6 sm:p-10"
                  />
                )}
              </div>
              <p className="text-sm font-light uppercase leading-snug text-[#c1c7c7] sm:text-lg">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
