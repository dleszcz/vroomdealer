import { Profile } from "@/types/database";
import { DealerTenant } from "@/types/landing";
import { getProfile, getAllProfiles } from "@/lib/data";
import {
  mergeBranding,
  mergeServices,
  mergePageConfig,
  DEFAULT_SERVICES,
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

  // Ensure D-Car tenant branding defaults match visual design spec
  if (profile.slug === "d-car") {
    branding.media = { ...branding.media, heroImageUrl: "/images/dcar-hero.png" };
    branding.logoUrl = "/images/dcar-logo.png";
    branding.colors = {
      ...branding.colors,
      headerBg: "#080808",
      footerBg: "#080808",
      primary: "#1686E0",
      surface: "#F1F3F5",
    };
  }

  // Build page config
  const pageConfig = mergePageConfig(
    profile.page_config as Record<string, unknown> | undefined
  );

  if (profile.slug === "d-car" && pageConfig?.sections) {
    pageConfig.sections = pageConfig.sections.map((sec) => {
      if (sec.type === "hero") {
        const secData = (sec.data || {}) as Record<string, unknown>;
        return { ...sec, data: { ...secData, image: "/images/dcar-hero.png" } };
      }
      return sec;
    });
  }

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
    },
    location: {
      address: profile.address || null,
      city: profile.city || null,
    },
    branding,
    services,
    pageConfig,
    analytics: (profile.analytics as unknown as DealerTenant["analytics"]) || {
      pixelId: profile.pixel_id || null,
    },
    seo: (profile.seo as unknown as DealerTenant["seo"]) || {
      metaTitle: `${profile.business_name} — Samochody i skup aut`,
      metaDescription: profile.business_description || undefined,
    },
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
