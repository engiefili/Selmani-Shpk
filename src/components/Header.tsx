import HeaderClient from "@/components/HeaderClient";
import { getLocale, getPathname, localizePath, switchLocalePath } from "@/lib/locale";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

// The logo currently stored in Site Settings is a 178×44 PNG on a solid
// black background, which shows as a black box when the header is
// transparent over the hero photo. /public/brand holds the same artwork
// with the black keyed out to transparency (and upscaled 4×). It replaces
// that one asset until a transparent/SVG logo is uploaded in Studio — any
// other logo asset is used as-is.
const SETTINGS_LOGO_REF = "image-28a7bf4f3b01f478e85e8389976f40ce1c4e554b-178x44-png";
const TRANSPARENT_LOGO = "/brand/selmani-logo.png";

export default async function Header() {
  const locale = await getLocale();
  const pathname = await getPathname();
  const { settings, logoUrl } = await getSiteSettings(locale);

  const navLinks = settings.navLinks.map((link) => ({
    label: link.label,
    href: localizePath(link.href, locale),
    dropdown: link.dropdown?.map((item) => ({
      label: item.label,
      href: localizePath(item.href, locale),
    })),
  }));

  // "Insights" lives in code rather than Site Settings so it appears
  // alongside the section's routes going live — the label is the same in
  // both languages.
  if (!settings.navLinks.some((l) => l.href === "/insights")) {
    navLinks.push({
      label: "Insights",
      href: localizePath("/insights", locale),
      dropdown: undefined,
    });
  }

  return (
    <HeaderClient
      data={{
        logoUrl: settings.logo?.asset?._ref === SETTINGS_LOGO_REF ? TRANSPARENT_LOGO : logoUrl,
        homeHref: localizePath("/", locale),
        navLinks,
        contactHref: localizePath("/contact", locale),
        contactCtaLabel: settings.contactCtaLabel || "Contact Us",
        locale,
        switchHref: switchLocalePath(pathname, locale),
      }}
    />
  );
}
