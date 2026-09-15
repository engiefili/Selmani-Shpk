import Link from "next/link";

import { getLocale } from "@/lib/locale";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

export default async function ContactMapBand() {
  const locale = await getLocale();
  const { settings } = await getSiteSettings(locale);

  return (
    <section className="bg-neutral-950 px-5 pb-16 text-white sm:px-[45px]">
      <div className="mx-auto grid w-full grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-2">
        <div className="flex flex-col gap-16 bg-[#171919] p-8 sm:p-12">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-light text-[#eaefef]">
              {settings.headquartersLabel}
            </h3>
            <p className="text-lg text-[#c1c7c7]">{settings.companyName}</p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.4px] text-[#9ba0a0]">
                {locale === "sq" ? "Na kontaktoni" : "Contact us"}
              </p>
              <div className="flex flex-col gap-1 text-sm text-[#c1c7c7]">
                <p>{settings.address}</p>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <p className="text-accent">TEL: {settings.phone}</p>
                <p className="text-accent">E-MAIL: {settings.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.4px] text-[#9ba0a0]">
                {locale === "sq" ? "Na ndiqni" : "Follow us"}
              </p>
              <div className="flex flex-col gap-1 text-sm text-[#eaefef]">
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
        </div>

        <div className="relative min-h-[360px] overflow-hidden lg:min-h-0">
          {settings.mapEmbedUrl && (
            <iframe
              title="Selmani headquarters location"
              src={settings.mapEmbedUrl}
              className="absolute inset-0 h-full w-full grayscale"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
          {settings.mapLinkUrl && (
            <a
              href={settings.mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-md border border-[#c1c7c7]/60 bg-[#171919]/90 px-4 py-2 text-xs font-medium tracking-wide text-[#eaefef] backdrop-blur-sm transition hover:border-accent hover:text-accent"
            >
              {locale === "sq" ? "Shiko në Google Maps" : "View in Google Maps"}
              <span className="flex h-4 w-4 items-center justify-center text-xs">
                ↗
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
