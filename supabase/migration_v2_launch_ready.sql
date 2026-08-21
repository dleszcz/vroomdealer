-- ============================================================
-- VroomDealer.pl — Skrypt Migracyjny Supabase (v1.2 Launch Ready)
-- Uruchom poniższy skrypt w Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Rozszerzenie tabeli PROFILES o wymagane kolumny
DO $$
BEGIN
  -- custom_domain (np. 'd-car.com.pl')
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'custom_domain') THEN
    ALTER TABLE profiles ADD COLUMN custom_domain text UNIQUE;
  END IF;

  -- branding (jsonb: kolory, logoUrl, faviconUrl, media)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'branding') THEN
    ALTER TABLE profiles ADD COLUMN branding jsonb;
  END IF;

  -- services (jsonb: lista usług DealerService[])
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'services') THEN
    ALTER TABLE profiles ADD COLUMN services jsonb;
  END IF;

  -- page_config (jsonb: ułożenie i włączanie sekcji)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'page_config') THEN
    ALTER TABLE profiles ADD COLUMN page_config jsonb;
  END IF;

  -- seo (jsonb: metaTitle, metaDescription)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'seo') THEN
    ALTER TABLE profiles ADD COLUMN seo jsonb;
  END IF;

  -- local_seo (jsonb: konfiguracja 12 podstron skupu aut per miejscowość)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'local_seo') THEN
    ALTER TABLE profiles ADD COLUMN local_seo jsonb;
  END IF;

  -- business_rules (jsonb: limity kwotowe, auto w rozliczeniu)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_rules') THEN
    ALTER TABLE profiles ADD COLUMN business_rules jsonb;
  END IF;

  -- analytics (jsonb: Meta Pixel, GA4)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'analytics') THEN
    ALTER TABLE profiles ADD COLUMN analytics jsonb;
  END IF;

  -- is_published (boolean)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_published') THEN
    ALTER TABLE profiles ADD COLUMN is_published boolean DEFAULT true;
  END IF;
END $$;


-- 2. Tabela LEADS (zgłoszenia z formularza skupu)
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id text NOT NULL,                    -- slug (np. 'd-car') lub uuid profilu
  source text NOT NULL DEFAULT 'landing_form',
  campaign text,
  landing_path text,
  customer_name text,
  customer_phone text NOT NULL,
  customer_email text,
  vehicle_details jsonb,                      -- marka, model, rok, przebieg, stan
  attribution jsonb,                          -- UTM: utm_source, utm_medium, gclid, fbclid
  local_seo_city text,                        -- miejscowość (np. Topólka, Radziejów)
  photos jsonb,                               -- zdjęcia dodane przez klienta w 5 kroku
  status text NOT NULL DEFAULT 'new',         -- new, contacted, qualified, purchased, lost
  created_at timestamptz DEFAULT now()
);

-- Zapewnienie, że nowe kolumny istnieją na istniejącej tabeli leads
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'attribution') THEN
    ALTER TABLE leads ADD COLUMN attribution jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'local_seo_city') THEN
    ALTER TABLE leads ADD COLUMN local_seo_city text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'photos') THEN
    ALTER TABLE leads ADD COLUMN photos jsonb;
  END IF;
END $$;


-- 3. Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_domain ON profiles(custom_domain);
CREATE INDEX IF NOT EXISTS idx_leads_dealer_id ON leads(dealer_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);


-- 4. Uprawnienia i RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Polityki dla profilu i samochodów (publiczny odczyt)
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable" ON profiles FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Cars are publicly readable" ON cars;
CREATE POLICY "Cars are publicly readable" ON cars FOR SELECT TO anon USING (true);

-- Polityka dla leadów (publiczny zapis z formularza)
DROP POLICY IF EXISTS "Leads can be created publicly" ON leads;
CREATE POLICY "Leads can be created publicly" ON leads FOR INSERT TO anon WITH CHECK (true);
