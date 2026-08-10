-- ============================================================
-- VroomDealer.pl — Supabase Database Schema v1.0
-- Run this SQL in Supabase Dashboard > SQL Editor
-- ============================================================

-- Profile handlarzy (Dealers / Tenants)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,          -- np. 'd-car' lub 'komis-maciek' (używane w URL)
  custom_domain text UNIQUE,          -- np. 'd-car.com.pl'
  business_name text NOT NULL,        -- Nazwa widoczna na stronie
  business_description text,          -- Opis firmy
  logo_url text,                      -- URL logo
  pixel_id text,                      -- Meta Pixel ID
  whatsapp_number text,               -- Numer WhatsApp (format: 48123456789)
  contact_phone text,                 -- Numer telefonu do dzwonienia
  address text,                       -- Adres ulicy
  city text,                          -- Miasto
  has_towing boolean DEFAULT false,   -- Sekcja "Laweta" (kompatybilność wsteczna)
  has_buying boolean DEFAULT false,   -- Sekcja "Skup aut" (kompatybilność wsteczna)
  branding jsonb,                     -- Konfiguracja kolorów, mediów, logo
  services jsonb,                     -- Kolekcja usług DealerService[]
  page_config jsonb,                  -- Konfiguracja sekcji LandingPageConfig
  seo jsonb,                          -- Tytuły i opisy meta
  analytics jsonb,                    -- Identyfikatory analityczne
  created_at timestamptz DEFAULT now()
);

-- Ogłoszenia (Cars)
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  slug text NOT NULL,                 -- np. 'bmw-320d-xdrive-2019-diesel'
  make text NOT NULL,                 -- Marka (BMW, Audi, etc.)
  model text NOT NULL,                -- Model (320d, A4, etc.)
  year int,                           -- Rocznik
  price int,                          -- Cena w PLN
  mileage int,                        -- Przebieg w km
  fuel_type text,                     -- benzyna/diesel/LPG/elektryczny/hybryda
  engine_capacity text,               -- np. "2.0 TDI 190KM"
  transmission text,                  -- manualna/automatyczna
  color text,                         -- Kolor
  description text,                   -- Opis techniczny
  images text[],                      -- Tablica URL-i do zdjęć
  is_sold boolean DEFAULT false,      -- Czy sprzedane
  is_featured boolean DEFAULT false,  -- Czy wyróżnione
  created_at timestamptz DEFAULT now()
);

-- Zgłoszenia i Wyceny (Leads)
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  source text NOT NULL DEFAULT 'landing_form',
  campaign text,
  landing_path text,
  customer_name text,
  customer_phone text NOT NULL,
  customer_email text,
  vehicle_details jsonb,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_cars_profile ON cars(profile_id);
CREATE INDEX IF NOT EXISTS idx_cars_not_sold ON cars(profile_id) WHERE is_sold = false;
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_domain ON profiles(custom_domain);
CREATE INDEX IF NOT EXISTS idx_leads_dealer ON leads(dealer_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Odczyt publiczny profili i aut
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Cars are publicly readable"
  ON cars FOR SELECT
  TO anon
  USING (true);

-- Tworzenie leadów przez publicznych użytkowników
CREATE POLICY "Leads can be created publicly"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);
