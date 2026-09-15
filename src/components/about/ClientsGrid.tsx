import Reveal from "../Reveal";

export type ClientsGridData = {
  heading?: string;
  clients: string[];
};

// Despite the name, `clients` here is really a list of the sectors/customer
// types Selmani serves (no actual client logos or names on file), so this
// renders as a clean numbered list — the same "accent circle + label"
// pattern used elsewhere on the site (HotDipGalvanizing, TanksShowcase) —
// rather than a grid of boxes sized for logos that don't exist.
export default function ClientsGrid({ data }: { data: ClientsGridData }) {
  return (
    <section className="bg-neutral-950 px-5 py-10 text-white sm:px-[45px] sm:py-14">
      <div className="mx-auto grid w-full max-w-[1800px] gap-8 sm:gap-10 lg:grid-cols-[1fr_2.5fr] lg:items-start">
        <Reveal as="div">
          <h2
            className="font-light tracking-tight text-[#e6e6e6]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
          >
            {data.heading ?? "Clients & Contractors"}
          </h2>
        </Reveal>

        <ul className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {data.clients.map((title, i) => (
            <Reveal
              as="li"
              key={title}
              delay={Math.min(i * 50, 300)}
              className="flex items-center gap-4 border-t border-white/10 py-5 first:border-t-0 sm:gap-5 sm:py-6 sm:[&:nth-child(-n+2)]:border-t-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/60 text-sm font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base font-medium uppercase leading-snug tracking-wide text-[#eaefef] sm:text-lg">
                {title}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
