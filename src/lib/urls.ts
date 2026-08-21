/**
 * Returns a clean relative URL path for a tenant route.
 * On custom domain (e.g. d-car.com.pl): returns clean path like "/skup-aut", "/samochody", "/polityka-prywatnosci"
 * On platform domain (e.g. vroomdealer.pl): returns "/d-car/skup-aut", "/d-car/samochody"
 */
export function getTenantUrl(
  tenantSlug: string,
  path: string = "",
  customDomain?: string | null,
  isCustomDomainProp?: boolean
): string {
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  let customDomainActive = isCustomDomainProp;
  if (customDomainActive === undefined && typeof window !== "undefined") {
    const host = window.location.hostname.replace(/^www\./, "");
    if (
      customDomain &&
      host === customDomain.replace(/^www\./, "")
    ) {
      customDomainActive = true;
    } else if (host === "d-car.com.pl") {
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
