import { NextResponse, type NextRequest } from "next/server";

/**
 * Tells the root layout which language the requested page is in, so the
 * server-rendered <html lang> matches the content (/uk/... is Ukrainian).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lang = pathname === "/uk" || pathname.startsWith("/uk/") ? "uk" : "en";
  const headers = new Headers(request.headers);
  headers.set("x-site-lang", lang);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Pages only: skip API routes, Next.js assets and files with an extension.
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
