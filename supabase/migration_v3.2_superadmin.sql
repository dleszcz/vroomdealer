-- ============================================================
-- VroomDealer.pl — Migracja v3.2: Rola Superadmina & Zarządzanie Tenantami
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

-- 4. Aktualizacja RLS Policies dla profiles & leads

-- Profiles: read
DROP POLICY IF EXISTS "Authenticated users can read own profile" ON profiles;
CREATE POLICY "Authenticated users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (
    user_id::text = auth.uid()::text
    OR public.is_super_admin()
  );

-- Profiles: insert (Superadmin can create new tenant profiles)
DROP POLICY IF EXISTS "Authenticated users can insert profile" ON profiles;
CREATE POLICY "Authenticated users can insert profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (
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

-- 5. Seed oryginalnych komisów D-CAR oraz Komis Maciek
INSERT INTO profiles (
  slug,
  business_name,
  business_description,
  logo_url,
  pixel_id,
  contact_phone,
  whatsapp_number,
  notification_email,
  custom_domain,
  city,
  address,
  postal_code,
  county,
  region,
  is_super_admin,
  branding
)
VALUES 
(
  'd-car',
  'D-CAR / Dawid Woźniak',
  'Prywatny komis samochodowy i profesjonalny skup aut w Topólce i okolicach. Bezpłatna wycena, natychmiastowa wypłata gotówki oraz auta z gwarancją.',
  '/images/dcar-logo.png',
  '1636959447346992',
  '+48 530 826 501',
  '48530826501',
  'dawid@d-car.com.pl',
  'd-car.com.pl',
  'Topólka',
  'Paniewo 3A',
  '87-875',
  'radziejowski',
  'kujawsko-pomorskie',
  false,
  '{
    "primaryColor": "#1686E0",
    "accentColor": "#1686E0",
    "logoUrl": "/images/dcar-logo.png",
    "heroTitle": "Sprzedaj nam swoje auto",
    "heroSubtitle": "Szybko, bezpiecznie i bez zbędnych formalności w Topólce i okolicach.",
    "facebook": "https://www.facebook.com/profile.php?id=100068379260209",
    "media": {
      "heroImageUrl": "/images/dcar-hero.png"
    }
  }'::jsonb
),
(
  'komis-maciek',
  'Auto Komis Maciek',
  'Sprawdzony komis samochodowy w Krakowie. Oferujemy samochody osobowe i dostawcze z gwarancją.',
  NULL,
  NULL,
  '+48 123 456 789',
  '48123456789',
  'kontakt@komismaciek.pl',
  NULL,
  'Kraków',
  'ul. Krakowska 123',
  '30-001',
  'Kraków',
  'Małopolskie',
  false,
  '{
    "primaryColor": "#3b82f6",
    "accentColor": "#ef4444",
    "heroTitle": "Auto Komis Maciek - Kraków",
    "heroSubtitle": "Samochody osobowe z gwarancją i pewną historią techniczną!"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET 
  business_name = EXCLUDED.business_name,
  business_description = EXCLUDED.business_description,
  logo_url = EXCLUDED.logo_url,
  pixel_id = EXCLUDED.pixel_id,
  contact_phone = EXCLUDED.contact_phone,
  whatsapp_number = EXCLUDED.whatsapp_number,
  notification_email = EXCLUDED.notification_email,
  custom_domain = EXCLUDED.custom_domain,
  city = EXCLUDED.city,
  address = EXCLUDED.address,
  branding = EXCLUDED.branding,
  is_super_admin = false;
