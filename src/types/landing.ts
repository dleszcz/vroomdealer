export type ServiceType =
  | "car_buying"
  | "car_sales"
  | "towing"
  | "roadside_assistance"
  | "car_import"
  | "car_transport"
  | "financing"
  | "trade_in";

export interface DealerService {
  id: string;
  type: ServiceType;
  enabled: boolean;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaType?: "phone" | "whatsapp" | "lead_form" | "link";
  ctaValue?: string;
}

export interface DealerBranding {
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  faviconUrl?: string | null;
  colors: {
    primary: string;
    primaryForeground: string;
    background: string;
    foreground: string;
    accent: string;
    accentForeground: string;
    surface?: string;
    muted?: string;
    headerBg?: string;
    footerBg?: string;
  };
  media?: {
    heroImageUrl?: string;
    heroMobileImageUrl?: string;
    ogImageUrl?: string;
  };
}


export interface HeroConfig {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  primaryCta?: { label?: string; sublabel?: string; href?: string };
  secondaryCta?: { label?: string; sublabel?: string; href?: string };
  benefits?: { label: string; icon?: "cash" | "check" | "truck" | "scale" }[];
  showAccent?: boolean;
}
export type SectionType =
  | "hero"
  | "services"
  | "trust"
  | "process"
  | "vehicles"
  | "reviews"
  | "about"
  | "faq"
  | "lead_form"
  | "map"
  | "contact";

export interface SectionConfig {
  id: string;
  type: SectionType;
  variant?: string;
  enabled: boolean;
  title?: string;
  subtitle?: string;
  data?: Record<string, unknown>;
}

export interface LandingPageConfig {
  sections: SectionConfig[];
}

export interface DealerTenant {
  id: string;
  slug: string;
  customDomain?: string | null;
  businessName: string;
  businessDescription?: string | null;
  logoUrl?: string | null;
  contact: {
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
  };
  location?: {
    address?: string | null;
    city?: string | null;
    mapCoordinates?: { lat: number; lng: number };
  };
  branding: DealerBranding;
  services: DealerService[];
  pageConfig: LandingPageConfig;
  analytics?: {
    pixelId?: string | null;
    googleAnalyticsId?: string | null;
  };
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
}

export interface Lead {
  id?: string;
  dealerId: string;
  source: string;
  campaign?: string;
  landingPath: string;
  customerName?: string;
  customerPhone: string;
  customerEmail?: string;
  vehicleDetails?: {
    make?: string;
    model?: string;
    year?: number;
    expectedPrice?: number;
    description?: string;
  };
  status: "new" | "contacted" | "qualified" | "offer_made" | "purchased" | "rejected";
  createdAt?: string;
}
