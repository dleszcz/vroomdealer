import { DealerBranding, DealerService, LandingPageConfig, SectionConfig } from "@/types/landing";

// ============================================================
// DEFAULT VALUES — used when tenant config is missing or invalid
// ============================================================

export const DEFAULT_COLORS: DealerBranding["colors"] = {
  primary: "#1686E0",
  primaryForeground: "#ffffff",
  background: "#ffffff",
  foreground: "#090B0B",
  accent: "#1686E0",
  accentForeground: "#ffffff",
  surface: "#F1F3F5",
  muted: "#E2E8F0",
  headerBg: "#080808",
  footerBg: "#080808",
};

export const DEFAULT_BRANDING: DealerBranding = {
  logoUrl: null,
  logoDarkUrl: null,
  faviconUrl: null,
  colors: DEFAULT_COLORS,
};

export const DEFAULT_SERVICES: DealerService[] = [
  {
    id: "srv-sales",
    type: "car_sales",
    enabled: true,
    title: "Sprzedaż Samochodów Używanych",
    description: "Sprawdzone samochody osobowe i dostawcze z gwarancją jakości.",
    ctaLabel: "Zobacz naszą ofertę",
    ctaType: "link",
    ctaValue: "#vehicles",
  },
];

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "sec-hero", type: "hero", enabled: true, title: "Sprzedaj nam swoje auto" },
  { id: "sec-value-props", type: "trust", enabled: true, title: "Dlaczego warto nam zaufać" },
  { id: "sec-process", type: "process", enabled: true, title: "Jak to działa?" },
  { id: "sec-services", type: "services", enabled: true, title: "Nasza oferta" },
  { id: "sec-trust", type: "reviews", enabled: true, title: "Dlaczego warto nam zaufać?" },
  { id: "sec-vehicles", type: "vehicles", enabled: true, title: "Aktualna oferta samochodów" },
  { id: "sec-about", type: "about", enabled: true, title: "O nas" },
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
    headerBg: isValidHexColor(tenantColors.headerBg) ? tenantColors.headerBg : DEFAULT_COLORS.headerBg,
    footerBg: isValidHexColor(tenantColors.footerBg) ? tenantColors.footerBg : DEFAULT_COLORS.footerBg,
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

/** Validates and returns services array, returning empty array if no services are configured */
export function mergeServices(
  tenantServices?: unknown[] | null
): DealerService[] {
  if (!Array.isArray(tenantServices) || tenantServices.length === 0) {
    return [];
  }

  // Validate each service has required fields
  return tenantServices.filter((s): s is DealerService => {
    if (!s || typeof s !== "object") return false;
    const svc = s as Record<string, unknown>;
    return typeof svc.id === "string" && typeof svc.type === "string" && typeof svc.title === "string";
  });
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
