import type { Locale } from "@/lib/locale";
import { localizedDocId } from "@/lib/locale";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettingsDoc } from "@/sanity/lib/types";

// Hardcoded fallback matching the site's original pre-Sanity content —
// used if the siteSettings document hasn't been created/migrated yet,
// so the header/footer/contact page never render empty.
export const siteSettingsFallback: SiteSettingsDoc = {
  _id: "siteSettings",
  logo: {
    _type: "image",
    asset: { _ref: "", _type: "reference" },
  } as SiteSettingsDoc["logo"],
  navLinks: [
    { _key: "about", label: "About Us", href: "/about" },
    {
      _key: "services",
      label: "Services & Products",
      href: "/services",
      dropdown: [
        { _key: "mc", label: "Steel Constructions", href: "/services#metal-constructions" },
        { _key: "hdg", label: "Hot Dip Galvanizing", href: "/services#hot-dip-galvanizing" },
        { _key: "tanks", label: "Tanks & Containers", href: "/services#tanks-containers" },
      ],
    },
    { _key: "technology", label: "Technology", href: "/technology" },
    { _key: "industries", label: "Industries", href: "/industries" },
    { _key: "projects", label: "Projects", href: "/projects" },
  ],
  contactCtaLabel: "Contact Us",
  languageSwitcherLabel: "AL",
  footerCatalogRow1: [
    { _key: "about-f", label: "About Us", href: "/about" },
    { _key: "services-f", label: "Services & Products" },
    { _key: "industries-f", label: "Industries" },
  ],
  footerCatalogRow2: [
    { _key: "technology-f", label: "Technology" },
    { _key: "clients-f", label: "Clients" },
    { _key: "gallery-f", label: "Gallery" },
  ],
  companyName: "Selmani Imp-Exp sh.pk",
  headquartersLabel: "Headquarters",
  phone: "+355 68 201 3326",
  email: "info@selmanishpk.com",
  address: "Rruga Konferenca e Pezes, Ish Kombinati Misto Mame, Tiranë 1027",
  socialLinks: {
    linkedin:
      "https://www.linkedin.com/in/selmani-sh-p-k-hot-dip-galvanizing-metal-construction-97b42593/",
    instagram: "https://www.instagram.com/selmanisteel/?hl=en",
    facebook: "https://www.facebook.com/selmanishpk",
  },
  mapEmbedUrl: "https://www.google.com/maps?q=41.3170579,19.7810026&z=16&output=embed",
  mapLinkUrl: "https://maps.app.goo.gl/BQFZ2oMUpxnzuwZH9",
  copyrightText: "© 2026 — Copyright",
  rightsReservedText: "All rights reserved",
};

const FALLBACK_LOGO_URL =
  "https://www.figma.com/api/mcp/asset/85d6a554-e21f-43d5-aa62-afbf0e7c0f02.png";

export async function getSiteSettings(locale: Locale): Promise<{
  settings: SiteSettingsDoc;
  logoUrl: string;
}> {
  const id = localizedDocId("siteSettings", locale);
  let settings: SiteSettingsDoc | null = await sanityFetch<SiteSettingsDoc | null>(
    siteSettingsQuery,
    { id }
  );

  if (!settings && locale === "sq") {
    settings = await sanityFetch<SiteSettingsDoc | null>(siteSettingsQuery, {
      id: "siteSettings",
    });
  }

  if (!settings) {
    return { settings: siteSettingsFallback, logoUrl: FALLBACK_LOGO_URL };
  }

  const logoUrl = settings.logo
    ? urlForImage(settings.logo).height(72).url()
    : FALLBACK_LOGO_URL;

  return { settings, logoUrl };
}
