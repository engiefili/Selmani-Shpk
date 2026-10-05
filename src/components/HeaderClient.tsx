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
  /** Which language the page is currently in — that side of "EN / AL" is
   * shown as the active (non-link) label. */
  locale: "en" | "sq";
  /** Same page in the *other* language. */
  switchHref: string;
};

// Scroll distance (px) after which the header turns solid black.
const SOLID_AFTER = 24;

export default function HeaderClient({ data }: { data: HeaderData }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownLabel, setMobileDropdownLabel] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile panel whenever the route actually changes (a link
  // inside it was followed). Adjusted during render rather than in an
  // effect, per React's guidance for resetting state on a prop change.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Over the hero photo the header is transparent (white text, with a soft
  // dark scrim for legibility); once scrolled — or while the mobile menu
  // is open — it becomes solid black.
  const solid = scrolled || mobileOpen;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navLinkClass = (active: boolean) =>
    `relative inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-[15px] font-medium tracking-[0.04em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-300 ${
      active
        ? "text-white after:scale-x-100"
        : "text-white/90 after:scale-x-0 hover:text-white hover:after:scale-x-100"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        solid ? "bg-black shadow-[0_1px_0_rgba(255,255,255,0.08)]" : "bg-transparent"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 via-black/35 to-transparent transition-opacity duration-300 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        className={`relative mx-auto flex w-full items-center justify-between gap-6 px-5 transition-[padding] duration-300 sm:px-[45px] ${
          scrolled ? "py-3 sm:py-4" : "py-4 sm:py-7"
        }`}
      >
        <Link href={data.homeHref} className="flex shrink-0 items-center" aria-label="Selmani — home">
          <div className="relative h-10 w-[150px] sm:h-14 sm:w-[228px]">
            <Image
              src={data.logoUrl}
              alt="Selmani"
              fill
              sizes="228px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <nav className="hidden items-center gap-9 xl:flex 2xl:gap-12">
          {data.navLinks.map((link) => {
            const active = isActive(link.href);

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
                    className={navLinkClass(active || dropdownOpen)}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </Link>

                  {dropdownOpen && (
                    // pt-4 wrapper bridges the gap between link and panel so
                    // the hover isn't lost while moving the pointer down.
                    <div className="dropdown-in absolute left-1/2 top-full z-30 w-64 -translate-x-1/2 pt-4">
                      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/95 py-2 shadow-2xl backdrop-blur">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className="block px-5 py-3 text-[15px] text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={link.label} href={link.href} className={navLinkClass(active)}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5 sm:gap-8">
          {/* Language: both options always visible, "EN / AL". The current
              language is plain white text; the other is the link. A plain
              <a>, not next/link's <Link>: the "/al" ↔ "/" switch is a
              middleware rewrite to the *same* route, so Next's client-side
              router cache treats them as one page and can serve a stale,
              wrong-locale render on the first click — a real navigation
              (full page load) always renders the correct locale. */}
          <div
            className="flex items-center gap-2 text-[14px] font-medium tracking-[0.14em]"
            aria-label="Language"
          >
            {data.locale === "en" ? (
              <span aria-current="true" className="text-white">EN</span>
            ) : (
              <a href={data.switchHref} lang="en" hrefLang="en" className="text-white/55 transition-colors hover:text-white">
                EN
              </a>
            )}
            <span aria-hidden="true" className="text-white/30">/</span>
            {data.locale === "sq" ? (
              <span aria-current="true" className="text-white">AL</span>
            ) : (
              <a href={data.switchHref} lang="sq" hrefLang="sq" className="text-white/55 transition-colors hover:text-white">
                AL
              </a>
            )}
          </div>

          <Link
            href={data.contactHref}
            className="hidden h-11 items-center whitespace-nowrap rounded-md bg-accent px-6 text-[15px] font-medium tracking-[0.04em] text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            {data.contactCtaLabel}
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-white transition-colors hover:text-accent xl:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel — links, contact CTA, and nested dropdowns
          collapse into a single stacked list below "xl". Always mounted
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
          <div className="mx-auto max-h-[calc(100dvh-72px)] w-full overflow-y-auto border-t border-white/10 bg-black px-5 pb-8 pt-4 sm:px-[45px]">
            <nav className="flex flex-col">
              {data.navLinks.map((link) => {
                const active = isActive(link.href);
                const hasDropdown = link.dropdown && link.dropdown.length > 0;
                const expanded = mobileDropdownLabel === link.label;
                const rowClass = `flex min-h-14 flex-1 items-center text-[22px] font-light tracking-tight transition-colors ${
                  active ? "text-white" : "text-white/75 hover:text-white"
                }`;

                if (hasDropdown) {
                  return (
                    <div key={link.label} className="flex flex-col border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Link href={link.href} className={rowClass}>
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          aria-label={`${expanded ? "Collapse" : "Expand"} ${link.label}`}
                          aria-expanded={expanded}
                          onClick={() =>
                            setMobileDropdownLabel(expanded ? null : link.label)
                          }
                          className="flex h-14 w-12 shrink-0 items-center justify-end text-white/75 transition-colors hover:text-accent"
                        >
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                      {expanded && (
                        <div className="mb-3 ml-1 flex flex-col border-l border-white/15 pl-5">
                          {link.dropdown!.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex h-12 items-center text-[16px] text-[#9ba0a0] transition-colors hover:text-white"
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
                    className={`${rowClass} border-b border-white/10`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href={data.contactHref}
              className="mt-8 flex h-14 items-center justify-center rounded-md bg-accent text-[16px] font-medium tracking-[0.04em] text-white transition-colors hover:bg-accent-hover"
            >
              {data.contactCtaLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
