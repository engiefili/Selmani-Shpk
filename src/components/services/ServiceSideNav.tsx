const SECTIONS_EN = [
  { id: "hot-dip-galvanizing", label: "Hot Dip Galvanizing" },
  { id: "metal-constructions", label: "Metal Constructions" },
  { id: "tanks-containers", label: "Tanks & Containers" },
];

const SECTIONS_SQ = [
  { id: "hot-dip-galvanizing", label: "Zinkim në të Nxehtë" },
  { id: "metal-constructions", label: "Konstruksione Metalike" },
  { id: "tanks-containers", label: "Depozita & Kontenier" },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 7l10 10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 10V17H10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ServiceSideNavMobile({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  const SECTIONS = locale === "sq" ? SECTIONS_SQ : SECTIONS_EN;

  return (
    <nav className="flex w-full flex-col items-start gap-2.5 lg:hidden">
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="inline-flex items-center gap-2.5 rounded-full border border-[#c1c7c7]/80 bg-black/25 py-2 pl-4 pr-2 text-sm font-light text-[#eaefef] backdrop-blur-sm transition hover:border-accent hover:text-accent"
        >
          {section.label}
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current p-1">
            <ArrowIcon />
          </span>
        </a>
      ))}
    </nav>
  );
}

export function ServiceSideNavDesktop({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  const SECTIONS = locale === "sq" ? SECTIONS_SQ : SECTIONS_EN;

  return (
    <nav className="hidden w-full max-w-[min(640px,90vw)] flex-col items-end lg:flex">
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="flex w-fit items-center gap-8 whitespace-nowrap border-b border-[#c1c7c7] py-4 text-right font-light leading-none text-[#eaefef] transition"
          style={{
            fontSize: "clamp(1.1rem, 1.7vw, 32px)",
          }}
        >
          {section.label}
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-current p-3 text-lg transition">
            <ArrowIcon />
          </span>
        </a>
      ))}
    </nav>
  );
}

export default function ServiceSideNav({
  locale = "en",
}: {
  locale?: "en" | "sq";
} = {}) {
  return (
    <>
      <ServiceSideNavMobile locale={locale} />
      <ServiceSideNavDesktop locale={locale} />
    </>
  );
}
