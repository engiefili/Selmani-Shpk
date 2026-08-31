import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

// Turns Draft Mode back off and sends the visitor back to the
// homepage of whichever site (English or Albanian doesn't matter
// here) they were previewing.
export async function GET(request: Request) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
