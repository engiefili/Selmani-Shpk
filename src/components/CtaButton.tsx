export default function CtaButton({
  label,
  type = "button",
  onClick,
  href,
  className = "",
}: {
  label: string;
  type?: "button" | "submit";
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const pillClass =
    "inline-flex h-full flex-1 items-center justify-center rounded-md bg-accent px-6 text-base font-medium tracking-[0.5px] text-white transition duration-200 hover:bg-accent-hover active:scale-[0.97]";
  const squareClass =
    "flex h-full w-[58px] shrink-0 items-center justify-center rounded-md bg-accent text-lg text-white transition duration-200 hover:bg-accent-hover active:scale-[0.97]";

  const content = href ? (
    <>
      <a href={href} className={pillClass}>
        {label}
      </a>
      <a href={href} aria-hidden="true" tabIndex={-1} className={squareClass}>
        ↗
      </a>
    </>
  ) : (
    <>
      <button type={type} onClick={onClick} className={pillClass}>
        {label}
      </button>
      <button
        type={type}
        onClick={onClick}
        aria-hidden="true"
        tabIndex={-1}
        className={squareClass}
      >
        ↗
      </button>
    </>
  );

  return (
    <div className={`inline-flex h-[58px] items-stretch gap-1 ${className}`}>
      {content}
    </div>
  );
}
