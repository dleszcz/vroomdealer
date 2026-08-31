import { Profile } from "@/types/database";
import { DealerTenant, DealerBranding } from "@/types/landing";
import { getProfile, getAllProfiles, allSeedProfiles } from "@/lib/data";
import {
  mergeBranding,
  mergeServices,
  mergePageConfig,
  mergeLocalSeo,
  mergeBusinessRules,
} from "@/lib/defaults";

export function profileToTenant(profile: Profile): DealerTenant {
  const seedMatch = allSeedProfiles.find(
    (p) => p.slug === profile.slug || p.id === profile.id
  );
  const seedBrandingRaw = (seedMatch?.branding as Record<string, unknown>) || {};
  const seedColors = (seedBrandingRaw.colors as Record<string, string>) || {};
  const seedMedia = (seedBrandingRaw.media as Record<string, string>) || {};

  const brandingRaw = (profile.branding as Record<string, unknown>) || {};
  const rawColors = (brandingRaw.colors as Record<string, string>) || {};
  const rawMedia = (brandingRaw.media as Record<string, string>) || {};

  // Build colors: DB flat (primaryColor), DB nested (colors.primary), Seed, or Default
  const primaryColor =
    (brandingRaw.primaryColor as string) ||
    rawColors.primary ||
    seedColors.primary ||
    "#1686E0";
  const accentColor =
    (brandingRaw.accentColor as string) ||
    rawColors.accent ||
    seedColors.accent ||
    "#1686E0";

  // Build logo: DB logo_url, DB branding.logoUrl, Seed logo_url, Seed branding.logoUrl
  const logoUrl =
    profile.logo_url ||
    (brandingRaw.logoUrl as string) ||
    seedMatch?.logo_url ||
    (seedBrandingRaw.logoUrl as string) ||
    "/images/dcar-logo.png";

  // Build hero image: DB branding.heroImageUrl, DB branding.media.heroImageUrl, Seed media.heroImageUrl
  const heroImageUrl =
    (brandingRaw.heroImageUrl as string) ||
    rawMedia.heroImageUrl ||
    seedMedia.heroImageUrl ||
    "/images/dcar-hero.png";

  // Build services
  const services = mergeServices(
    profile.services && Array.isArray(profile.services) && profile.services.length > 0
      ? profile.services
      : seedMatch?.services && Array.isArray(seedMatch.services) && seedMatch.services.length > 0
      ? seedMatch.services
      : null
  );

  // Build page config
  const pageConfig = mergePageConfig(
    (profile.page_config as Record<string, unknown> | undefined) ||
    (seedMatch?.page_config as Record<string, unknown> | undefined)
  );

  // Build local SEO config
  const localSeo = mergeLocalSeo(
    (profile.local_seo as Record<string, unknown> | undefined) ||
    (seedMatch?.local_seo as Record<string, unknown> | undefined)
  );

  // Build business rules
  const businessRules = mergeBusinessRules(
    (profile.business_rules as Record<string, unknown> | undefined) ||
    (seedMatch?.business_rules as Record<string, unknown> | undefined)
  );

  // Effective location: for d-car, enforce Topólka and Paniewo 3A
  const isDCarFix = profile.slug === "d-car" && (profile.city === "Warszawa" || !profile.city);
  const city = isDCarFix ? (seedMatch?.city || "Topólka") : (profile.city || seedMatch?.city || null);
  const address = isDCarFix ? (seedMatch?.address || "Paniewo 3A") : (profile.address || seedMatch?.address || null);
  const phone = isDCarFix ? (seedMatch?.contact_phone || "+48 530 826 501") : (profile.contact_phone || seedMatch?.contact_phone || null);
  const whatsapp = isDCarFix ? (seedMatch?.whatsapp_number || "48530826501") : (profile.whatsapp_number || seedMatch?.whatsapp_number || null);

  const branding: DealerBranding = {
    logoUrl,
    logoDarkUrl: (brandingRaw.logoDarkUrl as string) || (seedBrandingRaw.logoDarkUrl as string) || null,
    faviconUrl: (brandingRaw.faviconUrl as string) || (seedBrandingRaw.faviconUrl as string) || null,
    colors: {
      primary: primaryColor,
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#090B0B",
      accent: accentColor,
      accentForeground: "#ffffff",
      surface: "#F1F3F5",
      muted: "#E2E8F0",
      headerBg: "#080808",
      footerBg: "#080808",
    },
    media: {
      heroImageUrl,
    },
  };

  return {
    id: profile.id,
    slug: profile.slug,
    customDomain: profile.custom_domain || (profile.slug === "d-car" ? "d-car.com.pl" : null),
    businessName: isDCarFix ? "D-CAR / Dawid Woźniak" : profile.business_name,
    businessDescription: profile.business_description || seedMatch?.business_description || null,
    logoUrl,
    contact: {
      phone,
      whatsapp,
      email: (brandingRaw.contactEmail as string) || profile.notification_email || (profile.slug === "d-car" ? "dawid@d-car.com.pl" : null),
      facebook: (profile as unknown as Record<string, unknown>).facebook_url as string || (brandingRaw.facebook as string) || (seedBrandingRaw.facebook as string) || "https://www.facebook.com/profile.php?id=100068379260209",
    },
    location: {
      address,
      city,
      postalCode: (isDCarFix ? "87-875" : profile.postal_code) || localSeo?.primaryLocation?.postalCode || "87-875",
      county: profile.county || localSeo?.primaryLocation?.county || "radziejowski",
      region: profile.region || localSeo?.primaryLocation?.region || "kujawsko-pomorskie",
    },
    branding,
    services,
    pageConfig,
    analytics: (profile.analytics as unknown as DealerTenant["analytics"]) || {
      pixelId: profile.pixel_id || "1636959447346992",
    },
    seo: (profile.seo as unknown as DealerTenant["seo"]) || {
      metaTitle: `${profile.business_name} - Skup aut i sprzedaż samochodów`,
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
  if (!slug || slug === "superadmin" || slug === "admin") {
    return null;
  }

  const profile = await getProfile(slug);
  if (!profile || profile.is_super_admin) {
    return null;
  }

  return profileToTenant(profile);
}
