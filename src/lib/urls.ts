/**
 * Returns a clean relative URL path for a tenant route.
 * On custom domain (e.g. custom domain page): returns clean path like "/skup-aut", "/samochody", "/polityka-prywatnosci"
 * On platform domain (e.g. vroomdealer.pl): returns "/[dealerSlug]/skup-aut", "/[dealerSlug]/samochody"
 */
export function getTenantUrl(
  tenantSlug: string,
  path: string = "",
  customDomain?: string | null,
  isCustomDomainProp?: boolean
): string {
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  let customDomainActive = isCustomDomainProp;

  // If customDomain is provided (e.g. "d-car.com.pl"), default to true unless explicitly false or in platform mode
  if (customDomainActive === undefined && customDomain) {
    customDomainActive = true;
  }

  if (customDomainActive === undefined && typeof window !== "undefined") {
    const host = window.location.hostname.replace(/^www\./, "");
    const isPlatform =
      host === "vroomdealer.pl" ||
      host === "localhost" ||
      host.endsWith(".vercel.app");

    if (!isPlatform) {
      customDomainActive = true;
    } else if (customDomain && host === customDomain.replace(/^www\./, "")) {
      customDomainActive = true;
    }
  }

  if (customDomainActive) {
    return cleanPath;
  }

  if (cleanPath === "/") {
    return `/${tenantSlug}`;
  }

  return `/${tenantSlug}${cleanPath}`;
}
