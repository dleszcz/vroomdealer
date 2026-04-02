-- ============================================================
-- VroomDealer.pl — Supabase Database Schema
-- Run this SQL in Supabase Dashboard > SQL Editor
-- ============================================================

-- Profile handlarzy (Dealers)
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,          -- np. 'komis-maciek' (używane w URL)
  business_name text NOT NULL,        -- Nazwa widoczna na stronie
  business_description text,          -- Opis firmy
  logo_url text,                      -- URL logo
  pixel_id text,                      -- Meta Pixel ID
  whatsapp_number text,               -- Numer WhatsApp (format: 48123456789)
  contact_phone text,                 -- Numer telefonu do dzwonienia
  address text,                       -- Adres ulicy
  city text,                          -- Miasto
  has_towing boolean DEFAULT false,   -- Sekcja "Laweta"
  has_buying boolean DEFAULT false,   -- Sekcja "Skup aut"
  created_at timestamptz DEFAULT now()
);

-- Ogłoszenia (Cars)
CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  slug text NOT NULL,                 -- np. 'bmw-320d-xdrive-2019-diesel' (używane w URL)
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

-- Indeksy dla wydajności
CREATE INDEX idx_cars_profile ON cars(profile_id);
CREATE INDEX idx_cars_not_sold ON cars(profile_id) WHERE is_sold = false;
CREATE INDEX idx_profiles_slug ON profiles(slug);

-- ============================================================
-- Row Level Security (RLS) — publiczny dostęp do odczytu
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Pozwól na odczyt publiczny (anonimowy)
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Cars are publicly readable"
  ON cars FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- Opcjonalnie: przykładowe dane testowe
-- ============================================================
-- INSERT INTO profiles (slug, business_name, business_description, whatsapp_number, phone_number, address, city, has_towing, has_buying)
-- VALUES (
--   'komis-maciek',
--   'Auto Komis Maciek',
--   'Sprawdzony komis samochodowy w Krakowie.',
--   '48123456789',
--   '+48 123 456 789',
--   'ul. Krakowska 123',
--   'Kraków',
--   true,
--   true
-- );
