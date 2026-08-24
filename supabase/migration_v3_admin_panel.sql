-- ============================================================
-- VroomDealer.pl — Migracja v3: Panel Admina (Dealer Dashboard)
-- Uruchom w Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Dodanie kolumny user_id do profiles (powiązanie z auth.users)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
    ALTER TABLE profiles ADD COLUMN user_id uuid REFERENCES auth.users(id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
  END IF;

  -- E-mail do powiadomień o leadach (ustawiany z panelu admina)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_email') THEN
    ALTER TABLE profiles ADD COLUMN notification_email text;
  END IF;

  -- URL webhooka Google Sheets (ustawiany z panelu admina)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'google_sheets_webhook_url') THEN
    ALTER TABLE profiles ADD COLUMN google_sheets_webhook_url text;
  END IF;

  -- Godziny otwarcia (jsonb)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'opening_hours') THEN
    ALTER TABLE profiles ADD COLUMN opening_hours jsonb;
  END IF;
END $$;


-- 2. Rozszerzenie tabeli leads o notatki i updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notes') THEN
    ALTER TABLE leads ADD COLUMN notes text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'updated_at') THEN
    ALTER TABLE leads ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;


-- 3. RLS Policies dla authenticated users (Panel Admina)

-- Profiles: authenticated user widzi i edytuje WYŁĄCZNIE swój profil
DROP POLICY IF EXISTS "Authenticated users can read own profile" ON profiles;
CREATE POLICY "Authenticated users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated users can update own profile" ON profiles;
CREATE POLICY "Authenticated users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

-- Leads: authenticated user widzi i edytuje leady WYŁĄCZNIE swojego komisu
DROP POLICY IF EXISTS "Authenticated users can read own leads" ON leads;
CREATE POLICY "Authenticated users can read own leads" ON leads
  FOR SELECT TO authenticated
  USING (
    dealer_id::text IN (
      SELECT id::text FROM profiles WHERE user_id::text = auth.uid()::text
      UNION
      SELECT slug::text FROM profiles WHERE user_id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Authenticated users can update own leads" ON leads;
CREATE POLICY "Authenticated users can update own leads" ON leads
  FOR UPDATE TO authenticated
  USING (
    dealer_id::text IN (
      SELECT id::text FROM profiles WHERE user_id::text = auth.uid()::text
      UNION
      SELECT slug::text FROM profiles WHERE user_id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    dealer_id::text IN (
      SELECT id::text FROM profiles WHERE user_id::text = auth.uid()::text
      UNION
      SELECT slug::text FROM profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- Upewniamy się że publiczny odczyt profili i publiczny zapis leadów nadal działa
DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable" ON profiles FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Leads can be created publicly" ON leads;
CREATE POLICY "Leads can be created publicly" ON leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Cars are publicly readable" ON cars;
CREATE POLICY "Cars are publicly readable" ON cars FOR SELECT TO anon USING (true);
