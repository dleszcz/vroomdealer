import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const hostname = req.headers.get("host") || "";

  // Normalize host (strip port and www)
  const host = hostname.split(":")[0].replace(/^www\./, "");

  // Platform domains where tenant subpaths /dealerSlug are used
  const isPlatformDomain =
    host === "vroomdealer.pl" ||
    host === "localhost" ||
    host.endsWith(".vercel.app");

  // Determine if host is a tenant custom domain
  let tenantSlug: string | null = null;
  if (!isPlatformDomain) {
    if (host === "d-car.com.pl" || host.includes("d-car")) {
      tenantSlug = "d-car";
    }
  }

  // Handle requests on custom tenant domain
  if (tenantSlug) {
    // 1. Rewrite favicon & icon endpoints to tenant icon route
    if (pathname === "/icon" || pathname === "/favicon.ico") {
      url.pathname = "/api/icon";
      url.searchParams.set("tenant", tenantSlug);
      const res = NextResponse.rewrite(url);
      res.headers.set("x-tenant-slug", tenantSlug);
      res.headers.set("x-is-custom-domain", "true");
      return res;
    }

    // 2. Pass through static files, api routes, or already prefixed paths
    if (
      PUBLIC_FILE.test(pathname) ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/images") ||
      pathname.startsWith(`/${tenantSlug}`)
    ) {
      const res = NextResponse.next();
      res.headers.set("x-tenant-slug", tenantSlug);
      res.headers.set("x-is-custom-domain", "true");
      return res;
    }

    // 3. Rewrite root & subpaths internally to /[dealerSlug] routes
    // e.g. "/" -> "/d-car"
    // e.g. "/skup-aut" -> "/d-car/skup-aut"
    // e.g. "/samochody" -> "/d-car/samochody"
    url.pathname = `/${tenantSlug}${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("x-tenant-slug", tenantSlug);
    res.headers.set("x-is-custom-domain", "true");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
  ],
};
