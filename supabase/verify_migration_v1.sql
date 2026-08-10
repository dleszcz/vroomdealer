-- ============================================================
-- VERIFICATION SCRIPT — Run AFTER migration_v1_landing_engine.sql
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Check that new columns exist in profiles
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('custom_domain', 'branding', 'services', 'page_config', 'seo', 'analytics')
ORDER BY column_name;
-- Expected: 6 rows (all jsonb except custom_domain = text)

-- 2. Check that leads table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
-- Expected: 11 rows (id, dealer_id, source, campaign, ...)

-- 3. Check that D-Car tenant was inserted with full config
SELECT
  slug,
  business_name,
  custom_domain,
  branding IS NOT NULL AS has_branding,
  services IS NOT NULL AS has_services,
  page_config IS NOT NULL AS has_page_config,
  jsonb_array_length(services::jsonb) AS services_count,
  (page_config::jsonb -> 'sections') IS NOT NULL AS has_sections
FROM profiles
WHERE slug = 'd-car';
-- Expected: 1 row, all TRUE, services_count = 3

-- 4. Verify branding colors are valid hex
SELECT
  slug,
  branding -> 'colors' ->> 'primary' AS color_primary,
  branding -> 'colors' ->> 'accent' AS color_accent,
  branding -> 'colors' ->> 'background' AS color_bg
FROM profiles
WHERE branding IS NOT NULL;
-- Expected: hex colors like #1e293b, #25d366, #ffffff

-- 5. Check RLS policy on leads
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'leads';
-- Expected: "Leads can be created publicly" with cmd = INSERT

-- 6. Check that old boolean columns still exist (backward compat for existing data)
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('has_towing', 'has_buying');
-- Note: these may still exist in DB (we only removed from code, not from schema)
