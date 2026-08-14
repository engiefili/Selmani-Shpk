export type ClientsGridData = {
  heading?: string;
  clients: string[];
};

export default function ClientsGrid({
  data,
  locale = "en",
}: {
  data: ClientsGridData;
  locale?: "en" | "sq";
}) {
  return (
    <section className="bg-neutral-950 px-5 py-14 text-white sm:px-10">
      <div className="mx-auto grid w-full max-w-[1800px] gap-10 lg:grid-cols-[1fr_2.5fr] lg:items-start">
        <h2
          className="font-light tracking-tight text-[#e6e6e6]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 72px)" }}
        >
          {data.heading ?? "Clients & Contractors"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.clients.map((title) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="flex min-h-[180px] items-center rounded-lg border border-white/15 p-6">
                <p className="text-left text-2xl font-semibold uppercase leading-snug">
                  {title}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-white/45">
                <span className="h-1 w-1 rounded-full bg-white/45" />
                {locale === "sq" ? "Klient" : "Client"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
