import HeaderClient from "@/components/HeaderClient";
import { getLocale, getPathname, localizePath, switchLocalePath } from "@/lib/locale";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

export default async function Header() {
  const locale = await getLocale();
  const pathname = await getPathname();
  const { settings, logoUrl } = await getSiteSettings(locale);

  return (
    <HeaderClient
      data={{
        logoUrl,
        homeHref: localizePath("/", locale),
        navLinks: settings.navLinks.map((link) => ({
          label: link.label,
          href: localizePath(link.href, locale),
          dropdown: link.dropdown?.map((item) => ({
            label: item.label,
            href: localizePath(item.href, locale),
          })),
        })),
        contactHref: localizePath("/contact", locale),
        contactCtaLabel: settings.contactCtaLabel || "Contact Us",
        switchHref: switchLocalePath(pathname, locale),
        switchLabel: locale === "en" ? settings.languageSwitcherLabel || "AL" : "EN",
      }}
    />
  );
}
