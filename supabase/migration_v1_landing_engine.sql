-- ============================================================
-- VroomDealer.pl — Migration: Landing Engine v1.0
-- Run this SQL in Supabase Dashboard > SQL Editor
-- Adds new columns to profiles and creates leads table
-- ============================================================

-- 1. Add new columns to profiles (safe: IF NOT EXISTS via DO block)
DO $$
BEGIN
  -- custom_domain
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'custom_domain'
  ) THEN
    ALTER TABLE profiles ADD COLUMN custom_domain text UNIQUE;
  END IF;

  -- branding (jsonb)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'branding'
  ) THEN
    ALTER TABLE profiles ADD COLUMN branding jsonb;
  END IF;

  -- services (jsonb)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'services'
  ) THEN
    ALTER TABLE profiles ADD COLUMN services jsonb;
  END IF;

  -- page_config (jsonb)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'page_config'
  ) THEN
    ALTER TABLE profiles ADD COLUMN page_config jsonb;
  END IF;

  -- seo (jsonb)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'seo'
  ) THEN
    ALTER TABLE profiles ADD COLUMN seo jsonb;
  END IF;

  -- analytics (jsonb)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'analytics'
  ) THEN
    ALTER TABLE profiles ADD COLUMN analytics jsonb;
  END IF;
END $$;

-- 2. Index on custom_domain
CREATE INDEX IF NOT EXISTS idx_profiles_custom_domain ON profiles(custom_domain);

-- 3. Create leads table
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

CREATE INDEX IF NOT EXISTS idx_leads_dealer ON leads(dealer_id);

-- 4. RLS for leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert (lead forms)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Leads can be created publicly'
  ) THEN
    CREATE POLICY "Leads can be created publicly"
      ON leads FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- 5. Insert D-Car (Tenant Testowy #1: Pełna personalizacja z własną domeną)
INSERT INTO profiles (
  slug,
  custom_domain,
  business_name,
  business_description,
  logo_url,
  pixel_id,
  whatsapp_number,
  contact_phone,
  address,
  city,
  branding,
  services,
  page_config
) VALUES (
  'd-car',
  'd-car.com.pl',
  'D-Car',
  'Prywatny komis samochodowy i profesjonalny skup aut w Warszawie. Bezpłatna wycena, natychmiastowa wypłata gotówki oraz auta z gwarancją.',
  NULL,
  '1636959447346992',
  '48609525935',
  '+48 609 525 935',
  'ul. Wycenowa 10',
  'Warszawa',
  '{
    "logoUrl": null,
    "colors": {
      "primary": "#1686E0",
      "primaryForeground": "#ffffff",
      "background": "#ffffff",
      "foreground": "#090B0B",
      "accent": "#1686E0",
      "accentForeground": "#ffffff",
      "surface": "#F1F3F5",
      "muted": "#E2E8F0",
      "headerBg": "#080808",
      "footerBg": "#080808"
    },
    "media": {
      "heroImageUrl": "/images/dcar-hero.png"
    }
  }'::jsonb,
  '[
    {
      "id": "srv-buying",
      "type": "car_buying",
      "enabled": true,
      "title": "Skup Samochodów Za Gotówkę",
      "description": "Kupujemy auta w każdym stanie — bezpłatny dojazd, wycena w 15 minut i gotówka od ręki.",
      "ctaLabel": "Wyceń swoje auto",
      "ctaType": "lead_form"
    },
    {
      "id": "srv-sales",
      "type": "car_sales",
      "enabled": true,
      "title": "Sprzedaż Aut z Gwarancją",
      "description": "Pewne samochody osobowe sprawdzone technicznie. Raport historii pojazdu w cenie.",
      "ctaLabel": "Przeglądaj ofertę",
      "ctaType": "link",
      "ctaValue": "#vehicles"
    },
    {
      "id": "srv-towing",
      "type": "towing",
      "enabled": true,
      "title": "Pomoc Drogowa & Laweta 24/7",
      "description": "Transport awaryjny i powypadkowy na terenie całej Polski.",
      "ctaLabel": "Zadzwoń po pomoc",
      "ctaType": "phone",
      "ctaValue": "+48 609 525 935"
    }
  ]'::jsonb,
  '{
    "sections": [
      {"id": "sec-hero",     "type": "hero",      "enabled": true, "title": "Sprzedaj nam swoje auto", "subtitle": "Szybko, bezpiecznie i bez zbędnych formalności."},
      {"id": "sec-trust",    "type": "trust",     "enabled": true, "title": "Dlaczego D-CAR?"},
      {"id": "sec-process",  "type": "process",   "enabled": true, "title": "Jak to działa?"},
      {"id": "sec-services", "type": "services",  "enabled": true, "title": "Nasza Oferta (Usługi)"},
      {"id": "sec-reviews",  "type": "reviews",   "enabled": true, "title": "Dlaczego warto nam zaufać?"},
      {"id": "sec-vehicles", "type": "vehicles",  "enabled": true, "title": "Aktualna Oferta Samochodów"},
      {"id": "sec-about",    "type": "about",     "enabled": true, "title": "O NAS (Lokalny komis D-CAR)"},
      {"id": "sec-lead",     "type": "lead_form", "enabled": true, "title": "Darmowa, błyskawiczna wycena auta"},
      {"id": "sec-faq",      "type": "faq",       "enabled": true, "title": "Najczęściej zadawane pytania"},
      {"id": "sec-contact",  "type": "contact",   "enabled": true, "title": "Kontakt i lokalizacja"}
    ]
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert Komis Maciek (Tenant Testowy #2: Podstawowy profil testujący domyślne fallbacki)
INSERT INTO profiles (
  slug,
  business_name,
  business_description,
  pixel_id,
  whatsapp_number,
  contact_phone,
  address,
  city
) VALUES (
  'komis-maciek',
  'Auto Komis Maciek',
  'Sprawdzony komis samochodowy w Krakowie. Oferujemy samochody osobowe i dostawcze z gwarancją.',
  '1636959447346992',
  '48123456789',
  '+48 123 456 789',
  'ul. Krakowska 123',
  'Kraków'
)
ON CONFLICT (slug) DO NOTHING;
