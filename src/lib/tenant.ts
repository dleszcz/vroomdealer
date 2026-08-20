import { Profile } from "@/types/database";
import { DealerTenant } from "@/types/landing";
import { getProfile, getAllProfiles, seedProfileDCar } from "@/lib/data";
import {
  mergeBranding,
  mergeServices,
  mergePageConfig,
  mergeLocalSeo,
  mergeBusinessRules,
} from "@/lib/defaults";

export function profileToTenant(profile: Profile): DealerTenant {
  const brandingRaw = profile.branding as Record<string, unknown> | undefined;

  // Build services: merge tenant config with validated defaults
  const services = mergeServices(
    profile.services && Array.isArray(profile.services) && profile.services.length > 0
      ? profile.services
      : null
  );

  // Build branding: merge tenant config with validated defaults
  const branding = mergeBranding(brandingRaw as Parameters<typeof mergeBranding>[0]);

  // Build page config
  const pageConfig = mergePageConfig(
    profile.page_config as Record<string, unknown> | undefined
  );

  // Build local SEO config
  const localSeo =
    profile.slug === "d-car" && seedProfileDCar.local_seo
      ? mergeLocalSeo(seedProfileDCar.local_seo as Record<string, unknown>)
      : mergeLocalSeo(profile.local_seo as Record<string, unknown> | undefined);

  // Build business rules
  const businessRules = mergeBusinessRules(profile.business_rules as Record<string, unknown> | undefined);

  return {
    id: profile.id,
    slug: profile.slug,
    customDomain: profile.custom_domain || null,
    businessName: profile.business_name,
    businessDescription: profile.business_description || null,
    logoUrl: profile.logo_url || branding.logoUrl || null,
    contact: {
      phone: profile.contact_phone || null,
      whatsapp: profile.whatsapp_number || null,
      email: (brandingRaw?.contactEmail as string) || null,
      facebook: (profile as unknown as Record<string, unknown>).facebook_url as string || (brandingRaw?.facebook as string) || ((seedProfileDCar.branding as Record<string, unknown>)?.facebook as string) || null,
      instagram: (profile as unknown as Record<string, unknown>).instagram_url as string || (brandingRaw?.instagram as string) || ((seedProfileDCar.branding as Record<string, unknown>)?.instagram as string) || null,
      tiktok: (profile as unknown as Record<string, unknown>).tiktok_url as string || (brandingRaw?.tiktok as string) || ((seedProfileDCar.branding as Record<string, unknown>)?.tiktok as string) || null,
      youtube: (profile as unknown as Record<string, unknown>).youtube_url as string || (brandingRaw?.youtube as string) || ((seedProfileDCar.branding as Record<string, unknown>)?.youtube as string) || null,
    },
    location: {
      address: profile.address || null,
      city: profile.city || null,
      postalCode: profile.postal_code || localSeo?.primaryLocation?.postalCode || null,
      county: profile.county || localSeo?.primaryLocation?.county || null,
      region: profile.region || localSeo?.primaryLocation?.region || null,
    },
    branding,
    services,
    pageConfig,
    analytics: (profile.analytics as unknown as DealerTenant["analytics"]) || {
      pixelId: profile.pixel_id || null,
    },
    seo: (profile.seo as unknown as DealerTenant["seo"]) || {
      metaTitle: `${profile.business_name} - Samochody i skup aut`,
      metaDescription: profile.business_description || undefined,
    },
    localSeo,
    businessRules,
  };
}



export async function resolveTenant(identifier: {
  slug?: string;
  domain?: string;
}): Promise<DealerTenant | null> {
  const { slug, domain } = identifier;

  // 1. If domain is supplied and not standard domain, attempt domain resolution
  if (domain && !domain.includes("localhost") && !domain.includes("vroomdealer.pl") && !domain.includes("vercel.app")) {
    const allProfiles = await getAllProfiles();
    const matchedProfile = allProfiles.find(
      (p) => p.custom_domain === domain || p.slug === domain.replace(".com.pl", "").replace(".pl", "")
    );
    if (matchedProfile) {
      return profileToTenant(matchedProfile);
    }
  }

  // 2. Resolve by slug
  if (!slug) {
    return null;
  }

  const profile = await getProfile(slug);
  return profile ? profileToTenant(profile) : null;
}
