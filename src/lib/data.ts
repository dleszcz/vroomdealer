import { Profile, Car } from "@/types/database";

// ============================================================
// SEED DATA — used for development before Supabase is connected
// ============================================================

export const seedProfileDCar: Profile = {
  id: "dcar-0000-41d4-a716-446655440001",
  slug: "d-car",
  custom_domain: "d-car.com.pl",
  business_name: "D-Car",
  business_description:
    "Prywatny komis samochodowy i profesjonalny skup aut w Warszawie. Bezpłatna wycena, natychmiastowa wypłata gotówki oraz auta z gwarancją.",
  logo_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop",
  pixel_id: "1636959447346992",
  whatsapp_number: "48609525935",
  contact_phone: "+48 609 525 935",
  address: "ul. Wycenowa 10",
  city: "Warszawa",
  branding: {
    logoUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop",
    colors: {
      primary: "#1e293b",
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#0f172a",
      accent: "#25d366",
      accentForeground: "#ffffff",
      surface: "#f8fafc",
      muted: "#f1f5f9",
    },
    media: {
      heroImageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&h=800&fit=crop",
    },
  },
  services: [
    {
      id: "srv-buying",
      type: "car_buying",
      enabled: true,
      title: "Skup Samochodów Za Gotówkę",
      description: "Kupujemy auta w każdym stanie — bezpłatny dojazd, wycena w 15 minut i gotówka od ręki.",
      ctaLabel: "Wyceń swoje auto",
      ctaType: "lead_form",
    },
    {
      id: "srv-sales",
      type: "car_sales",
      enabled: true,
      title: "Sprzedaż Aut z Gwarancją",
      description: "Pewne samochody osobowe sprawdzone technicznie. Raport historii pojazdu w cenie.",
      ctaLabel: "Przeglądaj ofertę",
      ctaType: "link",
      ctaValue: "#vehicles",
    },
    {
      id: "srv-towing",
      type: "towing",
      enabled: true,
      title: "Pomoc Drogowa & Laweta 24/7",
      description: "Transport awaryjny i powypadkowy na terenie Warszawy i całej Polski.",
      ctaLabel: "Zadzwoń po pomoc",
      ctaType: "phone",
      ctaValue: "+48 609 525 935",
    },
  ],
  page_config: {
    sections: [
      { id: "sec-hero", type: "hero", enabled: true },
      { id: "sec-lead", type: "lead_form", enabled: true, title: "Szybka wycena auta" },
      { id: "sec-trust", type: "trust", enabled: true, title: "Dlaczego D-Car?" },
      { id: "sec-services", type: "services", enabled: true, title: "Nasze Usługi" },
      { id: "sec-process", type: "process", enabled: true, title: "Jak wygląda skup?" },
      { id: "sec-vehicles", type: "vehicles", enabled: true, title: "Ostatnio kupione i Dostępne Auta" },
      { id: "sec-reviews", type: "reviews", enabled: true, title: "Opinie klientów" },
      { id: "sec-faq", type: "faq", enabled: true, title: "Pytania i Odpowiedzi" },
      { id: "sec-contact", type: "contact", enabled: true, title: "Skontaktuj się z nami" },
    ],
  },
  created_at: new Date().toISOString(),
};

export const seedProfile: Profile = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  slug: "komis-maciek",
  business_name: "Auto Komis Maciek",
  business_description:
    "Sprawdzony komis samochodowy w Krakowie. Oferujemy samochody osobowe i dostawcze z gwarancją. Każde auto przechodzi szczegółową kontrolę techniczną przed sprzedażą.",
  logo_url: null,
  pixel_id: "1636959447346992",
  whatsapp_number: "48123456789",
  contact_phone: "+48 123 456 789",
  address: "ul. Krakowska 123",
  city: "Kraków",
  created_at: new Date().toISOString(),
};

export const allSeedProfiles: Profile[] = [seedProfileDCar, seedProfile];

