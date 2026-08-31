import type { Metadata } from "next";
import { draftMode } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";

import { DisableDraftMode } from "@/components/DisableDraftMode";

// Geom — the brand typeface. Body text follows the typography spec
// (Regular/Medium), but page hero titles use the Black weight for a
// bolder, heavier look per direct design reference.
const geom = localFont({
  variable: "--font-geom",
  src: [
    { path: "../../fonts/Geom-Light.ttf", weight: "300", style: "normal" },
    { path: "../../fonts/Geom-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Geom-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/Geom-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../fonts/Geom-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../fonts/Geom-Black.ttf", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Selmani | Industrial Galvanizing & Steel Constructions",
  description:
    "Over 25 years of experience in industrial galvanizing and steel constructions, serving civil, industrial, and infrastructure sectors locally and internationally.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${geom.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground font-sans">
        {children}
        {isDraftMode && <DisableDraftMode />}
      </body>
    </html>
  );
}
