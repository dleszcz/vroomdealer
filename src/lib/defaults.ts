import { DealerBranding, DealerService, LandingPageConfig, SectionConfig } from "@/types/landing";

// ============================================================
// DEFAULT VALUES — used when tenant config is missing or invalid
// ============================================================

export const DEFAULT_COLORS: DealerBranding["colors"] = {
  primary: "#1e293b",
  primaryForeground: "#ffffff",
  background: "#ffffff",
  foreground: "#0f172a",
  accent: "#25d366",
  accentForeground: "#ffffff",
  surface: "#f8fafc",
  muted: "#f1f5f9",
};

export const DEFAULT_BRANDING: DealerBranding = {
  logoUrl: null,
  logoDarkUrl: null,
  faviconUrl: null,
  colors: DEFAULT_COLORS,
};

export const DEFAULT_SERVICES: DealerService[] = [
  {
    id: "srv-buying",
    type: "car_buying",
    enabled: true,
    title: "Skup Samochodów",
    description: "Kupujemy auta za gotówkę. Szybka wycena i formalności na miejscu.",
    ctaLabel: "Wyceń swoje auto",
    ctaType: "lead_form",
  },
  {
    id: "srv-sales",
    type: "car_sales",
    enabled: true,
    title: "Sprzedaż Aut",
    description: "Sprawdzone samochody osobowe i dostawcze z gwarancją jakości.",
    ctaLabel: "Zobacz ofertę",
    ctaType: "link",
    ctaValue: "#vehicles",
  },
  {
    id: "srv-towing",
    type: "towing",
    enabled: true,
    title: "Pomoc Drogowa / Laweta",
    description: "Transport aut na terenie całego kraju — 24/7. Szybki dojazd.",
    ctaLabel: "Zadzwoń po pomoc",
    ctaType: "phone",
  },
];

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "sec-hero", type: "hero", enabled: true },
  { id: "sec-lead", type: "lead_form", enabled: true, title: "Darmowa wycena samochodu" },
  { id: "sec-trust", type: "trust", enabled: true, title: "Dlaczego warto nam zaufać" },
  { id: "sec-services", type: "services", enabled: true, title: "Nasze Usługi" },
  { id: "sec-process", type: "process", enabled: true, title: "Prosty proces sprzedaży" },
  { id: "sec-vehicles", type: "vehicles", enabled: true, title: "Aktualna oferta aut" },
  { id: "sec-reviews", type: "reviews", enabled: true, title: "Co mówią nasi klienci" },
  { id: "sec-faq", type: "faq", enabled: true, title: "Najczęściej zadawane pytania" },
  { id: "sec-contact", type: "contact", enabled: true, title: "Kontakt i Lokalizacja" },
];

export const DEFAULT_PAGE_CONFIG: LandingPageConfig = {
  sections: DEFAULT_SECTIONS,
};

// ============================================================
// VALIDATION HELPERS
// ============================================================

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Returns true if the value is a valid hex color string */
export function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_COLOR_REGEX.test(value);
}

/** Merges tenant colors with defaults, using default for any missing/invalid value */
export function mergeColors(
  tenantColors?: Partial<DealerBranding["colors"]> | null
): DealerBranding["colors"] {
  if (!tenantColors || typeof tenantColors !== "object") {
    return { ...DEFAULT_COLORS };
  }

  return {
    primary: isValidHexColor(tenantColors.primary) ? tenantColors.primary : DEFAULT_COLORS.primary,
    primaryForeground: isValidHexColor(tenantColors.primaryForeground) ? tenantColors.primaryForeground : DEFAULT_COLORS.primaryForeground,
    background: isValidHexColor(tenantColors.background) ? tenantColors.background : DEFAULT_COLORS.background,
    foreground: isValidHexColor(tenantColors.foreground) ? tenantColors.foreground : DEFAULT_COLORS.foreground,
    accent: isValidHexColor(tenantColors.accent) ? tenantColors.accent : DEFAULT_COLORS.accent,
    accentForeground: isValidHexColor(tenantColors.accentForeground) ? tenantColors.accentForeground : DEFAULT_COLORS.accentForeground,
    surface: isValidHexColor(tenantColors.surface) ? tenantColors.surface : DEFAULT_COLORS.surface,
    muted: isValidHexColor(tenantColors.muted) ? tenantColors.muted : DEFAULT_COLORS.muted,
  };
}

/** Merges tenant branding with defaults */
export function mergeBranding(
  tenantBranding?: Partial<DealerBranding> | null
): DealerBranding {
  if (!tenantBranding || typeof tenantBranding !== "object") {
    return { ...DEFAULT_BRANDING };
  }

  return {
    logoUrl: typeof tenantBranding.logoUrl === "string" ? tenantBranding.logoUrl : DEFAULT_BRANDING.logoUrl,
    logoDarkUrl: typeof tenantBranding.logoDarkUrl === "string" ? tenantBranding.logoDarkUrl : DEFAULT_BRANDING.logoDarkUrl,
    faviconUrl: typeof tenantBranding.faviconUrl === "string" ? tenantBranding.faviconUrl : DEFAULT_BRANDING.faviconUrl,
    colors: mergeColors(tenantBranding.colors),
    media: tenantBranding.media || DEFAULT_BRANDING.media,
  };
}

/** Validates and returns services array, falling back to defaults */
export function mergeServices(
  tenantServices?: unknown[] | null
): DealerService[] {
  if (!Array.isArray(tenantServices) || tenantServices.length === 0) {
    return [...DEFAULT_SERVICES];
  }

  // Validate each service has required fields
  const validServices = tenantServices.filter((s): s is DealerService => {
    if (!s || typeof s !== "object") return false;
    const svc = s as Record<string, unknown>;
    return typeof svc.id === "string" && typeof svc.type === "string" && typeof svc.title === "string";
  });

  return validServices.length > 0 ? validServices : [...DEFAULT_SERVICES];
}

/** Validates and returns page config, falling back to defaults */
export function mergePageConfig(
  tenantConfig?: Record<string, unknown> | null
): LandingPageConfig {
  if (!tenantConfig || typeof tenantConfig !== "object") {
    return { ...DEFAULT_PAGE_CONFIG };
  }

  const sections = tenantConfig.sections;
  if (!Array.isArray(sections) || sections.length === 0) {
    return { ...DEFAULT_PAGE_CONFIG };
  }

  // Validate each section has required fields
  const validSections = sections.filter((s): s is SectionConfig => {
    if (!s || typeof s !== "object") return false;
    const sec = s as Record<string, unknown>;
    return typeof sec.id === "string" && typeof sec.type === "string";
  });

  return {
    sections: validSections.length > 0 ? validSections : [...DEFAULT_SECTIONS],
  };
}
