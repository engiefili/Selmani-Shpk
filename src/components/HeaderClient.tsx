"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownLabel, setMobileDropdownLabel] = useState<string | null>(null);

  // Close the mobile panel whenever the route actually changes (a link
  // inside it was followed). Adjusted during render rather than in an
  // effect, per React's guidance for resetting state on a prop change.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 border-b border-[#9ba0a0]/40 bg-black">
      <div className="flex items-center justify-between px-5 py-4 sm:px-[45px] sm:py-[25px]">
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
          className="hidden h-10 items-center rounded-md border border-[#c1c7c7]/60 px-4 text-[16px] font-medium tracking-[0.5px] text-[#c1c7c7] hover:border-accent hover:text-accent lg:flex"
        >
          {data.switchLabel}
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#c1c7c7]/60 text-[#c1c7c7] transition hover:border-accent hover:text-accent lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      </div>

      {/* Mobile menu panel — links, contact CTA, and nested dropdowns
          collapse into a single stacked list below "lg". */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-[#9ba0a0]/40 bg-black px-5 py-6 sm:px-[45px] lg:hidden">
          <nav className="flex flex-col gap-1">
            {data.navLinks.map((link) => {
              const active = pathname === link.href;
              const hasDropdown = link.dropdown && link.dropdown.length > 0;
              const expanded = mobileDropdownLabel === link.label;

              if (hasDropdown) {
                return (
                  <div key={link.label} className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Link
                        href={link.href}
                        className={`flex h-12 flex-1 items-center rounded-md px-4 text-[17px] font-medium tracking-[0.5px] transition ${
                          active
                            ? "bg-[#c1c7c7] text-[#171919]"
                            : "text-[#c1c7c7] hover:text-accent"
                        }`}
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={`${expanded ? "Collapse" : "Expand"} ${link.label}`}
                        aria-expanded={expanded}
                        onClick={() =>
                          setMobileDropdownLabel(expanded ? null : link.label)
                        }
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-[#c1c7c7] transition hover:text-accent"
                      >
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {expanded && (
                      <div className="ml-4 flex flex-col border-l border-[#9ba0a0]/40 pl-4">
                        {link.dropdown!.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex h-11 items-center text-[15px] text-[#9ba0a0] transition hover:text-accent"
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
                  className={`flex h-12 items-center rounded-md px-4 text-[17px] font-medium tracking-[0.5px] transition ${
                    active
                      ? "bg-[#c1c7c7] text-[#171919]"
                      : "text-[#c1c7c7] hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={data.contactHref}
            className="mt-6 flex h-12 items-center justify-center rounded-md border border-accent bg-accent text-[16px] font-medium tracking-[0.5px] text-white transition hover:bg-accent-hover"
          >
            {data.contactCtaLabel}
          </Link>

          <Link
            href={data.switchHref}
            className="mt-3 flex h-12 items-center justify-center rounded-md border border-[#c1c7c7]/60 text-[16px] font-medium tracking-[0.5px] text-[#c1c7c7] transition hover:border-accent hover:text-accent"
          >
            {data.switchLabel}
          </Link>
        </div>
      )}
    </header>
  );
}
