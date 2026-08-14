"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type HeaderNavDropdownItem = { label: string; href: string };
export type HeaderNavLink = {
  label: string;
  href: string;
  dropdown?: HeaderNavDropdownItem[];
};

export type HeaderData = {
  logoUrl: string;
  homeHref: string;
  navLinks: HeaderNavLink[];
  contactHref: string;
  contactCtaLabel: string;
  switchHref: string;
  switchLabel: string;
};

export default function HeaderClient({ data }: { data: HeaderData }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between border-b border-[#9ba0a0]/40 bg-black px-5 py-[25px] sm:px-[45px]">
      <Link href={data.homeHref} className="flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.logoUrl} alt="Selmani" className="h-9 w-auto" />
      </Link>

      <nav className="hidden items-center gap-2.5 lg:flex">
        {data.navLinks.map((link) => {
          const active = pathname === link.href;

          if (link.dropdown && link.dropdown.length > 0) {
            return (
              <div
                key={link.label}
                ref={containerRef}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  href={link.href}
                  onClick={() => setDropdownOpen(false)}
                  aria-expanded={dropdownOpen}
                  className={`flex h-10 items-center gap-1 rounded-md px-4 text-[16px] font-medium tracking-[0.5px] transition ${
                    active || dropdownOpen
                      ? "bg-[#c1c7c7] text-[#171919]"
                      : "border border-[#c1c7c7]/60 text-[#c1c7c7] hover:border-accent hover:text-accent"
                  }`}
                >
                  {link.label}
                  <span
                    className={`text-xs transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    ⌄
                  </span>
                </Link>

                {dropdownOpen && (
                  <div className="absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-md bg-[#c1c7c7] shadow-lg">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block border-t border-[#171919]/15 px-4 py-3 text-[15px] font-medium text-[#171919] transition first:border-t-0 hover:bg-[#9ba0a0]/40"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex h-10 items-center gap-1 rounded-md px-4 text-[16px] font-medium tracking-[0.5px] transition ${
                active
                  ? "bg-[#c1c7c7] text-[#171919]"
                  : "border border-[#c1c7c7]/60 text-[#c1c7c7] hover:border-accent hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href={data.contactHref}
          className={`hidden h-10 items-center rounded-md border px-4 text-[16px] font-medium tracking-[0.5px] transition sm:flex ${
            pathname === data.contactHref
              ? "border-[#c1c7c7] bg-[#c1c7c7] text-[#171919]"
              : "border-[#c1c7c7]/60 text-[#c1c7c7] hover:border-accent hover:text-accent"
          }`}
        >
          {data.contactCtaLabel}
        </Link>
        <Link
          href={data.switchHref}
          className="flex h-10 items-center rounded-md border border-[#c1c7c7]/60 px-4 text-[16px] font-medium tracking-[0.5px] text-[#c1c7c7] hover:border-accent hover:text-accent"
        >
          {data.switchLabel}
        </Link>
      </div>
    </header>
  );
}
