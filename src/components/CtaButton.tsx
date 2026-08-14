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
    "inline-flex h-full flex-1 items-center justify-center rounded-md bg-accent px-6 text-base font-medium tracking-[0.5px] text-white transition hover:bg-accent-hover";
  const squareClass =
    "flex h-full w-[58px] shrink-0 items-center justify-center rounded-md bg-accent text-lg transition hover:bg-accent-hover";

  if (href) {
    return (
      <div className={`inline-flex h-[58px] items-stretch gap-1 ${className}`}>
        <a href={href} className={pillClass}>
          {label}
        </a>
        <a href={href} aria-hidden="true" tabIndex={-1} className={squareClass}>
          ↗
        </a>
      </div>
    );
  }

  return (
    <div className={`inline-flex h-[58px] items-stretch gap-1 ${className}`}>
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
    </div>
  );
}
