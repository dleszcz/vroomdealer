import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PUBLIC_FILE = /\.(.*)$/;

async function resolveTenantSlugByHost(host: string): Promise<string | null> {
  const cleanHost = host.toLowerCase().replace(/^www\./, "");

  // 1. Subdomain matching (e.g. d-car.vroomdealer.pl -> d-car)
  if (cleanHost.endsWith(".vroomdealer.pl") && cleanHost !== "vroomdealer.pl") {
    const subdomain = cleanHost.replace(".vroomdealer.pl", "");
    if (subdomain) return subdomain;
  }

  // 2. Supabase dynamic custom domain resolution
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && !supabaseUrl.includes("placeholder") && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data } = await supabase
        .from("profiles")
        .select("slug")
        .eq("custom_domain", cleanHost)
        .maybeSingle();

      if (data?.slug) {
        return data.slug;
      }
    } catch (e) {
      console.error("Middleware Supabase domain resolution error:", e);
    }
  }

  // 3. Known seed tenant domains & automatic domain slug extraction
  if (cleanHost.includes("d-car")) return "d-car";
  if (cleanHost.includes("komis-maciek")) return "komis-maciek";

  // Generic fallback: domain name before extension (e.g. auto-handel.pl -> auto-handel)
  const domainParts = cleanHost.split(".");
  if (domainParts.length >= 2) {
    return domainParts[0];
  }

  return null;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const hostname = req.headers.get("host") || "";

  // Normalize host (strip port and www)
  const host = hostname.split(":")[0].replace(/^www\./, "");

  // Platform root domains where main SaaS landing page & subpaths /[dealerSlug] live
  const isPlatformDomain =
    host === "vroomdealer.pl" ||
    host === "localhost" ||
    host.endsWith(".vercel.app");

  // Dynamically resolve tenant slug for custom domain or tenant subdomain
  let tenantSlug: string | null = null;
  if (!isPlatformDomain) {
    tenantSlug = await resolveTenantSlugByHost(host);
  }

  // Handle requests on custom tenant domain / subdomain
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
    // e.g. "d-car.com.pl/" -> "/d-car"
    // e.g. "komis-maciek.pl/skup-aut" -> "/komis-maciek/skup-aut"
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
