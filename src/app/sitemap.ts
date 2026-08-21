import type { MetadataRoute } from "next";
import { getAllProfiles, getCars } from "@/lib/data";
import { profileToTenant } from "@/lib/tenant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl";
  const rawProfiles = await getAllProfiles();
  const profiles = rawProfiles.filter(
    (p) => (p as unknown as { is_published?: boolean }).is_published !== false
  );

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const dealerPages: MetadataRoute.Sitemap = profiles.map((profile) => {
    const tenantUrl = profile.custom_domain
      ? `https://${profile.custom_domain}`
      : `${baseUrl}/${profile.slug}`;

    return {
      url: tenantUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    };
  });

  // Local SEO pages (only enabled & indexable)
  const localSeoPages: MetadataRoute.Sitemap = [];
  for (const profile of profiles) {
    const tenant = profileToTenant(profile);
    const tenantBaseUrl = tenant.customDomain
      ? `https://${tenant.customDomain}`
      : `${baseUrl}/${tenant.slug}`;

    if (tenant.localSeo?.localPages) {
      for (const localPage of tenant.localSeo.localPages) {
        if (localPage.enabled && localPage.indexable) {
          localSeoPages.push({
            url: `${tenantBaseUrl}/${localPage.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.85,
          });
        }
      }
    }
  }

  // Car pages
  const carPages: MetadataRoute.Sitemap = [];
  for (const profile of profiles) {
    const cars = await getCars(profile.id);
    const tenantBaseUrl = profile.custom_domain
      ? `https://${profile.custom_domain}`
      : `${baseUrl}/${profile.slug}`;

    for (const car of cars) {
      if (!car.is_sold) {
        carPages.push({
          url: `${tenantBaseUrl}/${car.slug}`,
          lastModified: new Date(car.created_at),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        });
      }
    }
  }

  return [...staticPages, ...dealerPages, ...localSeoPages, ...carPages];
}
