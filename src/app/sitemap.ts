import type { MetadataRoute } from "next";
import { getAllProfiles, getCars } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl";
  const profiles = await getAllProfiles();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const dealerPages: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: `${baseUrl}/${profile.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const carPages: MetadataRoute.Sitemap = [];
  for (const profile of profiles) {
    const cars = await getCars(profile.id);
    for (const car of cars) {
      if (!car.is_sold) {
        carPages.push({
          url: `${baseUrl}/${profile.slug}/${car.slug}`,
          lastModified: new Date(car.created_at),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  return [...staticPages, ...dealerPages, ...carPages];
}
