import { NextRequest, NextResponse } from "next/server";

import { AL_PREFIX } from "@/lib/locale";

// Detects the "/al" locale prefix, rewrites it away internally (so
// page routes stay un-prefixed on disk), and stamps the request with
// "x-locale" and "x-pathname" headers that Server Components read via
// src/lib/locale.ts.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAlbanian = pathname === AL_PREFIX || pathname.startsWith(`${AL_PREFIX}/`);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", isAlbanian ? "sq" : "en");
  requestHeaders.set("x-pathname", pathname);

  if (isAlbanian) {
    const rest = pathname.slice(AL_PREFIX.length) || "/";
    const url = request.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!studio|api|_next/static|_next/image|favicon.ico).*)"],
};
