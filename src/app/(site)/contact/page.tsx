import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactMapBand from "@/components/contact/ContactMapBand";
import { getLocale, localizePath } from "@/lib/locale";
import { contactPageQuery } from "@/sanity/lib/queries";
import { fetchLocalizedSingleton } from "@/sanity/lib/localizedFetch";
import type { ContactPageDoc } from "@/sanity/lib/types";

const fallback: ContactPageDoc = {
  _id: "contactPage",
  heroHeading: "Send us a\nmessage",
  heroSubtext:
    "Connect with us for advanced galvanizing solutions, expert consultation, and long-term partnerships.",
};

export default async function ContactPage() {
  const locale = await getLocale();
  const page =
    (await fetchLocalizedSingleton<ContactPageDoc>(
      contactPageQuery,
      "contactPage",
      locale
    )) || fallback;
  const headingLines = page.heroHeading.split("\n");

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col pt-[76px]">
        <section className="bg-neutral-950 px-5 py-16 text-white sm:px-10 sm:py-24">
          <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className="flex flex-col gap-6">
              <h1
                className="font-light leading-none text-[#eaefef]"
                style={{ fontSize: "clamp(2.75rem, 5vw, 64px)" }}
              >
                {headingLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < headingLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="max-w-md text-lg font-light leading-snug text-[#c1c7c7]">
                {page.heroSubtext}
              </p>
            </div>

            <ContactForm
              privacyHref={localizePath("/privacy-policy", locale)}
              locale={locale}
            />
          </div>
        </section>

        <ContactMapBand />
      </main>
      <Footer />
    </div>
  );
}
