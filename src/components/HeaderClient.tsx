"use client";

import Image from "next/image";
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
      <div className="mx-auto flex w-full items-center justify-between px-5 py-4 sm:px-[45px] sm:py-[25px]">
      <Link href={data.homeHref} className="flex items-center">
        <div className="relative h-9 w-28">
          <Image
            src={data.logoUrl}
            alt="Selmani"
            fill
            sizes="112px"
            className="object-contain object-left"
            priority
          />
        </div>
      </Link>

      <nav className="hidden items-center gap-2.5 xl:flex">
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
                  className={`flex h-10 items-center gap-1 whitespace-nowrap rounded-md px-4 text-[16px] font-medium tracking-[0.5px] transition ${
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
                  <div className="dropdown-in absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-md bg-[#c1c7c7] shadow-lg">
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
              className={`flex h-10 items-center gap-1 whitespace-nowrap rounded-md px-4 text-[16px] font-medium tracking-[0.5px] transition ${
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
          className={`hidden h-10 items-center whitespace-nowrap rounded-md border px-4 text-[16px] font-medium tracking-[0.5px] transition sm:flex ${
            pathname === data.contactHref
              ? "border-[#c1c7c7] bg-[#c1c7c7] text-[#171919]"
              : "border-[#c1c7c7]/60 text-[#c1c7c7] hover:border-accent hover:text-accent"
          }`}
        >
          {data.contactCtaLabel}
        </Link>
        {/* A plain <a>, not next/link's <Link>: the "/al" ↔ "/" switch is a
            middleware rewrite to the *same* route, so Next's client-side
            router cache treats them as one page and can serve a stale,
            wrong-locale render on the first click — a real navigation
            (full page load) always renders the correct locale on the
            first click, which is what a language switch should do. */}
        <a
          href={data.switchHref}
          className="flex h-10 items-center whitespace-nowrap rounded-md border border-[#c1c7c7]/60 px-3 text-sm font-medium tracking-[0.5px] text-[#c1c7c7] transition hover:border-accent hover:text-accent sm:px-4 sm:text-[16px]"
        >
          {data.switchLabel}
        </a>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#c1c7c7]/60 text-[#c1c7c7] transition hover:border-accent hover:text-accent xl:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      </div>

      {/* Mobile menu panel — links, contact CTA, and nested dropdowns
          collapse into a single stacked list below "lg". Always mounted
          (rather than conditionally rendered) so the open/close is an
          actual height + fade transition instead of an instant swap;
          `inert` keeps its links out of tab order and screen readers
          while collapsed, so this isn't an accessibility regression. */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none xl:hidden"
        style={{ gridTemplateRows: mobileOpen ? "1fr" : "0fr" }}
        inert={!mobileOpen}
      >
        <div
          className={`overflow-hidden transition-opacity duration-300 motion-reduce:transition-none ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="mx-auto max-h-[calc(100vh-76px)] w-full overflow-y-auto border-t border-[#9ba0a0]/40 bg-black px-5 py-6 sm:px-[45px]">
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
          </div>
        </div>
      </div>
    </header>
  );
}
