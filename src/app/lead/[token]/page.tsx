import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import {
  Phone,
  MapPin,
  Calendar,
  Fuel,
  MessageSquare,
  AlertTriangle,
  Check,
  ChevronDown,
  Gauge,
  Zap,
} from 'lucide-react';
import { Logo } from '@/components/site/logo';
import { LeadGallery } from '@/components/lead/lead-gallery';
import { LeadQuickResponse } from '@/components/lead/lead-quick-response';
import { formatPolishGreeting, formatPolishVocative } from '@/lib/greeting';

interface LeadPageProps {
  params: Promise<{
    token: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function fetchLeadData(token: string) {
  if (!token || token.length < 4) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xfagkubntiqvrvbmoira.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_jVG5YKjSeT7YwPk188_jxg_yFlMFt0A";

  let lead: any = null;

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);

      // 1. Query scout_leads by access_token (supports short tokens once column is text, and legacy UUIDs)
      try {
        const { data, error } = await supabase
          .from('scout_leads')
          .select('*')
          .eq('access_token', token)
          .single();

        if (!error && data) {
          lead = data;
        }
      } catch {
        // ignore uuid cast error if column is not yet altered
      }

      // 2. Short prefix match for old 36-char leads (e.g. token '3f450a84' matches '3f450a84-2517-4d9b...')
      if (!lead && token.length >= 6 && token.length <= 12) {
        try {
          const { data } = await supabase
            .from('scout_leads')
            .select('*')
            .ilike('access_token', `${token}%`)
            .limit(1)
            .single();

          if (data) {
            lead = data;
          }
        } catch {
          // ignore
        }
      }

      // 3. Backward match: if someone clicks old 36-char link after DB was truncated to 8 chars
      if (!lead && isUuid) {
        try {
          const shortPart = token.substring(0, 8);
          const { data } = await supabase
            .from('scout_leads')
            .select('*')
            .eq('access_token', shortPart)
            .single();

          if (data) {
            lead = data;
          }
        } catch {
          // ignore
        }
      }

      // 4. Query scout_leads by id (only if token is a valid UUID)
      if (!lead && isUuid) {
        try {
          const { data: dataById } = await supabase
            .from('scout_leads')
            .select('*')
            .eq('id', token)
            .single();

          if (dataById) {
            lead = dataById;
          }
        } catch {
          // ignore
        }
      }

      // 3. Fallback to general leads table (only if token is a valid UUID)
      if (!lead && isUuid) {
        try {
          const { data: generalLead } = await supabase
            .from('leads')
            .select('*')
            .eq('id', token)
            .single();

        if (generalLead) {
          const veh = (generalLead.vehicle_details || {}) as Record<string, any>;
          lead = {
            id: generalLead.id,
            access_token: generalLead.id,
            source_domain: generalLead.source || 'VroomDealer',
            category: 'osobowe',
            make_model: veh.brand ? `${veh.brand} ${veh.model || ''}`.trim() : (generalLead.customer_name || 'Pojazd ze zgłoszenia'),
            year: veh.year || 2018,
            fuel: veh.fuelType || 'diesel',
            condition: veh.condition || 'bardzo_dobry',
            condition_notes: veh.note || null,
            price_bracket: veh.expectedPrice ? `${veh.expectedPrice} zł` : 'Czeka na wycenę',
            city: veh.city || generalLead.local_seo_city || 'Polska',
            customer_name: generalLead.customer_name || 'Klient',
            customer_phone: generalLead.customer_phone,
            photo_urls: [],
            created_at: generalLead.created_at,
            status: generalLead.status || 'new',
          };
        }
      } catch {
        // ignore
      }
    }

      // 4. Fallback Bridge: Query VroomScout engine API directly
      if (!lead) {
        const isLocalHost = process.env.NODE_ENV !== 'production';
        const scoutOrigins = isLocalHost
          ? ['http://localhost:3003', 'https://autozglowy.pl', 'https://zdajauto.pl']
          : ['https://autozglowy.pl', 'https://zdajauto.pl'];

        for (const origin of scoutOrigins) {
          try {
            const apiRes = await fetch(`${origin}/api/lead-by-token?token=${encodeURIComponent(token)}`, {
              cache: 'no-store',
              signal: AbortSignal.timeout(3000),
            });
            if (apiRes.ok) {
              const resData = await apiRes.json();
              if (resData?.lead) {
                lead = resData.lead;
                break;
              }
            }
          } catch {
            // ignore and try next origin
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching lead by token in VroomDealer:', e);
    }
  }

  return lead;
}

export async function generateMetadata({ params }: LeadPageProps): Promise<Metadata> {
  const { token } = await params;
  const lead = await fetchLeadData(token);

  if (!lead) {
    return {
      title: 'Karta wyceny pojazdu | VroomScout',
      robots: { index: false, follow: false },
    };
  }

  const isZdajAuto = lead.source_domain?.toLowerCase().includes('zdajauto');
  const brandLabel = isZdajAuto ? 'ZdajAuto.pl' : 'AutoZglowy.pl';
  const priceDisplay = lead.price_bracket || (lead.expected_price ? `${Number(lead.expected_price).toLocaleString('pl-PL')} zł` : 'Wycena');

  // Extract mileage/power for preview if present in condition notes or fields
  const mileageMatch = lead.condition_notes?.match(/Przebieg:\s*([0-9\s]+(?:\s*km)?)/i);
  const powerMatch = lead.condition_notes?.match(/Moc(?:\s*silnika)?:\s*([0-9\s]+(?:\s*KM)?)/i);
  const mileage = lead.mileage || (mileageMatch ? mileageMatch[1].trim() : null);
  const enginePower = lead.engine_power || (powerMatch ? powerMatch[1].trim() : null);

  const title = `${lead.make_model} (${lead.year}) • ${priceDisplay} • ${lead.city}`;
  
  const specsParts = [
    lead.fuel ? lead.fuel.toUpperCase() : '',
    mileage ? `Przebieg: ${mileage}` : '',
    enginePower ? `Moc: ${enginePower}` : '',
    lead.city ? `Lokalizacja: ${lead.city}` : '',
  ].filter(Boolean);

  const description = `Zgłoszenie odkupu z ${brandLabel}. ${specsParts.join(' • ')}. Zobacz zdjęcia pojazdu i bezpośredni kontakt do klienta.`;
  const firstPhoto = Array.isArray(lead.photo_urls) && lead.photo_urls.length > 0 ? lead.photo_urls[0] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://scout.vroomdealer.pl/${token}`,
      siteName: `VroomScout (${brandLabel})`,
      images: firstPhoto ? [{ url: firstPhoto, width: 1200, height: 900, alt: lead.make_model }] : undefined,
      type: 'website',
      locale: 'pl_PL',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: firstPhoto ? [firstPhoto] : undefined,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

function getLeadFreshness(createdAt: string | Date) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - createdDate.getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 5) {
    return { label: '🔥 Przed chwilą', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  }
  if (diffMins < 60) {
    return { label: `⚡ ${diffMins} min temu`, badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  }
  if (diffHours < 2) {
    return { label: '⚡ 1 godz. temu', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (diffHours < 24) {
    return { label: `${diffHours} godz. temu`, badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (diffDays === 1) {
    return { label: 'Wczoraj', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
  return { label: `${diffDays} dni temu`, badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' };
}

export default async function LeadDetailPage({ params }: LeadPageProps) {
  const { token } = await params;

  if (!token || token.length < 4) {
    notFound();
  }

  const lead = await fetchLeadData(token);

  // If lead is not found
  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-2xl">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Nie znaleziono zgłoszenia
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Zgłoszenie o identyfikatorze <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono text-xs">{token.slice(0, 16)}</code> wygasło, zostało już obsłużone lub podany link jest niekompletny.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 text-left space-y-2">
            <p className="font-semibold text-slate-300">Potrzebujesz pomocy?</p>
            <p className="leading-relaxed">
              Skontaktuj się bezpośrednio z opiekunem sieci VroomScout pod numerem{" "}
              <a href="tel:+48577022555" className="text-blue-400 font-bold hover:underline">
                +48 577 022 555
              </a>{" "}
              lub napisz na{" "}
              <a href="mailto:biuro@vroomdealer.pl" className="text-blue-400 font-bold hover:underline">
                biuro@vroomdealer.pl
              </a>.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all"
            >
              Powrót do strony głównej
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isZdajAuto = lead.source_domain?.toLowerCase().includes('zdajauto');
  const brandLabel = isZdajAuto ? 'ZdajAuto.pl' : 'AutoZglowy.pl';
  const freshness = getLeadFreshness(lead.created_at);

  const conditionLabels: Record<string, string> = {
    bardzo_dobry: 'Bardzo dobry (sprawny, wsiadać i jechać)',
    drobne_poprawki: 'Drobne poprawki (blacharka / kosmetyka / eksploatacja)',
    wymaga_naprawy: 'Wymaga naprawy mechanicznej (silnik, skrzynia itp.)',
    niesprawny: 'Powypadkowy / Nie odpala / Po kolizji',
  };

  const cleanPhone = (lead.customer_phone || '').replace(/[^0-9]/g, '');

  const hasNoInsurance =
    lead.condition_notes?.includes('BRAK WAŻNEGO OC') || lead.no_insurance;
  const hasNoMot =
    lead.condition_notes?.includes('BRAK WAŻNEGO PRZEGLĄDU') || lead.no_mot;

  // Extract mileage, engine power and portals status if present in notes or dedicated fields
  const mileageMatch = lead.condition_notes?.match(/Przebieg:\s*([0-9\s]+(?:\s*km)?)/i);
  const powerMatch = lead.condition_notes?.match(/Moc(?:\s*silnika)?:\s*([0-9\s]+(?:\s*KM)?)/i);
  const mileage = lead.mileage || (mileageMatch ? mileageMatch[1].trim() : null);
  const enginePower = lead.engine_power || (powerMatch ? powerMatch[1].trim() : null);

  const isListedOnPortals =
    lead.condition_notes?.includes('Wystawione na portalach') || lead.is_listed_on_portals;
  const isOffMarket =
    lead.condition_notes?.includes('Tylko w VroomScout') ||
    lead.condition_notes?.includes('Off-market') ||
    (!isListedOnPortals && lead.condition_notes);

  // Clean condition notes (strip the technical tags for cleaner display)
  const cleanConditionNotes = (lead.condition_notes || '')
    .split('|')
    .map((s: string) => s.trim())
    .filter((s: string) => {
      if (!s) return false;
      if (s.includes('BRAK WAŻNEGO OC')) return false;
      if (s.includes('BRAK WAŻNEGO PRZEGLĄDU')) return false;
      if (s.includes('Wystawione na portalach')) return false;
      if (s.includes('Tylko w VroomScout')) return false;
      if (s.includes('Off-market')) return false;
      if (s.startsWith('Oczekiwana kwota:')) return false;
      if (s.startsWith('Przebieg:')) return false;
      if (s.startsWith('Moc:')) return false;
      return true;
    })
    .join(' • ');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-amber-200">
      {/* Top Header */}
      <header className="bg-slate-950 text-white py-3 px-4 sm:px-6 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo inverted suffix="Scout" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 shrink-0">
              Źródło: <strong>{brandLabel}</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24 sm:pb-28 space-y-6">
        {/* 1. Tytuł pojazdu, Data i Badges (Pełna szerokość na długą nazwę auta) */}
        <div className="space-y-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500">
                {new Date(lead.created_at).toLocaleString('pl-PL', {
                  timeZone: 'Europe/Warsaw',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${freshness.badgeClass}`}>
                {freshness.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
              {lead.make_model}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2.5 text-xs font-bold text-slate-700">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Rocznik: {lead.year}
              </span>
              {mileage && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5 font-mono">
                  <Gauge className="w-3.5 h-3.5 text-slate-500" />
                  {mileage.includes('km') ? mileage : `${mileage} km`}
                </span>
              )}
              {enginePower && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5 font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {enginePower.includes('KM') ? enginePower : `${enginePower} KM`}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5 uppercase">
                <Fuel className="w-3.5 h-3.5 text-slate-500" />
                {lead.fuel}
              </span>
              {isListedOnPortals && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold">
                  Na portalach
                </span>
              )}
            </div>
          </div>

          {/* Oczekiwana cena klienta & Stan i status pojazdu (Poniżej tytułu dla pełnej czytelności) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/90">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                Oczekiwania cenowe klienta
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-0.5 tracking-tight">
                {lead.price_bracket || 'Czeka na propozycję'}
              </div>
            </div>

            {/* Deklarowany stan auta i status OC / PT */}
            <div className="pt-2 sm:pt-0 border-t border-emerald-200/60 sm:border-t-0 space-y-1.5 text-xs sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5 text-slate-700">
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Stan:</span>
                <span className="font-extrabold text-slate-900">
                  {conditionLabels[lead.condition] || lead.condition}
                </span>
              </div>
              <div className="flex flex-wrap items-center sm:justify-end gap-1.5 pt-0.5">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                    hasNoInsurance
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {hasNoInsurance ? '⚠️ Brak OC (laweta)' : '✅ OC Ważne'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                    hasNoMot
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {hasNoMot ? '⚠️ Brak badania tech.' : '✅ Przegląd ważny'}
                </span>
              </div>
            </div>
          </div>
        </div>


          {/* 2. Zdjęcia pojazdu z pełnoekranową galerią (Lightbox) */}
          <LeadGallery
            photoUrls={lead.photo_urls || []}
            vehicleTitle={`${lead.make_model} (${lead.year})`}
            cleanPhone={cleanPhone}
            brandLabel={brandLabel}
          />

          {/* 5. Uwagi / opis mankamentów od klienta */}
          {cleanConditionNotes && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1">
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-amber-900 block">
                Uwagi / Opis mankamentów zgłoszone przez klienta
              </span>
              <p className="leading-relaxed font-medium text-slate-800">
                {cleanConditionNotes}
              </p>
            </div>
          )}

        {/* 5. Szybka odpowiedź z telefonu dealera: Kontroferta cenowa / Uprzejma odmowa (0 zł) */}
        <LeadQuickResponse
          vehicleTitle={`${lead.make_model} (${lead.year})`}
          brandLabel={brandLabel}
          customerName={lead.customer_name || 'Klient'}
          customerPhone={cleanPhone}
        />

        {/* 6. PRAKTYCZNY PORADNIK KUPCA (ROZWIJANY AKORDEON) */}
        <details className="group bg-slate-50/80 rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
          <summary className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50 transition-colors list-none">
            <div className="flex items-center gap-3 text-slate-900 font-extrabold text-sm sm:text-base">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span>Niezbędnik kupca – 6 praktycznych zasad odkupu</span>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Rozwiń
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5">
                  Wskazówki negocjacyjne, badanie motywacji i bezpieczna umowa K-S
                </p>
              </div>
            </div>
            <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 transition-transform duration-200 group-open:rotate-180">
              <ChevronDown className="w-5 h-5" />
            </div>
          </summary>

          <div className="p-4 sm:p-7 pt-2 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              {/* 1. Technika widełek i badanie motywacji */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                    1
                  </span>
                  Widełki cenowe & Badanie motywacji
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Nigdy nie podawaj jednej sztywnej kwoty przez telefon. Zapytaj wprost:
                </p>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs italic text-slate-800 leading-relaxed">
                  &ldquo;{formatPolishGreeting(lead.customer_name)}, dzwonię z {brandLabel} z sieci VroomDealer. Wstępnie przy tym roczniku i modelu płacimy w granicach {lead.price_bracket ? 'widełek zbliżonych do oczekiwań' : 'rynkowych stawek odkupu'}. Zaznaczył Pan pewne mankamenty – co dokładnie jest do zrobienia i czy nowe auto już czeka?&rdquo;
                </div>
                <p className="text-[11px] text-slate-500">
                  💡 Jeśli nowe auto już czeka pod domem, klient chce po prostu świętego spokoju i natychmiastowej gotówki.
                </p>
              </div>

              {/* 2. Logistyka i stan 'na zimno' przed wyjazdem */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                    2
                  </span>
                  Logistyka dojazdu & Stan &ldquo;na zimno&rdquo;
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Przed wysłaniem kierowcy lub wyjazdem lawetą doprecyzuj kwestie techniczne:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Nie rozgrzewać silnika:</strong> Poproś, by auto stało zimne. Chcesz usłyszeć zimny rozruch (rozrząd, dwumasa, kopcenie).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Laweta vs Koła:</strong> {hasNoInsurance || hasNoMot ? 'Pojazd nie ma ważnego OC/PT – jedź od razu z autolawetą!' : 'Jeśli ma jechać na kołach, upewnij się, że nie gotuje płynu i ma sprawne hamulce.'}</span>
                  </li>
                </ul>
              </div>

              {/* 3. Weryfikacja dokumentów i współwłaścicieli */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                    3
                  </span>
                  Weryfikacja formalna (Właściciele)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Współwłaściciel w dowodzie:</strong> Jeśli w dowodzie jest małżonek lub współwłaściciel, musi być obecny lub zostawić pełnomocnictwo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Ciągłość umów:</strong> Jeśli klient nie przerejestrował auta, musi posiadać oryginały wszystkich poprzednich umów K-S.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Karta pojazdu & Klucze:</strong> Zapytaj o kartę pojazdu (sprzed 09.2022) oraz 2 komplety kluczyków.</span>
                  </li>
                </ul>
              </div>

              {/* 4. Oględziny bez marudzenia */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                    4
                  </span>
                  Oględziny na żywo (Matematyka vs Marudzenie)
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Sprzedający wybrał skup, bo ma dość marudnych oglądaczy. Pokaż mu transparentne liczby:
                </p>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs italic text-slate-800 leading-relaxed">
                  &ldquo;{formatPolishVocative(lead.customer_name) ? `${formatPolishVocative(lead.customer_name)}, ` : ''}auto ma swoje lata i normalne ślady. Nasza propozycja uwzględnia to, że musimy zrobić serwis olejowy i naprawy. Oferuję kwotę X zł gotówką od ręki, spisujemy umowę i zabieramy auto.&rdquo;
                </div>
              </div>

              {/* 5. Płatność od ręki */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                    5
                  </span>
                  Płatność: Gotówka lub Express Elixir
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Pewna gotówka do ręki lub natychmiastowy przelew w obecności klienta (z potwierdzeniem PDF) zamyka 85% wahań cenowych.
                </p>
                <p className="text-[11px] text-slate-500">
                  💡 Zawsze miej przy sobie gotowy blankiet pokwitowania odbioru gotówki.
                </p>
              </div>

              {/* 6. Umowa K-S: Bezpieczeństwo i zwrot OC */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                    6
                  </span>
                  Bezpieczna umowa K-S & Zwrot składki OC
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dokładna godzina i minuty:</strong> Wpisz na umowie godzinę wydania pojazdu. Chroni przed fotoradarami z drogi powrotnej.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Zwrot składki OC jako bonus:</strong> Poinformuj klienta, że zgłaszając zbycie odzyska niewykorzystaną składkę OC (często 200-500 zł ekstra dla niego!).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </details>
      </main>

      {/* ========================================================
          STICKY BOTTOM BAR (PRZYPIĘTY NA DOLE EKRANU MOBILNEGO)
      ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 py-2.5 sm:py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] text-white shadow-2xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 pr-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs sm:text-sm text-emerald-400 font-mono font-bold truncate">
                {lead.customer_phone}
              </span>
              <span className="text-slate-600 font-normal">•</span>
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {lead.customer_name || 'Klient'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 truncate flex items-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{lead.city || 'Polska'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={`sms:${cleanPhone}`}
              className="px-3 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>SMS</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-current shrink-0" />
              <span>Zadzwoń</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
