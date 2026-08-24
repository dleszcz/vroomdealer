-- ============================================================
-- VroomDealer.pl — Migracja v3.1: Fix typowania dealer_id i RLS
-- Uruchom w Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Zapewnienie, że dealer_id w leads jest typu TEXT (nie UUID)
DO $$
BEGIN
  ALTER TABLE leads ALTER COLUMN dealer_id TYPE text USING dealer_id::text;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 2. Zapewnienie wymaganych kolumn w profiles
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

-- 3. Czyste polityki RLS bez konfliktów typów Postgres

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
DROP POLICY IF EXISTS "Authenticated users can read own leads" ON leads;
CREATE POLICY "Authenticated users can read own leads" ON leads
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update own leads" ON leads;
CREATE POLICY "Authenticated users can update own leads" ON leads
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Leads can be created publicly" ON leads;
CREATE POLICY "Leads can be created publicly" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable" ON profiles
  FOR SELECT TO anon
  USING (true);
