export type PageNavSection = {
  id: string;
  label: string;
};

export default function PageSideNav({
  sections,
}: {
  sections: PageNavSection[];
}) {
  return (
    <nav className="hidden w-full max-w-[min(920px,90vw)] flex-col items-end lg:flex">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="flex w-fit items-center gap-8 whitespace-nowrap border-b border-[#c1c7c7] py-4 text-right font-light leading-none text-[#eaefef] transition"
          style={{
            fontSize: "clamp(1.5rem, 2.4vw, 44px)",
          }}
        >
          {section.label}
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-current text-lg transition">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 7l10 10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M17 10V17H10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </a>
      ))}
    </nav>
  );
}
