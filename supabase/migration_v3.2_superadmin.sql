-- ============================================================
-- VroomDealer.pl — Migracja v3.2: Rola Superadmina & Zarządzanie Tenantami
-- FIX: Use SECURITY DEFINER function to avoid infinite RLS recursion
-- Uruchom w Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Dodanie kolumny is_super_admin do tabeli profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_super_admin') THEN
    ALTER TABLE profiles ADD COLUMN is_super_admin boolean DEFAULT false;
  END IF;
END $$;

-- 2. Ustawienie konta danielxleszczynski@gmail.com jako Superadmina
UPDATE profiles
SET is_super_admin = true
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'danielxleszczynski@gmail.com'
);

-- 3. Create a SECURITY DEFINER function that bypasses RLS to check superadmin status
-- This avoids infinite recursion when checking the profiles table policy
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id::text = auth.uid()::text
    AND is_super_admin = true
  );
$$;

-- 4. Aktualizacja RLS Policies

-- Profiles: read
DROP POLICY IF EXISTS "Authenticated users can read own profile" ON profiles;
CREATE POLICY "Authenticated users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (
    user_id::text = auth.uid()::text
    OR public.is_super_admin()
  );

-- Profiles: update  
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON profiles;
CREATE POLICY "Authenticated users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (
    user_id::text = auth.uid()::text
    OR public.is_super_admin()
  )
  WITH CHECK (
    user_id::text = auth.uid()::text
    OR public.is_super_admin()
  );

-- Leads: read
DROP POLICY IF EXISTS "Authenticated users can read own leads" ON leads;
CREATE POLICY "Authenticated users can read own leads" ON leads
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR dealer_id::text IN (
      SELECT id::text FROM profiles WHERE user_id::text = auth.uid()::text
      UNION
      SELECT slug::text FROM profiles WHERE user_id::text = auth.uid()::text
    )
  );

-- Leads: update
DROP POLICY IF EXISTS "Authenticated users can update own leads" ON leads;
CREATE POLICY "Authenticated users can update own leads" ON leads
  FOR UPDATE TO authenticated
  USING (
    public.is_super_admin()
    OR dealer_id::text IN (
      SELECT id::text FROM profiles WHERE user_id::text = auth.uid()::text
      UNION
      SELECT slug::text FROM profiles WHERE user_id::text = auth.uid()::text
    )
  );
