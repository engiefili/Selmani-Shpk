"use client";

import { useState, type ReactNode } from "react";

export function AccordionGroup({
  title,
  titleClassName = "text-2xl font-normal leading-none text-[#eaefef] sm:text-[32px]",
  defaultOpen = false,
  open: openProp,
  onToggle,
  children,
}: {
  title: string;
  /** Override the title's text styling (defaults to the large accordion-panel look). */
  titleClassName?: string;
  defaultOpen?: boolean;
  /** Controlled open state. When provided (with onToggle), internal state is ignored. */
  open?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleClick = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setUncontrolledOpen((o) => !o);
    }
  };

  return (
    <div className="pb-6">
      <button
        onClick={handleClick}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 pb-4 text-left"
      >
        <p className={titleClassName}>{title}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#c1c7c7] text-lg font-medium text-[#171919]">
          {open ? "−" : "+"}
        </span>
      </button>
      <div className="border-t border-[#e6e6e6]/25" />
      {/* Grid-rows trick animates from 0fr to 1fr smoothly regardless of
          the content's actual height, without measuring anything in JS. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="pt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** Wraps a set of AccordionGroups so that opening one closes the others. */
export function ExclusiveAccordionGroup({
  items,
  defaultOpenIndex = 0,
  titleClassName,
}: {
  items: { title: string; content: ReactNode }[];
  defaultOpenIndex?: number | null;
  /** Override every item's title styling (defaults to the large accordion-panel look). */
  titleClassName?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <AccordionGroup
          key={item.title}
          title={item.title}
          titleClassName={titleClassName}
          open={openIndex === i}
          onToggle={() => setOpenIndex((current) => (current === i ? null : i))}
        >
          {item.content}
        </AccordionGroup>
      ))}
    </div>
  );
}
