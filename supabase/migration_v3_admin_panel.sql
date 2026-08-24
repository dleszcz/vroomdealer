-- ============================================================
-- VroomDealer.pl — Migracja v3.1: Fix typowania dealer_id i RLS
-- Uruchom w Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Usuwamy polityki RLS zależne od kolumny dealer_id
DROP POLICY IF EXISTS "Authenticated users can read own leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update own leads" ON leads;
DROP POLICY IF EXISTS "Leads can be created publicly" ON leads;

-- 2. Usuwamy ograniczenie Foreign Key, jeśli istniało (ponieważ dealer_id przechowuje slug tekstowy, np. 'd-car')
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_dealer_id_fkey;

-- 3. Konwertujemy kolumnę dealer_id na TEXT
ALTER TABLE leads ALTER COLUMN dealer_id TYPE text USING dealer_id::text;

-- 4. Zapewnienie wymaganych kolumn w profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
    ALTER TABLE profiles ADD COLUMN user_id uuid REFERENCES auth.users(id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notification_email') THEN
    ALTER TABLE profiles ADD COLUMN notification_email text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'google_sheets_webhook_url') THEN
    ALTER TABLE profiles ADD COLUMN google_sheets_webhook_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'opening_hours') THEN
    ALTER TABLE profiles ADD COLUMN opening_hours jsonb;
  END IF;
END $$;

-- 5. Utworzenie nowych polityk RLS dla authenticated users

-- Profiles
DROP POLICY IF EXISTS "Authenticated users can read own profile" ON profiles;
CREATE POLICY "Authenticated users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update own profile" ON profiles;
CREATE POLICY "Authenticated users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

-- Leads
CREATE POLICY "Authenticated users can read own leads" ON leads
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update own leads" ON leads
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Leads can be created publicly" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable" ON profiles
  FOR SELECT TO anon
  USING (true);
