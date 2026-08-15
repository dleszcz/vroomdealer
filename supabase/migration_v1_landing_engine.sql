-- ============================================================
-- VroomDealer.pl — Migration: Landing Engine & Local SEO v1.1
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

  -- local_seo (jsonb)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'local_seo'
  ) THEN
    ALTER TABLE profiles ADD COLUMN local_seo jsonb;
  END IF;

  -- business_rules (jsonb)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'business_rules'
  ) THEN
    ALTER TABLE profiles ADD COLUMN business_rules jsonb;
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
  attribution jsonb,
  local_seo_city text,
  photos jsonb,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

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

-- 5. Insert / Update D-Car (Tenant #1: Realna konfiguracja D-Car + Local SEO)
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
  page_config,
  local_seo,
  business_rules
) VALUES (
  'd-car',
  'd-car.com.pl',
  'D-CAR / Dawid Woźniak',
  'Prywatny komis samochodowy i profesjonalny skup aut w Topólce i okolicach. Bezpłatna wycena, natychmiastowa wypłata gotówki oraz auta z gwarancją.',
  '/images/dcar-logo.png',
  '1636959447346992',
  '48530826501',
  '+48 530 826 501',
  'Paniewo 3A',
  'Topólka',
  '{
    "logoUrl": "/images/dcar-logo.png",
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
      "description": "Transport awaryjny i powypadkowy na terenie całego powiatu radziejowskiego i okolic.",
      "ctaLabel": "Zadzwoń po pomoc",
      "ctaType": "phone",
      "ctaValue": "+48 530 826 501"
    }
  ]'::jsonb,
  '{
    "sections": [
      {"id": "sec-hero",          "type": "hero",          "enabled": true, "title": "Sprzedaj nam swoje auto", "subtitle": "Szybko, bezpiecznie i bez zbędnych formalności w Topólce i okolicach."},
      {"id": "sec-trust",         "type": "trust",         "enabled": true, "title": "Dlaczego warto nam zaufać?"},
      {"id": "sec-process",       "type": "process",       "enabled": true, "title": "Jak to działa?"},
      {"id": "sec-services",      "type": "services",      "enabled": true, "title": "Nasza Oferta (Usługi)"},
      {"id": "sec-reviews",       "type": "reviews",       "enabled": true, "title": "Opinie naszych klientów"},
      {"id": "sec-vehicles",      "type": "vehicles",      "enabled": true, "title": "Aktualna Oferta Samochodów"},
      {"id": "sec-about",         "type": "about",         "enabled": true, "title": "O nas (Lokalny komis D-CAR)"},
      {"id": "sec-service-areas", "type": "service_areas", "enabled": true, "title": "Skup aut w Topólce i okolicach"},
      {"id": "sec-lead",          "type": "lead_form",     "enabled": true, "title": "Darmowa, błyskawiczna wycena auta"},
      {"id": "sec-faq",           "type": "faq",           "enabled": true, "title": "Najczęściej zadawane pytania"},
      {"id": "sec-contact",       "type": "contact",       "enabled": true, "title": "Kontakt i lokalizacja"}
    ]
  }'::jsonb,
  '{
    "primaryLocation": {
      "city": "Topólka",
      "locality": "Paniewo",
      "county": "radziejowski",
      "region": "kujawsko-pomorskie",
      "postalCode": "87-875"
    },
    "serviceAreas": [
      { "city": "Topólka", "slug": "topolka", "enabled": true, "indexable": true, "priority": 1 },
      { "city": "Radziejów", "slug": "radziejow", "enabled": true, "indexable": true, "priority": 2 },
      { "city": "Lubraniec", "slug": "lubraniec", "enabled": true, "indexable": true, "priority": 3 },
      { "city": "Izbica Kujawska", "slug": "izbica-kujawska", "enabled": true, "indexable": true, "priority": 4 },
      { "city": "Brześć Kujawski", "slug": "brzesc-kujawski", "enabled": true, "indexable": true, "priority": 5 },
      { "city": "Piotrków Kujawski", "slug": "piotrkow-kujawski", "enabled": true, "indexable": true, "priority": 6 },
      { "city": "Osięciny", "slug": "osieciny", "enabled": true, "indexable": true, "priority": 7 },
      { "city": "Włocławek", "slug": "wloclawek", "enabled": true, "indexable": true, "priority": 8 },
      { "city": "Kruszwica", "slug": "kruszwica", "enabled": true, "indexable": true, "priority": 9 },
      { "city": "Inowrocław", "slug": "inowroclaw", "enabled": true, "indexable": true, "priority": 10 },
      { "city": "Konin", "slug": "konin", "enabled": true, "indexable": true, "priority": 11 },
      { "city": "Lipno", "slug": "lipno", "enabled": true, "indexable": true, "priority": 12 }
    ],
    "localPages": [
      {
        "slug": "skup-aut-topolka",
        "city": "Topólka",
        "enabled": true,
        "indexable": true,
        "priority": 1,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-radziejow", "skup-aut-lubraniec", "skup-aut-izbica-kujawska"],
        "seo": {
          "title": "Skup aut Topólka | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "D-CAR oferuje skup aut w Topólce i okolicach. Bezpłatna wycena, natychmiastowa wypłata gotówki i darmowy odbiór pojazdu. Sprawdź naszą ofertę skupu samochodów.",
          "h1": "Skup aut w Topólce — D-CAR"
        },
        "content": {
          "intro": "Szukasz rzetelnego skupu aut w Topólce lub okolicach Paniewa? D-CAR to lokalny skup samochodów za gotówkę. Kupujemy auta w każdym stanie technicznym, oferując bezpłatną wycenę i szybką realizację transakcji.",
          "serviceDescription": "Obsługujemy mieszkańców Topólki oraz okolicznych miejscowości w powiecie radziejowskim. Zapewniamy pełne wsparcie formalne, umowę kupna-sprzedaży i wypłatę gotówki od ręki.",
          "locationNote": "Nasza główna siedziba i plac znajdują się pod adresem Paniewo 3A w gminie Topólka. Zapraszamy do kontaktu telefonicznego lub złożenia darmowego formularza wyceny online.",
          "faq": [
            { "q": "Czy D-CAR skupuje auta w Topólce?", "a": "Tak, nasza główna siedziba znajduje się w Paniewie (gmina Topólka). Skupujemy auta bezpośrednio na placu oraz z dojazdem do klienta." },
            { "q": "Jakie dokumenty są potrzebne przy sprzedaży samochodu w Topólce?", "a": "Wystarczy dowód rejestracyjny, karta pojazdu (jeśli była wydana) oraz dowód osobisty właściciela. Wszystkie formalności załatwiamy na miejscu." },
            { "q": "Czy odbiór samochodu z Topólki jest darmowy?", "a": "Tak, zapewniamy bezpłatny odbiór pojazdu własną lawetą z terenu gminy Topólka i całego powiatu radziejowskiego." }
          ]
        }
      },
      {
        "slug": "skup-aut-radziejow",
        "city": "Radziejów",
        "enabled": true,
        "indexable": true,
        "priority": 2,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-topolka", "skup-aut-lubraniec"],
        "seo": {
          "title": "Skup aut Radziejów | D-CAR — szybki skup samochodów za gotówkę",
          "metaDescription": "Szukasz skupu samochodów w Radziejowie? D-CAR zapewnia szybki skup aut za gotówkę z dojazdem do Radziejowa. Bezpłatna wycena w 15 minut.",
          "h1": "Skup aut w Radziejowie — D-CAR"
        },
        "content": {
          "intro": "Planujesz sprzedać samochód w Radziejowie? D-CAR oferuje ekspresowy skup samochodów z bezpłatnym dojazdem do klienta w Radziejowie i okolicach.",
          "serviceDescription": "Dojeżdżamy do Radziejowa w kilkanaście minut. Płacimy gotówką od ręki i sporządzamy bezpieczną umowę kupna-sprzedaży na miejscu.",
          "locationNote": "D-CAR posiada plac w pobliskim Paniewie (gmina Topólka, ok. 15 km od Radziejowa). Oferujemy jednak pełną obsługę mobilną na terenie Radziejowa.",
          "faq": [
            { "q": "Czy D-CAR dojeżdża po auto do Radziejowa?", "a": "Tak, dojeżdżamy do Radziejowa bezpłatnie i wyceniamy auto na miejscu u klienta." },
            { "q": "Jak szybko można sprzedać auto z Radziejowa?", "a": "Zazwyczaj realizujemy transakcję tego samego dnia — wycena i wypłata gotówki trwają około 15–30 minut." }
          ]
        }
      },
      {
        "slug": "skup-aut-lubraniec",
        "city": "Lubraniec",
        "enabled": true,
        "indexable": true,
        "priority": 3,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-topolka", "skup-aut-izbica-kujawska"],
        "seo": {
          "title": "Skup aut Lubraniec | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "D-CAR skupuje samochody osobowe i dostawcze w Lubrańcu. Bezpłatna wycena, darmowa laweta i natychmiastowa wypłata gotówki. Zadzwoń!",
          "h1": "Skup aut w Lubrańcu — D-CAR"
        },
        "content": {
          "intro": "Potrzebujesz szybko sprzedać auto w Lubrańcu? D-CAR kupuje samochody za gotówkę od mieszkańców Lubrańca i okolicznych miejscowości.",
          "serviceDescription": "Skupujemy auta sprawne, powypadkowe, uszkodzone oraz bez ważnego przeglądu lub OC. Zapewniamy własny transport lawetą.",
          "locationNote": "Siedziba D-CAR mieści się w Paniewie 3A k. Topólki, skąd sprawnie dojeżdżamy do Lubrańca i całego powiatu.",
          "faq": [
            { "q": "Czy D-CAR kupuje auta uszkodzone w Lubrańcu?", "a": "Tak, skupujemy pojazdy w każdym stanie technicznym, w tym powypadkowe i uszkodzone mechanicznie." }
          ]
        }
      },
      {
        "slug": "skup-aut-izbica-kujawska",
        "city": "Izbica Kujawska",
        "enabled": true,
        "indexable": true,
        "priority": 4,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-topolka", "skup-aut-lubraniec"],
        "seo": {
          "title": "Skup aut Izbica Kujawska | D-CAR — bezpieczna sprzedaż auta",
          "metaDescription": "Skup samochodów za gotówkę w Izbicy Kujawskiej. D-CAR gwarantuje bezpłatną wycenę, umowę na miejscu i szybki dojazd lawetą.",
          "h1": "Skup aut w Izbicy Kujawskiej — D-CAR"
        },
        "content": {
          "intro": "Oferujemy profesjonalny skup aut dla mieszkańców Izbicy Kujawskiej i sąsiednich miejscowości. Gwarantujemy uczciwe ceny i natychmiastową płatność.",
          "serviceDescription": "Odbieramy auta prosto spod domu klienta w Izbicy Kujawskiej, regulujemy należność w gotówce lub przelewem natychmiastowym.",
          "locationNote": "D-CAR działa w powiecie radziejowskim i włocławskim. Nasz główny plac znajduje się w Paniewie 3A (Topólka).",
          "faq": [
            { "q": "Czy muszę przyjeżdżać z Izbicy Kujawskiej na plac?", "a": "Nie, nasz przedstawiciel może przyjechać pod wskazany adres w Izbicy Kujawskiej i sfinalizować transakcję na miejscu." }
          ]
        }
      },
      {
        "slug": "skup-aut-brzesc-kujawski",
        "city": "Brześć Kujawski",
        "enabled": true,
        "indexable": true,
        "priority": 5,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-lubraniec", "skup-aut-wloclawek"],
        "seo": {
          "title": "Skup aut Brześć Kujawski | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "D-CAR oferuje szybki skup aut za gotówkę w Brześciu Kujawskim. Bezpłatna wycena, natychmiastowa płatność i darmowy odbiór pojazdu lawetą.",
          "h1": "Skup aut w Brześciu Kujawskim — D-CAR"
        },
        "content": {
          "intro": "Chcesz sprzedać samochód w Brześciu Kujawskim? D-CAR kupuje auta za gotówkę od mieszkańców Brześcia Kujawskiego i okolic. Gwarantujemy uczciwą wycenę i odbiór własną lawetą.",
          "serviceDescription": "Kupujemy samochody w każdym stanie technicznym — sprawne, uszkodzone i powypadkowe z dojazdem do Brześcia Kujawskiego.",
          "locationNote": "Siedziba D-CAR znajduje się w pobliskim Paniewie k. Topólki. Oferujemy bezpłatny dojazd do Brześcia Kujawskiego.",
          "faq": [
            { "q": "Czy odbiór auta z Brześcia Kujawskiego jest darmowy?", "a": "Tak, zapewniamy bezpłatny odbiór pojazdu własną lawetą z terenu Brześcia Kujawskiego." }
          ]
        }
      },
      {
        "slug": "skup-aut-piotrkow-kujawski",
        "city": "Piotrków Kujawski",
        "enabled": true,
        "indexable": true,
        "priority": 6,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-topolka", "skup-aut-radziejow"],
        "seo": {
          "title": "Skup aut Piotrków Kujawski | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "D-CAR kupuje auta w Piotrkowie Kujawskim i okolicach. Gotówka od ręki, bezpłatna wycena i dojazd lawetą.",
          "h1": "Skup aut w Piotrkowie Kujawskim — D-CAR"
        },
        "content": {
          "intro": "Oferujemy sprawny i bezpieczny skup samochodów w Piotrkowie Kujawskim. Płacimy gotówką od ręki i załatwiamy formalności na miejscu.",
          "serviceDescription": "Dojeżdżamy do Piotrkowa Kujawskiego bez zbędnej zwłoki, oferując bezpieczną transakcję kupna-sprzedaży.",
          "locationNote": "D-CAR posiada plac w Paniewie 3A (Topólka), obsługując cały powiat radziejowski.",
          "faq": [
            { "q": "Czy kupujecie auta bez ważnego przeglądu w Piotrkowie Kujawskim?", "a": "Tak, skupujemy również auta bez ważnych badań technicznych i OC." }
          ]
        }
      },
      {
        "slug": "skup-aut-osieciny",
        "city": "Osięciny",
        "enabled": true,
        "indexable": true,
        "priority": 7,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-radziejow", "skup-aut-topolka"],
        "seo": {
          "title": "Skup aut Osięciny | D-CAR — szybki skup samochodów za gotówkę",
          "metaDescription": "Skup samochodów za gotówkę w Osięcinach i okolicach. D-CAR gwarantuje wycenę w 15 minut, umowę na miejscu i bezpłatny dojazd.",
          "h1": "Skup aut w Osięcinach — D-CAR"
        },
        "content": {
          "intro": "Planujesz sprzedaż auta w Osięcinach? D-CAR oferuje skup samochodów za gotówkę w Osięcinach z dojazdem do klienta w kilkanaście minut.",
          "serviceDescription": "Zapewniamy profesjonalną obsługę, darmowy dojazd i wycenę auta na miejscu.",
          "locationNote": "D-CAR działa mobilnie na terenie Osięcin i okolicznych gmin.",
          "faq": [
            { "q": "Jak szybko dojeżdżacie do Osięcin?", "a": "Zazwyczaj jesteśmy na miejscu w ciągu 20–40 minut od zgłoszenia." }
          ]
        }
      },
      {
        "slug": "skup-aut-wloclawek",
        "city": "Włocławek",
        "enabled": true,
        "indexable": true,
        "priority": 8,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-brzesc-kujawski", "skup-aut-lubraniec"],
        "seo": {
          "title": "Skup aut Włocławek | D-CAR — bezpieczna sprzedaż auta za gotówkę",
          "metaDescription": "Skup aut za gotówkę we Włocławku. D-CAR kupuje samochody osobowe i dostawcze z Włocławka. Bezpłatna wycena i darmowy odbiór.",
          "h1": "Skup aut we Włocławku — D-CAR"
        },
        "content": {
          "intro": "Szukasz sprawdzonego skupu aut we Włocławku? D-CAR obsługuje mieszkańców Włocławka, oferując wycenę online i natychmiastową wypłatę gotówki.",
          "serviceDescription": "Skupujemy auta we Włocławku niezależnie od stanu technicznego. Transport własną lawetą jest darmowy.",
          "locationNote": "D-CAR sprawnie dojeżdża do Włocławka z placu w Paniewie.",
          "faq": [
            { "q": "Czy D-CAR kupuje auta we Włocławku?", "a": "Tak, regularnie odbieramy samochody od mieszkańców Włocławka." }
          ]
        }
      },
      {
        "slug": "skup-aut-kruszwica",
        "city": "Kruszwica",
        "enabled": true,
        "indexable": true,
        "priority": 9,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-radziejow", "skup-aut-inowroclaw"],
        "seo": {
          "title": "Skup aut Kruszwica | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "Szybki skup aut w Kruszwicy. D-CAR gwarantuje darmowy dojazd lawetą, gotówkę od ręki i legalną umowę.",
          "h1": "Skup aut w Kruszwicy — D-CAR"
        },
        "content": {
          "intro": "Skupujemy auta osobowe i dostawcze w Kruszwicy i okolicach. Zapewniamy dojazd do klienta oraz płatność w gotówce.",
          "serviceDescription": "Wyceniamy pojazd uczciwie i natychmiastowo spłacamy uzgodnioną kwotę.",
          "locationNote": "D-CAR świadczy usługi skupu aut na terenie gminy Kruszwica.",
          "faq": [
            { "q": "Czy wycena w Kruszwicy jest darmowa?", "a": "Tak, wycena i dojazd w Kruszwicy są całkowicie bezpłatne." }
          ]
        }
      },
      {
        "slug": "skup-aut-inowroclaw",
        "city": "Inowrocław",
        "enabled": true,
        "indexable": true,
        "priority": 10,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-kruszwica", "skup-aut-radziejow"],
        "seo": {
          "title": "Skup aut Inowrocław | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "D-CAR oferuje skup aut w Inowrocławiu. Bezpłatna wycena, natychmiastowa wypłata gotówki i darmowy transport lawetą.",
          "h1": "Skup aut w Inowrocławiu — D-CAR"
        },
        "content": {
          "intro": "Potrzebujesz pilnie sprzedać auto w Inowrocławiu? D-CAR kupuje samochody używane za gotówkę z dojazdem na terenie Inowrocławia.",
          "serviceDescription": "Oferujemy bezpieczny skup pojazdów z natychmiastową płatnością w gotówce lub przelewem.",
          "locationNote": "Zapewniamy pełną obsługę mobilną w Inowrocławiu.",
          "faq": [
            { "q": "Czy kupujecie auta powypadkowe w Inowrocławiu?", "a": "Tak, skupujemy samochody uszkodzone i po wypadkach." }
          ]
        }
      },
      {
        "slug": "skup-aut-konin",
        "city": "Konin",
        "enabled": true,
        "indexable": true,
        "priority": 11,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-izbica-kujawska", "skup-aut-piotrkow-kujawski"],
        "seo": {
          "title": "Skup aut Konin | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "Skup samochodów za gotówkę w Koninie. D-CAR oferuje bezpłatną wycenę, płatność na miejscu i bezpieczną transakcję.",
          "h1": "Skup aut w Koninie — D-CAR"
        },
        "content": {
          "intro": "Oferujemy profesjonalny skup aut dla mieszkańców Konina. Szybka wycena, dojazd lawetą i płatność w gotówce od ręki.",
          "serviceDescription": "Kupujemy samochody bez zbędnych formalności i długiego oczekiwania.",
          "locationNote": "D-CAR realizuje dojazdy po samochody na terenie Konina i okolic.",
          "faq": [
            { "q": "Czy dojeżdżacie do Konina?", "a": "Tak, dojeżdżamy do Konina i okolicznych miejscowości po wcześniejszym kontakcie." }
          ]
        }
      },
      {
        "slug": "skup-aut-lipno",
        "city": "Lipno",
        "enabled": true,
        "indexable": true,
        "priority": 12,
        "showInLocalAreaLinks": true,
        "showInFooter": true,
        "relatedLocations": ["skup-aut-wloclawek", "skup-aut-lubraniec"],
        "seo": {
          "title": "Skup aut Lipno | D-CAR — skup samochodów za gotówkę",
          "metaDescription": "D-CAR skupuje samochody za gotówkę w Lipnie i powiecie lipnowskim. Sprawdź darmową wycenę i bezpłatny odbiór pojazdu.",
          "h1": "Skup aut w Lipnie — D-CAR"
        },
        "content": {
          "intro": "Sprzedaj auto w Lipnie bez zbędnych formalności. D-CAR oferuje mobilny skup aut z darmowym odbiorem w Lipnie i okolicach.",
          "serviceDescription": "Zapewniamy wsparcie przy wyrejestrowaniu i umowę kupna-sprzedaży na miejscu.",
          "locationNote": "D-CAR sprawnie obsługuje klientów z miasta Lipno i całego powiatu lipnowskiego.",
          "faq": [
            { "q": "Czy odbiór z Lipna jest darmowy?", "a": "Tak, nie pobieramy żadnych opłat za dojazd i odbiór auta z Lipna." }
          ]
        }
      }
    ]
  }'::jsonb,
  '{
    "tradeIn": {
      "enabled": true,
      "title": "Auto w rozliczeniu",
      "description": "Możliwość pozostawienia swojego obecnego samochodu w rozliczeniu przy zakupie auta z naszej oferty."
    },
    "purchasePriceLimit": {
      "enabled": true,
      "maxAmount": 10000,
      "currency": "PLN",
      "description": "Skupujemy również samochody budżetowe do 10 000 zł — zapytaj o szybką wycenę."
    }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  business_description = EXCLUDED.business_description,
  logo_url = EXCLUDED.logo_url,
  whatsapp_number = EXCLUDED.whatsapp_number,
  contact_phone = EXCLUDED.contact_phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  branding = EXCLUDED.branding,
  services = EXCLUDED.services,
  page_config = EXCLUDED.page_config,
  local_seo = EXCLUDED.local_seo,
  business_rules = EXCLUDED.business_rules;


-- 6. Insert Komis Maciek (Tenant #2: Podstawowy profil testowy)
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
