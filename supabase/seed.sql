-- ============================================================
-- VroomDealer.pl — Seed Data
-- Wklej w Supabase Dashboard > SQL Editor
-- ============================================================

INSERT INTO profiles (id, slug, business_name, business_description, whatsapp_number, contact_phone, address, city, has_towing, has_buying)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'komis-maciek',
  'Auto Komis Maciek',
  'Sprawdzony komis samochodowy w Krakowie. Oferujemy samochody osobowe i dostawcze z gwarancją. Każde auto przechodzi szczegółową kontrolę techniczną przed sprzedażą.',
  '48123456789',
  '+48 123 456 789',
  'ul. Krakowska 123',
  'Kraków',
  true,
  true
);

INSERT INTO cars (profile_id, slug, make, model, year, price, mileage, fuel_type, engine_capacity, transmission, color, description, images, is_sold, is_featured) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  'bmw-320d-xdrive-2019-diesel',
  'BMW', '320d xDrive', 2019, 89000, 145000, 'Diesel', '2.0 TDI 190KM', 'Automatyczna', 'Czarny Metalik',
  'BMW 320d xDrive w doskonałym stanie technicznym i wizualnym. Samochód serwisowany w ASO, bezwypadkowy. Wyposażenie: skórzana tapicerka, nawigacja, kamera cofania, podgrzewane fotele, LED, asystent pasa ruchu. Komplet opon zimowych na alufelgach w cenie.',
  ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'],
  false, true
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'volkswagen-golf-viii-2021-benzyna',
  'Volkswagen', 'Golf VIII', 2021, 95000, 67000, 'Benzyna', '1.5 TSI 150KM', 'Manualna', 'Biały',
  'Volkswagen Golf VIII w wersji Style. Pierwszy właściciel, serwisowany w ASO. Wyposażenie premium: Digital Cockpit Pro, nawigacja Discover Pro, LED Matrix, ACC, Lane Assist, podgrzewane fotele.',
  ARRAY['https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'],
  false, true
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'toyota-corolla-2020-hybryda',
  'Toyota', 'Corolla', 2020, 72000, 89000, 'Hybryda', '1.8 Hybrid 122KM', 'Automatyczna (CVT)', 'Szary Metalik',
  'Toyota Corolla Hybrid — niezawodny i ekonomiczny samochód. Średnie spalanie w mieście poniżej 5l/100km. Bogata wersja wyposażenia Comfort: kamera cofania, czujniki parkowania, Toyota Safety Sense.',
  ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&h=600&fit=crop'],
  false, false
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'audi-a4-avant-2018-diesel',
  'Audi', 'A4 Avant', 2018, 78000, 178000, 'Diesel', '2.0 TDI 150KM', 'Automatyczna (S-Tronic)', 'Granatowy Metalik',
  'Audi A4 Avant w wersji Sport. Zadbany, regularnie serwisowany. Wyposażenie: Virtual Cockpit, MMI Navigation Plus, skóra, 3-strefowa klimatyzacja, podgrzewane fotele, elektryczna klapa bagażnika.',
  ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop'],
  true, false
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'mercedes-benz-c-200-2020-benzyna',
  'Mercedes-Benz', 'C 200', 2020, 119000, 95000, 'Benzyna', '1.5 Turbo 204KM', 'Automatyczna (9G-Tronic)', 'Srebrny Metalik',
  'Mercedes-Benz C 200 sedan, pakiet AMG Line. Stan idealny, zero korozji. Pełna historia serwisowa w ASO. MBUX, Burmester, panoramiczny dach, kamera 360°, Multibeam LED.',
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'],
  false, true
);