export const seedCars: Car[] = [
  {
    id: "car-001",
    profile_id: seedProfileDCar.id,
    slug: "bmw-320d-xdrive-2019-diesel",
    make: "BMW",
    model: "320d xDrive",
    year: 2019,
    price: 89000,
    mileage: 145000,
    fuel_type: "Diesel",
    engine_capacity: "2.0 TDI 190KM",
    transmission: "Automatyczna",
    color: "Czarny Metalik",
    description:
      "BMW 320d xDrive w doskonałym stanie technicznym i wizualnym. Samochód serwisowany w ASO, bezwypadkowy. Wyposażenie: skórzana tapicerka, nawigacja, kamera cofania, podgrzewane fotele, LED, asystent pasa ruchu.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-002",
    profile_id: seedProfileDCar.id,
    slug: "volkswagen-golf-viii-2021-benzyna",
    make: "Volkswagen",
    model: "Golf VIII",
    year: 2021,
    price: 95000,
    mileage: 67000,
    fuel_type: "Benzyna",
    engine_capacity: "1.5 TSI 150KM",
    transmission: "Manualna",
    color: "Biały",
    description:
      "Volkswagen Golf VIII w wersji Style. Pierwszy właściciel, serwisowany w ASO. Wyposażenie premium: Digital Cockpit Pro, nawigacja Discover Pro, LED Matrix, ACC, Lane Assist.",
    images: [
      "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-003",
    profile_id: seedProfileDCar.id,
    slug: "toyota-corolla-2020-hybryda",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    price: 72000,
    mileage: 89000,
    fuel_type: "Hybryda",
    engine_capacity: "1.8 Hybrid 122KM",
    transmission: "Automatyczna (CVT)",
    color: "Szary Metalik",
    description:
      "Toyota Corolla Hybrid — niezawodny i ekonomiczny samochód. Średnie spalanie w mieście poniżej 5l/100km.",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&h=600&fit=crop",
    ],
    is_sold: false,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-004",
    profile_id: seedProfileDCar.id,
    slug: "audi-a4-avant-2018-diesel",
    make: "Audi",
    model: "A4 Avant",
    year: 2018,
    price: 78000,
    mileage: 178000,
    fuel_type: "Diesel",
    engine_capacity: "2.0 TDI 150KM",
    transmission: "Automatyczna (S-Tronic)",
    color: "Granatowy Metalik",
    description:
      "Audi A4 Avant w wersji Sport. Zadbany, regularnie serwisowany.",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop",
    ],
    is_sold: true,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-005",
    profile_id: seedProfile.id,
    slug: "mercedes-benz-c-200-2020-benzyna",
    make: "Mercedes-Benz",
    model: "C 200",
    year: 2020,
    price: 119000,
    mileage: 95000,
    fuel_type: "Benzyna",
    engine_capacity: "1.5 Turbo 204KM",
    transmission: "Automatyczna (9G-Tronic)",
    color: "Srebrny Metalik",
    description:
      "Mercedes-Benz C 200 sedan, pakiet AMG Line. Stan idealny, zero korozji.",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
];

// ============================================================
// Data fetching functions — use seed data or Supabase
// ============================================================

const USE_SEED =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export async function getProfile(slug: string): Promise<Profile | null> {
  if (USE_SEED) {
    const found = allSeedProfiles.find((p) => p.slug === slug);
    return found || (slug === "komis-maciek" ? seedProfile : seedProfileDCar);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      const found = allSeedProfiles.find((p) => p.slug === slug);
      return found || seedProfileDCar;
    }
    return data;
  } catch {
    const found = allSeedProfiles.find((p) => p.slug === slug);
    return found || seedProfileDCar;
  }
}

export async function getCars(profileId: string): Promise<Car[]> {
  if (USE_SEED) {
    const matched = seedCars.filter((c) => c.profile_id === profileId);
    return matched.length > 0 ? matched : seedCars;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("profile_id", profileId)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (!data || data.length === 0) {
      return seedCars;
    }
    return data;
  } catch {
    return seedCars;
  }
}

export async function getCar(carSlug: string): Promise<Car | null> {
  if (USE_SEED) {
    return seedCars.find((c) => c.slug === carSlug) || seedCars.find((c) => c.id === carSlug) || null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("slug", carSlug)
      .single();

    if (!data) {
      return seedCars.find((c) => c.slug === carSlug) || seedCars.find((c) => c.id === carSlug) || null;
    }
    return data;
  } catch {
    return seedCars.find((c) => c.slug === carSlug) || seedCars.find((c) => c.id === carSlug) || null;
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (USE_SEED) {
    return allSeedProfiles;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*");

    if (!data || data.length === 0) {
      return allSeedProfiles;
    }
    return data;
  } catch {
    return allSeedProfiles;
  }
}

export async function getAllCars(): Promise<Car[]> {
  if (USE_SEED) {
    return seedCars;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("cars")
      .select("*")
      .eq("is_sold", false);

    if (!data || data.length === 0) {
      return seedCars;
    }
    return data;
  } catch {
    return seedCars;
  }
}
