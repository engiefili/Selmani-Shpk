"use client";

import Link from "next/link";
import { useState } from "react";

const SUBJECTS_EN = [
  "Hot Dip Galvanizing",
  "Metal Constructions",
  "Tanks & Containers",
  "Other",
] as const;

const SUBJECTS_SQ = [
  "Zinkim në të nxehtë",
  "Konstruksione Metalike",
  "Depozita & Kontenier",
  "Tjetër",
] as const;

const STRINGS = {
  en: {
    getInTouch: "Get in touch",
    required: "*Required fields",
    name: "Name",
    enterName: "Enter name",
    email: "Email",
    enterEmail: "Enter email",
    phone: "Phone number",
    enterPhone: "Enter phone",
    company: "Company name",
    enterCompany: "Enter company name (Optional)",
    selectSubject: "Select a subject",
    message: "Message",
    enterMessage: "Enter message",
    agreeTo: "I agree to",
    privacyPolicy: "Privacy Policy",
    send: "Send Message",
  },
  sq: {
    getInTouch: "Na kontaktoni",
    required: "*Fushat e detyrueshme",
    name: "Emër",
    enterName: "Shkruani emrin",
    email: "Email",
    enterEmail: "Shkruani email-in",
    phone: "Numër telefoni",
    enterPhone: "Shkruani telefonin",
    company: "Emri i kompanisë",
    enterCompany: "Shkruani emrin e kompanisë (Opsionale)",
    selectSubject: "Zgjidhni një subjekt",
    message: "Mesazh",
    enterMessage: "Shkruani mesazhin",
    agreeTo: "Pranoj",
    privacyPolicy: "Politikën e Privatësisë",
    send: "Dërgo Mesazhin",
  },
} as const;

function FieldRow({
  label,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#3a3c3c] py-5 sm:flex-row sm:items-center sm:gap-10">
      <label className="text-lg text-[#eaefef] sm:w-44 sm:shrink-0">
        {label}
        {required && "*"}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full flex-1 bg-transparent text-lg text-[#c1c7c7] placeholder-[#7a7e7e] outline-none"
      />
    </div>
  );
}

export default function ContactForm({
  privacyHref = "/privacy-policy",
  locale = "en",
}: {
  privacyHref?: string;
  locale?: "en" | "sq";
} = {}) {
  const t = STRINGS[locale];
  const SUBJECTS = locale === "sq" ? SUBJECTS_SQ : SUBJECTS_EN;
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number] | null>(
    null
  );
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:items-baseline sm:gap-10">
        <h2 className="text-2xl font-light text-[#eaefef] sm:w-44 sm:shrink-0 sm:text-3xl">
          {t.getInTouch}
        </h2>
        <span className="text-sm text-[#9ba0a0] underline underline-offset-2">
          {t.required}
        </span>
      </div>

      <FieldRow label={t.name} required placeholder={t.enterName} />
      <FieldRow label={t.email} required placeholder={t.enterEmail} type="email" />
      <FieldRow label={t.phone} required placeholder={t.enterPhone} type="tel" />
      <FieldRow label={t.company} placeholder={t.enterCompany} />

      <div className="flex flex-col gap-4 border-b border-[#3a3c3c] py-5 sm:flex-row sm:items-start sm:gap-10">
        <label className="text-lg text-[#eaefef] sm:w-44 sm:shrink-0">
          {t.selectSubject}
        </label>
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={`rounded-md border px-6 py-3 text-center text-sm font-medium tracking-wide transition ${
                subject === s
                  ? "border-accent bg-accent text-[#eaefef]"
                  : "border-[#9ba0a0]/60 text-[#c1c7c7] hover:border-accent hover:text-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-[#3a3c3c] py-5 sm:flex-row sm:gap-10">
        <label className="text-lg text-[#eaefef] sm:w-44 sm:shrink-0">{t.message}</label>
        <div className="relative h-[110px] flex-1">
          <textarea
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.enterMessage}
            className="absolute inset-x-0 bottom-0 max-h-full w-full resize-none bg-transparent text-lg text-[#c1c7c7] placeholder-[#7a7e7e] outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:gap-6">
        <label className="flex shrink-0 items-center gap-3 text-sm text-[#c1c7c7]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          {t.agreeTo}{" "}
          <Link
            href={privacyHref}
            className="underline underline-offset-2 hover:text-accent"
          >
            {t.privacyPolicy}
          </Link>
        </label>

        <div className="inline-flex h-[54px] flex-1 items-stretch gap-1">
          <button
            type="submit"
            className="inline-flex h-full flex-1 items-center justify-center rounded-md bg-accent px-8 text-lg font-medium text-[#eaefef] transition hover:bg-accent-hover"
          >
            {t.send}
          </button>
          <button
            type="submit"
            aria-label="Submit"
            className="flex h-full w-[54px] shrink-0 items-center justify-center rounded-md bg-accent text-xl transition hover:bg-accent-hover"
          >
            ↗
          </button>
        </div>
      </div>
    </form>
  );
}
