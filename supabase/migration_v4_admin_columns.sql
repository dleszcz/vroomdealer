-- ============================================================
-- VroomDealer.pl — Migracja v4: Brakujące kolumny Admin Panel
-- Uruchom w Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabela LEADS: Dodaj updated_at i notes (wymagane przez updateLeadStatus)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'updated_at') THEN
    ALTER TABLE leads ADD COLUMN updated_at timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notes') THEN
    ALTER TABLE leads ADD COLUMN notes text;
  END IF;
END $$;

-- 2. Tabela PROFILES: Dodaj postal_code, county, region (wymagane przez updateProfile)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'postal_code') THEN
    ALTER TABLE profiles ADD COLUMN postal_code text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'county') THEN
    ALTER TABLE profiles ADD COLUMN county text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'region') THEN
    ALTER TABLE profiles ADD COLUMN region text;
  END IF;
END $$;

-- 3. Uzupełnij dane D-CAR (postal_code, county, region, hero image jpg)
UPDATE profiles
SET
  postal_code = COALESCE(postal_code, '87-875'),
  county = COALESCE(county, 'radziejowski'),
  region = COALESCE(region, 'kujawsko-pomorskie'),
  branding = jsonb_set(
    COALESCE(branding, '{}'::jsonb),
    '{media,heroImageUrl}',
    '"/images/dcar-hero.jpg"'::jsonb
  )
WHERE slug = 'd-car';

-- 4. Indeks na leads.updated_at (przydatny dla sortowania w admin panelu)
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at DESC);
