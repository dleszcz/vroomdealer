import { Profile, Car } from "@/types/database";

// ============================================================
// SEED DATA — used for development before Supabase is connected
// ============================================================

export const seedProfile: Profile = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  slug: "komis-maciek",
  business_name: "Auto Komis Maciek",
  business_description:
    "Sprawdzony komis samochodowy w Krakowie. Oferujemy samochody osobowe i dostawcze z gwarancją. Każde auto przechodzi szczegółową kontrolę techniczną przed sprzedażą.",
  logo_url: null,
  pixel_id: null,
  whatsapp_number: "48123456789",
  phone_number: "+48 123 456 789",
  address: "ul. Krakowska 123",
  city: "Kraków",
  has_towing: true,
  has_buying: true,
  created_at: new Date().toISOString(),
};

export const seedCars: Car[] = [
  {
    id: "car-001",
    profile_id: seedProfile.id,
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
      "BMW 320d xDrive w doskonałym stanie technicznym i wizualnym. Samochód serwisowany w ASO, bezwypadkowy. Wyposażenie: skórzana tapicerka, nawigacja, kamera cofania, podgrzewane fotele, LED, asystent pasa ruchu. Komplet opon zimowych na alufelgach w cenie.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520050206757-80cc65483542?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-002",
    profile_id: seedProfile.id,
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
      "Volkswagen Golf VIII w wersji Style. Pierwszy właściciel, serwisowany w ASO. Wyposażenie premium: Digital Cockpit Pro, nawigacja Discover Pro, LED Matrix, ACC, Lane Assist, podgrzewane fotele.",
    images: [
      "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&h=600&fit=crop",
    ],
    is_sold: false,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "car-003",
    profile_id: seedProfile.id,
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
      "Toyota Corolla Hybrid — niezawodny i ekonomiczny samochód. Średnie spalanie w mieście poniżej 5l/100km. Bogata wersja wyposażenia Comfort: kamera cofania, czujniki parkowania, Toyota Safety Sense.",
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
    profile_id: seedProfile.id,
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
      "Audi A4 Avant w wersji Sport. Zadbany, regularnie serwisowany. Wyposażenie: Virtual Cockpit, MMI Navigation Plus, skóra, 3-strefowa klimatyzacja, podgrzewane fotele, elektryczna klapa bagażnika.",
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
      "Mercedes-Benz C 200 sedan, pakiet AMG Line. Stan idealny, zero korozji. Pełna historia serwisowa w ASO. MBUX, Burmester, panoramiczny dach, kamera 360°, Multibeam LED.",
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

const USE_SEED = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

export async function getProfile(slug: string): Promise<Profile | null> {
  if (USE_SEED) {
    return seedProfile.slug === slug ? seedProfile : null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getCars(profileId: string): Promise<Car[]> {
  if (USE_SEED) {
    return seedCars.filter((c) => c.profile_id === profileId);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("profile_id", profileId)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCar(carSlug: string): Promise<Car | null> {
  if (USE_SEED) {
    return seedCars.find((c) => c.slug === carSlug) || seedCars.find((c) => c.id === carSlug) || null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", carSlug)
    .single();
  return data;
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (USE_SEED) {
    return [seedProfile];
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*");
  return data ?? [];
}

export async function getAllCars(): Promise<Car[]> {
  if (USE_SEED) {
    return seedCars;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("is_sold", false);
  return data ?? [];
}
