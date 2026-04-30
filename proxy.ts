import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Paths that have Arabic translations available.
 * As more pages are translated in subsequent PRs, add their root-relative paths here.
 * Paths NOT in this list, when requested under /ar/<path>, are redirected to /<path>
 * to avoid serving mixed-language pages (Arabic chrome around English content) that
 * would hurt SEO.
 */
const ARABIC_ENABLED_PATHS = new Set<string>([
  "/",
  "/for-companies",
  "/for-schools",
  "/for-creators",
  "/about",
  "/contact",
]);

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip the /ar prefix to check whether the underlying path is translated.
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const rest = pathname === "/ar" ? "/" : pathname.slice(3);
    if (!ARABIC_ENABLED_PATHS.has(rest)) {
      const url = req.nextUrl.clone();
      url.pathname = rest;
      // 307: temporary — Arabic versions of these pages are coming in future PRs
      return NextResponse.redirect(url, 307);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|sitemap.xml|robots.txt|opengraph-image|.*\\..*).*)",
  ],
};
