import Link from "next/link";

import type { Locale } from "@/lib/locale";
import { getLocale, localizePath } from "@/lib/locale";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

function Sep() {
  return <span className="text-[#9ba0a0]">/</span>;
}

function CatalogRow({
  links,
  locale,
}: {
  links: { label: string; href?: string }[];
  locale: Locale;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map((link, i) => (
        <span key={link.label} className="flex items-center gap-3">
          <Link
            href={link.href ? localizePath(link.href, locale) : "#"}
            className="text-xl leading-tight tracking-tight text-[#eaefef] hover:text-accent sm:text-[28px]"
          >
            {link.label}
          </Link>
          {i < links.length - 1 && <Sep />}
        </span>
      ))}
    </div>
  );
}

export default async function Footer() {
  const locale = await getLocale();
  const { settings } = await getSiteSettings(locale);
  const row1 = settings.footerCatalogRow1 || [];
  const row2 = settings.footerCatalogRow2 || [];

  return (
    <footer id="contacts" className="bg-black text-white">
      <div className="flex flex-col gap-6 border-t border-[#9ba0a0] px-5 py-12 sm:px-10 lg:flex-row">
        <div className="flex flex-col gap-16 lg:w-[46%] lg:gap-40">
          <div className="flex flex-col gap-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.4px] text-[#9ba0a0]">
              {locale === "sq" ? "Katalog" : "Catalog"}
            </p>
            <nav className="flex flex-col gap-3">
              <CatalogRow links={row1} locale={locale} />
              <CatalogRow links={row2} locale={locale} />
            </nav>
          </div>
          <Link
            href="#contacts"
            className="text-sm text-[#9ba0a0] hover:text-white"
          >
            {locale === "sq" ? "Kontakte" : "Contacts"}
          </Link>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-16">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div className="flex flex-col gap-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.4px] text-[#9ba0a0]">
                {locale === "sq" ? "Na kontaktoni" : "Contact us"}
              </p>
              <div className="flex flex-col gap-1 text-sm">
                <p className="text-accent">{settings.phone}</p>
                <p className="text-[#9ba0a0]">{settings.email}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-8 text-right">
              <p className="text-[10px] font-medium uppercase tracking-[0.4px] text-[#9ba0a0]">
                {locale === "sq" ? "Na ndiqni" : "Follow us"}
              </p>
              <div className="flex flex-col items-end gap-1 text-sm text-[#eaefef]">
                {settings.socialLinks?.linkedin && (
                  <Link
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    Linkedin
                  </Link>
                )}
                {settings.socialLinks?.instagram && (
                  <Link
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    Instagram
                  </Link>
                )}
                {settings.socialLinks?.facebook && (
                  <Link
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    Facebook
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <p className="text-sm text-[#9ba0a0]">{settings.address}</p>
            <span className="flex h-6 w-6 -rotate-90 items-center justify-center text-[#9ba0a0]">
              ↗
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-[#353737] px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <p className="text-xs text-[#9ba0a0] opacity-60">
          {settings.copyrightText}
        </p>
        <div className="flex justify-between gap-8 text-xs text-[#9ba0a0] opacity-60 sm:w-full sm:max-w-xs">
          <Link href={localizePath("/privacy-policy", locale)} className="hover:opacity-100">
            Privacy
          </Link>
          <span>{settings.rightsReservedText}</span>
        </div>
      </div>
    </footer>
  );
}
