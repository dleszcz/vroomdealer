"use client";

import React, { useState, useId } from "react";
import {
  Building2,
  Phone,
  Briefcase,
  Palette,
  Share2,
  MapPin,
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  FileCode2,
  ExternalLink,
} from "lucide-react";

interface OnboardingData {
  businessName: string;
  slug: string;
  nip: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  county: string;
  region: string;
  contactPhone: string;
  whatsappNumber: string;
  notificationEmail: string;
  // Features & Profile
  carBuying: boolean;
  carSales: boolean;
  financing: boolean;
  transport: boolean;
  tradeIn: boolean;
  customOrder: boolean;
  maxPurchasePrice: number;
  // Branding
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  heroImageUrl: string;
  fontFamily: string;
  heroTitle: string;
  heroSubtitle: string;
  // Links
  autoplacUrl: string;
  facebookUrl: string;
  otomotoUrl: string;
  // Local SEO
  seoCities: string;
}

const INITIAL_DATA: OnboardingData = {
  businessName: "",
  slug: "",
  nip: "",
  description: "",
  address: "",
  city: "",
  postalCode: "",
  county: "",
  region: "kujawsko-pomorskie",
  contactPhone: "",
  whatsappNumber: "",
  notificationEmail: "",
  carBuying: false,
  carSales: true,
  financing: true,
  transport: true,
  tradeIn: false,
  customOrder: true,
  maxPurchasePrice: 10000,
  primaryColor: "#DC2626",
  accentColor: "#EF4444",
  logoUrl: "",
  heroImageUrl: "/images/default-hero.webp",
  fontFamily: "Plus Jakarta Sans",
  heroTitle: "",
  heroSubtitle: "",
  autoplacUrl: "",
  facebookUrl: "",
  otomotoUrl: "",
  seoCities: "",
};

const COLOR_PRESETS = [
  { name: "Sport Crimson", primary: "#DC2626", accent: "#EF4444" },
  { name: "Oceanic Blue", primary: "#1686E0", accent: "#38BDF8" },
  { name: "Emerald Automotive", primary: "#059669", accent: "#10B981" },
  { name: "Amber Gold", primary: "#D97706", accent: "#F59E0B" },
  { name: "Carbon Graphite", primary: "#27272A", accent: "#71717A" },
];

const FONT_OPTIONS = [
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans (Nowoczesny & Precyzyjny)" },
  { id: "Outfit", label: "Outfit (Techniczny & Szeroki)" },
  { id: "Barlow Condensed", label: "Barlow Condensed (Mocny Sportowy)" },
  { id: "Inter", label: "Inter (Czysty & Minimalistyczny)" },
];

