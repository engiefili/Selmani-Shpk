import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// English-only utility page — no Albanian translation exists, so no
// hreflang alternates are set here (unlike the localized pages via
// pageMetadata()).
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read Selmani's privacy policy to understand how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

const LAST_UPDATED = "August 13, 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-[#3a3c3c] pt-8">
      <h2 className="text-2xl font-normal text-[#eaefef] sm:text-[28px]">
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-lg font-light leading-relaxed text-[#c1c7c7]">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col pt-[76px]">
        <section className="bg-neutral-950 px-5 py-16 text-white sm:px-10 sm:py-24">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-16">
            <div className="flex flex-col gap-6">
              <h1
                className="font-light leading-none text-[#eaefef]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 56px)" }}
              >
                Privacy Policy
              </h1>
              <p className="text-lg font-light text-[#9ba0a0]">
                Last updated: {LAST_UPDATED}
              </p>
              <p className="max-w-2xl text-xl font-light leading-snug text-[#c1c7c7]">
                Selmani Imp-Exp sh.p.k. (&ldquo;Selmani,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy
                and is committed to protecting the personal information you
                share with us. This Privacy Policy explains what information
                we collect through this website, how we use it, and the
                choices and rights available to you.
              </p>
            </div>

            <Section title="Who we are">
              <p>
                This website is operated by Selmani Imp-Exp sh.p.k., a
                company registered in Albania and specializing in hot-dip
                galvanizing, metal construction, and related industrial
                services.
              </p>
              <p>
                Registered address: Rruga Konferenca e Pezes, Ish Kombinati
                Misto Mame, Tiranë 1027, Albania
                <br />
                Email: info@selmanishpk.com
                <br />
                Phone: +355 68 201 3326
              </p>
            </Section>

            <Section title="Information we collect">
              <p>
                We collect information in the following ways:
              </p>
              <p>
                <span className="text-[#eaefef]">
                  Information you provide directly.
                </span>{" "}
                When you use the contact form on this website, we collect the
                information you enter, which may include your name, email
                address, phone number, company name, the subject of your
                inquiry (e.g. Steel Constructions, Hot Dip Galvanizing, Tanks
                &amp; Containers), and the content of your message.
              </p>
              <p>
                <span className="text-[#eaefef]">
                  Information collected automatically.
                </span>{" "}
                We do not currently use analytics, advertising, or tracking
                cookies on this website. If this changes in the future, we
                will update this Privacy Policy and, where required by law,
                request your consent before doing so.
              </p>
            </Section>

            <Section title="How we use your information">
              <p>We use the information we collect to:</p>
              <p>
                Respond to your inquiries and requests for quotes,
                information, or technical documentation; communicate with you
                about our products and services; maintain records of our
                business correspondence; and comply with applicable legal
                obligations.
              </p>
              <p>
                We do not use your information for automated decision-making
                or profiling, and we do not sell your personal information to
                third parties.
              </p>
            </Section>

            <Section title="Legal basis for processing">
              <p>
                We process your personal information on the basis of your
                consent (when you voluntarily submit the contact form), our
                legitimate interest in responding to business inquiries, and,
                where applicable, the steps necessary to enter into or
                perform a contract with you or your organization.
              </p>
            </Section>

            <Section title="Third-party services">
              <p>
                Our Contact page embeds a Google Maps view to help you find
                our headquarters. Loading this embed may allow Google to
                collect certain technical data (such as your IP address)
                subject to Google&rsquo;s own privacy practices. You can
                review Google&rsquo;s privacy policy at{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2 hover:text-accent-hover"
                >
                  policies.google.com/privacy
                </a>
                .
              </p>
              <p>
                We do not otherwise share your personal information with
                third parties, except where required to comply with the law,
                protect our rights, or with service providers who assist us
                in operating this website under appropriate confidentiality
                obligations.
              </p>
            </Section>

            <Section title="Data retention">
              <p>
                We retain the information submitted through our contact form
                for as long as necessary to respond to your inquiry and
                maintain a record of our business communications, or as
                required by applicable law. When information is no longer
                needed, we take reasonable steps to delete or anonymize it.
              </p>
            </Section>

            <Section title="Data security">
              <p>
                We take reasonable technical and organizational measures to
                protect the personal information you share with us against
                unauthorized access, loss, misuse, or alteration. However, no
                method of transmission over the internet is completely
                secure, and we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                Depending on your location, you may have rights under
                applicable data protection law &mdash; including Albanian Law
                No. 9887/2008 &ldquo;On the Protection of Personal
                Data,&rdquo; as amended, and, where applicable, the EU
                General Data Protection Regulation &mdash; to access,
                correct, delete, or restrict the use of your personal
                information, to object to certain processing, and to request
                a copy of your data in a portable format.
              </p>
              <p>
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:info@selmanishpk.com"
                  className="text-accent underline underline-offset-2 hover:text-accent-hover"
                >
                  info@selmanishpk.com
                </a>
                . You may also have the right to lodge a complaint with the
                Albanian Information and Data Protection Commissioner (IDP)
                or your local data protection authority.
              </p>
            </Section>

            <Section title="Children's privacy">
              <p>
                This website is intended for business use and is not directed
                at children. We do not knowingly collect personal information
                from children.
              </p>
            </Section>

            <Section title="Changes to this policy">
              <p>
                We may update this Privacy Policy from time to time to
                reflect changes in our practices or for legal, operational,
                or regulatory reasons. We will post the updated version on
                this page with a revised &ldquo;Last updated&rdquo; date.
              </p>
            </Section>

            <Section title="Contact us">
              <p>
                If you have questions or concerns about this Privacy Policy
                or how we handle your personal information, please contact
                us at{" "}
                <a
                  href="mailto:info@selmanishpk.com"
                  className="text-accent underline underline-offset-2 hover:text-accent-hover"
                >
                  info@selmanishpk.com
                </a>{" "}
                or +355 68 201 3326.
              </p>
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
