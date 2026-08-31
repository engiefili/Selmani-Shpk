import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getSiteSettings } from "@/sanity/lib/siteSettings";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  locale?: "en" | "sq";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const company = (body.company ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();
  const locale = body.locale === "sq" ? "sq" : "en";

  if (!name || !email || !phone || !message) {
    return NextResponse.json(
      { error: "Name, email, phone, and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fails loudly in server logs so this is easy to spot during setup,
    // rather than silently pretending the message was sent.
    console.error(
      "RESEND_API_KEY is not set — contact form submission was not sent."
    );
    return NextResponse.json(
      { error: "Email sending isn't configured yet." },
      { status: 500 }
    );
  }

  // Falls back to the Sanity site-settings email, then a hardcoded
  // address, so this still works even before CONTACT_TO_EMAIL is set.
  let toEmail = process.env.CONTACT_TO_EMAIL;
  if (!toEmail) {
    try {
      const { settings } = await getSiteSettings(locale);
      toEmail = settings.email;
    } catch {
      toEmail = "info@selmanishpk.com";
    }
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "Selmani Website <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New website inquiry${subject ? ` — ${subject}` : ""} from ${name}`,
      html: `
        <div style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #171919;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
          ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e6e6e6;" />
          <p style="color: #9ba0a0; font-size: 12px;">Sent from the ${locale === "sq" ? "Albanian" : "English"} contact form on selmanishpk.com.al</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
