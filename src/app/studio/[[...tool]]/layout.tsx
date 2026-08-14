// Studio gets its own root layout (a separate <html>/<body> from the
// marketing site's) so the site's global Tailwind reset/CSS never bleeds
// into the Studio UI, and vice versa. Next.js supports multiple root
// layouts side by side via route groups / distinct top-level segments.
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
