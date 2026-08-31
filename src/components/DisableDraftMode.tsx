"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

// Floating button shown only while Draft Mode is active AND the page
// is being viewed directly in a browser tab (not inside Studio's
// Presentation iframe, where Studio itself controls the preview).
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  if (isPresentationTool) return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-neutral-800"
    >
      Exit Preview
    </a>
  );
}
