/**
 * Returns a clean relative URL path for a tenant route.
 * On custom domain (e.g. d-car.com.pl): returns clean path like "/skup-aut", "/samochody", "/polityka-prywatnosci"
 * On platform domain (e.g. vroomdealer.pl, vroomdealer.vercel.app, localhost): returns "/[dealerSlug]/skup-aut", "/[dealerSlug]/samochody"
 */
export function getTenantUrl(
  tenantSlug: string,
  path: string = "",
  customDomain?: string | null,
  isCustomDomainProp?: boolean
): string {
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  let customDomainActive = isCustomDomainProp;

  // On client side: inspect window.location.hostname dynamically
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase().replace(/^www\./, "");
    const isPlatform =
      host === "vroomdealer.pl" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".vercel.app");

    if (isPlatform) {
      customDomainActive = false;
    } else {
      customDomainActive = true;
    }
  }

  // If customDomainActive is true (i.e. browsing directly on d-car.com.pl)
  if (customDomainActive) {
    return cleanPath || "/";
  }

  // On platform domains (vroomdealer.vercel.app/d-car or localhost:3000/d-car)
  if (cleanPath === "/") {
    return `/${tenantSlug}`;
  }

  return `/${tenantSlug}${cleanPath}`;
}