export function DealerOnboardingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [copiedType, setCopiedType] = useState<"json" | "sql" | null>(null);

  const formId = useId();

  const updateField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "businessName" && !prev.slug) {
        next.slug = (value as string)
          .toLowerCase()
          .replace(/[ąćęłńóśźż]/g, (m) => ({ ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" }[m] || m))
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return next;
    });
  };

  const generateCitiesArray = () => {
    return data.seoCities
      .split(/[,;\n]+/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
  };

  const generateConfigJson = () => {
    const cities = generateCitiesArray();
    const localPages = cities.map((city, idx) => ({
      slug: data.carBuying
        ? `skup-aut-${city.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
        : `samochody-uzywane-${city.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      city,
      enabled: true,
      indexable: true,
      priority: idx + 1,
      mode: data.carBuying ? "buying" : "sales",
      seo: {
        title: data.carBuying
          ? `Skup aut ${city} | ${data.businessName || "Salon"}`
          : `Samochody używane ${city} | ${data.businessName || "Salon"}`,
        h1: data.carBuying
          ? `Skup aut za gotówkę — ${city}`
          : `Sprawdzone samochody osobowe i dostawcze — ${city}`,
      },
    }));

    return JSON.stringify(
      {
        slug: data.slug || "nowy-dealer",
        businessName: data.businessName,
        nip: data.nip || null,
        description: data.description,
        contact: {
          phone: data.contactPhone,
          whatsapp: data.whatsappNumber || data.contactPhone,
          email: data.notificationEmail,
        },
        location: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          county: data.county,
          region: data.region,
        },
        branding: {
          primaryColor: data.primaryColor,
          accentColor: data.accentColor,
          logoUrl: data.logoUrl || null,
          heroImageUrl: data.heroImageUrl,
          fontFamily: data.fontFamily,
          heroTitle: data.heroTitle || `Sprawdzone samochody w ${data.city || "Twojej okolicy"}`,
          heroSubtitle: data.heroSubtitle || "Szeroki wybór pewnych aut z udokumentowaną historią.",
        },
        features: {
          carBuying: data.carBuying,
          carSales: data.carSales,
          financing: data.financing,
          transport: data.transport,
          tradeIn: data.tradeIn,
          customOrder: data.customOrder,
        },
        links: {
          autoplac: data.autoplacUrl || null,
          facebook: data.facebookUrl || null,
          otomoto: data.otomotoUrl || null,
        },
        localSeo: {
          primaryLocation: { city: data.city, region: data.region },
          localPages,
        },
      },
      null,
      2
    );
  };

  const generateSqlSeed = () => {
    const slug = data.slug || "nowy-dealer";
    const name = data.businessName || "Nowy Dealer";
    const phone = data.contactPhone || "";
    const city = data.city || "";
    const cities = generateCitiesArray();

    const localPagesJson = JSON.stringify(
      cities.map((c, idx) => ({
        slug: data.carBuying
          ? `skup-aut-${c.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
          : `samochody-uzywane-${c.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        city: c,
        enabled: true,
        indexable: true,
        priority: idx + 1,
        mode: data.carBuying ? "buying" : "sales",
      }))
    );

    return `-- Vroom Ecosystem Onboarding Seed
-- Dealer: ${name} (slug: ${slug})

INSERT INTO tenants (
  slug,
  business_name,
  business_description,
  logo_url,
  contact_phone,
  whatsapp_number,
  address,
  city,
  postal_code,
  county,
  region,
  branding,
  page_config,
  seo,
  local_seo,
  business_rules,
  autoplac_enabled
) VALUES (
  '${slug}',
  '${name.replace(/'/g, "''")}',
  '${data.description.replace(/'/g, "''")}',
  '${data.logoUrl || "/images/default-logo.svg"}',
  '${phone}',
  '${data.whatsappNumber || phone}',
  '${data.address.replace(/'/g, "''")}',
  '${city.replace(/'/g, "''")}',
  '${data.postalCode}',
  '${data.county}',
  '${data.region}',
  jsonb_build_object(
    'primaryColor', '${data.primaryColor}',
    'accentColor', '${data.accentColor}',
    'logoUrl', '${data.logoUrl || "/images/default-logo.svg"}',
    'heroImageUrl', '${data.heroImageUrl}',
    'fontFamily', '${data.fontFamily}',
    'heroTitle', '${(data.heroTitle || `Sprawdzone samochody w ${city}`).replace(/'/g, "''")}',
    'heroSubtitle', '${(data.heroSubtitle || "Szeroki wybór pewnych aut z gwarancją").replace(/'/g, "''")}'
  ),
  jsonb_build_object(
    'features', jsonb_build_object('carBuying', ${data.carBuying})
  ),
  jsonb_build_object(
    'metaTitle', '${name} - ${data.carBuying ? "Skup i Sprzedaż Samochodów" : "Sprzedaż Samochodów Używanych"}',
    'metaDescription', '${data.description.replace(/'/g, "''")}'
  ),
  jsonb_build_object(
    'primaryLocation', jsonb_build_object('city', '${city}', 'region', '${data.region}'),
    'localPages', '${localPagesJson}'::jsonb
  ),
  jsonb_build_object(
    'tradeIn', jsonb_build_object('enabled', ${data.tradeIn}),
    'purchasePriceLimit', jsonb_build_object('enabled', ${data.carBuying}, 'maxAmount', ${data.maxPurchasePrice}, 'currency', 'PLN')
  ),
  ${data.autoplacUrl ? "true" : "false"}
)
ON CONFLICT (slug) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  business_description = EXCLUDED.business_description,
  contact_phone = EXCLUDED.contact_phone,
  branding = EXCLUDED.branding,
  local_seo = EXCLUDED.local_seo,
  page_config = EXCLUDED.page_config;`;
  };

  const copyToClipboard = (text: string, type: "json" | "sql") => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight font-heading flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-emerald-400" />
          Kreator Wdrożenia Nowego Dealera
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Wprowadź komplet danych klienta, aby natychmiast wygenerować konfigurację profilu, silnik lokalnego SEO oraz skrypt do bazy danych.
        </p>
      </div>

      {/* Steps Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-8 text-xs font-semibold">
        {[
          { num: 1, label: "Firma" },
          { num: 2, label: "Adres" },
          { num: 3, label: "Profil" },
          { num: 4, label: "Branding" },
          { num: 5, label: "Integracje" },
          { num: 6, label: "Generator" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-2.5 rounded-md border text-center transition-all cursor-pointer ${
              step === s.num
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="font-mono text-slate-500 mb-0.5">0{s.num}</div>
            <div>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Krok 1: Dane Firmy i Identyfikacja
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Pełna nazwa salonu / komisu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Auto Centrum"
                  value={data.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Identyfikator (Slug w URL) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. auto-centrum"
                  value={data.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Adres witryny: <code>vroomdealer.pl/{data.slug || "slug"}</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  NIP Firmy (opcjonalnie)
                </label>
                <input
                  type="text"
                  placeholder="np. 8911234567"
                  value={data.nip}
                  onChange={(e) => updateField("nip", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Krótki opis działalności
                </label>
                <input
                  type="text"
                  placeholder="np. Sprzedaż sprawdzonych samochodów osobowych i dostawczych"
                  value={data.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              Krok 2: Adres i Kontakt
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ulica i numer lokalu
                </label>
                <input
                  type="text"
                  placeholder="np. ul. Długa 153A"
                  value={data.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Miejscowość *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Dąbrowa Biskupia"
                  value={data.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kod pocztowy
                </label>
                <input
                  type="text"
                  placeholder="np. 88-133"
                  value={data.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Powiat
                </label>
                <input
                  type="text"
                  placeholder="np. inowrocławski"
                  value={data.county}
                  onChange={(e) => updateField("county", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Główny telefon kontaktowy *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="np. 724 657 236"
                  value={data.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  E-mail do powiadomień o leadach
                </label>
                <input
                  type="email"
                  placeholder="kontakt@twojsalon.pl"
                  value={data.notificationEmail}
                  onChange={(e) => updateField("notificationEmail", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              Krok 3: Model Biznesowy i Zakres Usług
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-100 block">Prowadzi Skup Aut za gotówkę</span>
                  <span className="text-xs text-slate-400">Wyświetla formularz wyceny i stronę /skup-aut</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.carBuying}
                  onChange={(e) => updateField("carBuying", e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="p-4 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-100 block">Sprzedaż Aut z Placu</span>
                  <span className="text-xs text-slate-400">Katalog /samochody oraz wyszukiwarka w Hero</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.carSales}
                  onChange={(e) => updateField("carSales", e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="p-4 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-100 block">Finansowanie / Kredyt / Raty</span>
                  <span className="text-xs text-slate-400">Kafle usług oraz informacje o ratach</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.financing}
                  onChange={(e) => updateField("financing", e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="p-4 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-100 block">Dostawa Autolawetą pod dom</span>
                  <span className="text-xs text-slate-400">Transport zakupionego auta do klienta</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.transport}
                  onChange={(e) => updateField("transport", e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {data.carBuying && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Limit cenowy skupowanych aut (PLN)
                </label>
                <input
                  type="number"
                  value={data.maxPurchasePrice}
                  onChange={(e) => updateField("maxPurchasePrice", parseInt(e.target.value, 10) || 10000)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 font-mono"
                />
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-400" />
              Krok 4: Identyfikacja Wizualna, Kolory i Typografia
            </h2>

            {/* Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Szybkie Presety Kolorystyczne
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      updateField("primaryColor", p.primary);
                      updateField("accentColor", p.accent);
                    }}
                    className="px-3 py-1.5 rounded-md border border-slate-800 bg-slate-950 text-xs text-slate-300 flex items-center gap-2 hover:border-slate-700 cursor-pointer"
                  >
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kolor wiodący (Primary HEX)
                </label>
                <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-md px-3 py-2">
                  <input
                    type="color"
                    value={data.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={data.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-100 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Krój czcionki nagłówków
                </label>
                <select
                  value={data.fontFamily}
                  onChange={(e) => updateField("fontFamily", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Adres URL Logo (SVG / PNG)
                </label>
                <input
                  type="text"
                  placeholder="/images/logo.svg lub URL zewnętrzny"
                  value={data.logoUrl}
                  onChange={(e) => updateField("logoUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Adres URL zdjęcia Hero
                </label>
                <input
                  type="text"
                  placeholder="/images/default-hero.webp lub URL zewnętrzny"
                  value={data.heroImageUrl}
                  onChange={(e) => updateField("heroImageUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" />
              Krok 5: Integracje i Miasta do Lokalnego SEO
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Link do profilu na Autoplac.pl
                </label>
                <input
                  type="url"
                  placeholder="https://autoplac.pl/dealer/twoj-salon"
                  value={data.autoplacUrl}
                  onChange={(e) => updateField("autoplacUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Umożliwia automatyczny import floty i synchronizację ogłoszeń.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Link do strony na Facebooku / Instagramie
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/twojsalon"
                  value={data.facebookUrl}
                  onChange={(e) => updateField("facebookUrl", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Miejscowości do pozycjonowania Lokalnego SEO (oddzielone przecinkami)
                </label>
                <textarea
                  rows={3}
                  placeholder="np. Warszawa, Piaseczno, Pruszków, Legionowo, Otwock"
                  value={data.seoCities}
                  onChange={(e) => updateField("seoCities", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none resize-y"
                />
                <p className="text-xs text-slate-500 mt-1">
                  System automatycznie wygeneruje dedykowane podstrony SEO z ofertą dla każdej z tych miejscowości.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-emerald-400" />
              Krok 6: Gotowe Artefakty Wdrożeniowe
            </h2>

            <p className="text-sm text-slate-400">
              Kompletna konfiguracja dla nowego salonu została przygotowana. Możesz skopiować kod JSON lub gotowy skrypt SQL Supabase:
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard(generateConfigJson(), "json")}
                className="px-4 py-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                {copiedType === "json" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === "json" ? "Skopiowano JSON!" : "Kopiuj Konfigurację JSON"}</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(generateSqlSeed(), "sql")}
                className="px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                {copiedType === "sql" ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{copiedType === "sql" ? "Skopiowano SQL!" : "Kopiuj Skrypt SQL (Supabase Seed)"}</span>
              </button>
            </div>

            {/* Preview Box */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Podgląd generowanego skryptu SQL:
              </span>
              <pre className="p-4 rounded-md bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
                {generateSqlSeed()}
              </pre>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="px-4 py-2 rounded-md border border-slate-800 text-slate-300 text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Wstecz</span>
          </button>

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(6, s + 1))}
              className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Dalej</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Wszystkie dane skompletowane</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
