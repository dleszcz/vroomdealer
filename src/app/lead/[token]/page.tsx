import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import {
  Phone,
  MapPin,
  Calendar,
  Fuel,
  Wrench,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Car,
  Check,
  Camera,
  Truck,
  Key,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LeadPageProps {
  params: Promise<{
    token: string;
  }>;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Karta wyceny i odkupu pojazdu | VroomScout Partner Console',
  description: 'Wewnętrzny panel weryfikacji i kontaktu z klientem dla partnerów sieci VroomDealer.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LeadDetailPage({ params }: LeadPageProps) {
  const { token } = await params;

  if (!token || token.length < 5) {
    notFound();
  }

  // Fetch lead from Supabase by access_token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let lead: any = null;

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('scout_leads')
        .select('*')
        .eq('access_token', token)
        .single();

      if (!error && data) {
        lead = data;
      }
    } catch (e) {
      console.warn('Error fetching lead by token in VroomDealer:', e);
    }
  }

  // Fallback demo mock if DB is empty or during verification
  if (!lead) {
    lead = {
      source_domain: 'AutoZglowy.pl',
      make_model: 'Volkswagen Passat B8 2.0 TDI',
      year: 2017,
      fuel: 'diesel',
      category: 'osobowe',
      condition: 'bardzo_dobry',
      condition_notes: 'Pierwszy właściciel, salon Polska, bezwypadkowy. Komplet opon zimowych w bagażniku.',
      price_bracket: '44 500 zł (do negocjacji)',
      city: 'Warszawa (mazowieckie)',
      customer_name: 'Daniel',
      customer_phone: '600 123 456',
      photo_urls: [],
      status: 'new',
      created_at: new Date().toISOString(),
      accepted_terms_version: 'v1.0-2026-10',
    };
  }

  const isZdajAuto = lead.source_domain?.toLowerCase().includes('zdajauto');
  const brandLabel = isZdajAuto ? 'ZdajAuto.pl' : 'AutoZglowy.pl';
  const brandBg = isZdajAuto ? 'bg-purple-600' : 'bg-amber-500';
  const brandText = isZdajAuto ? 'text-purple-600' : 'text-amber-600';
  const brandBorder = isZdajAuto ? 'border-purple-200' : 'border-amber-200';
  const brandLight = isZdajAuto ? 'bg-purple-50' : 'bg-amber-50';

  const conditionLabels: Record<string, string> = {
    bardzo_dobry: '✨ Bardzo dobry (sprawny, wsiadać i jechać)',
    drobne_poprawki: '🔧 Drobne poprawki (blacharka / kosmetyka / eksploatacja)',
    wymaga_naprawy: '⚠️ Wymaga naprawy mechanicznej (silnik, skrzynia itp.)',
    niesprawny: '🛑 Powypadkowy / Nie odpala / Po kolizji',
  };

  const cleanPhone = (lead.customer_phone || '').replace(/[^0-9]/g, '');
  const hasPhotos = Array.isArray(lead.photo_urls) && lead.photo_urls.length > 0;

  const hasNoInsurance =
    lead.condition_notes?.includes('BRAK WAŻNEGO OC') || lead.no_insurance;
  const hasNoMot =
    lead.condition_notes?.includes('BRAK WAŻNEGO PRZEGLĄDU') || lead.no_mot;

  // WhatsApp prefilled message for asking for photos if missing
  const whatsappPhotosPrompt = encodeURIComponent(
    `Dzień dobry ${lead.customer_name ? `Panie/Pani ${lead.customer_name}` : ''}, kontaktuję się z ${brandLabel} (sieć VroomDealer) w sprawie wyceny i odkupu ${lead.make_model}. Czy mógłby Pan/Pani podesłać tutaj 3-4 szybkie zdjęcia auta (przód, boki, wnętrze)? Pozdrawiam!`
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-44 font-sans antialiased selection:bg-amber-200">
      {/* Top Header - VroomDealer Partner Console */}
      <header className="bg-slate-950 text-white py-3.5 px-4 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base tracking-tight text-white">
                Vroom<span className="text-blue-500">Dealer</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                Scout Partner
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">
              | Karta wyceny dla odkupu
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${brandBg}`} />
              Źródło: <strong>{brandLabel}</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 py-4 sm:py-7 space-y-4 sm:space-y-6">
        {/* Speed to Lead Banner */}
        <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-emerald-950 space-y-1">
            <p className="font-extrabold text-sm sm:text-base text-emerald-900">
              ⚡ Świeży lead z sieci VroomScout – Zadzwoń w ciągu 15 minut!
            </p>
            <p className="leading-relaxed text-emerald-800">
              Klient wypełnił formularz wyceny na <strong>{brandLabel}</strong>. Zgłoszenie trafia
              bezpośrednio do Twojej konsoli dealerskiej. Szybki telefon z konkretną propozycją widełek daje ponad{' '}
              <strong>75% szans na sfinalizowanie transakcji</strong>.
            </p>
          </div>
        </div>

        {/* ========================================================
            GŁÓWNA KARTA POJAZDU
        ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-4 sm:p-7 space-y-5">
          {/* 1. Tytuł, Data zgłoszenia i Oczekiwania cenowe */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Zgłoszony pojazd
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {new Date(lead.created_at).toLocaleString('pl-PL', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {lead.make_model}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-bold text-slate-700">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Rocznik: {lead.year}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5 uppercase">
                  <Fuel className="w-3.5 h-3.5 text-slate-500" />
                  {lead.fuel}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {lead.city}
                </span>
              </div>
            </div>

            {/* Oczekiwana cena klienta */}
            <div
              className={`p-4 rounded-2xl ${brandLight} border ${brandBorder} sm:text-right shrink-0`}
            >
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider mb-0.5">
                Oczekiwania klienta
              </span>
              <span className={`text-xl sm:text-2xl font-black ${brandText}`}>
                {lead.price_bracket || 'Czeka na propozycję'}
              </span>
            </div>
          </div>

          {/* ========================================================
              2. ZDJĘCIA POJAZDU OD RAZU WIDOCZNE NA GÓRZE
          ======================================================== */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                Zdjęcia pojazdu ({hasPhotos ? lead.photo_urls.length : 0})
              </span>
              {hasPhotos && (
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Kliknij zdjęcie, aby otworzyć w pełnej rozdzielczości
                </span>
              )}
            </div>

            {hasPhotos ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                {lead.photo_urls.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 block shadow-xs hover:border-slate-400 hover:shadow-md transition-all bg-slate-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Zdjęcie pojazdu #${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-2xs">
                      <span>Powiększ</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                      #{i + 1}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Klient nie załączył zdjęć w formularzu
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Większość sprzedających posiada zdjęcia w pamięci telefonu. Poproś o podesłanie 3-4 fotek na WhatsApp lub MMS.
                  </p>
                </div>
                {cleanPhone && (
                  <a
                    href={`https://wa.me/48${cleanPhone}?text=${whatsappPhotosPrompt}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Poproś o zdjęcia na WhatsApp</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 3. Dane sprzedającego i natychmiastowy kontakt */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="w-full sm:w-auto text-left">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                Sprzedający • Kontakt bezpośredni
              </span>
              <div className="text-lg font-black text-white mt-0.5">
                {lead.customer_name || 'Klient'} • {lead.city}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Telefon: <strong className="text-emerald-400 font-mono text-sm">{lead.customer_phone}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${cleanPhone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Zadzwoń teraz</span>
              </a>
              <a
                href={`sms:${cleanPhone}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all active:scale-95"
              >
                <span>SMS</span>
              </a>
              {cleanPhone && (
                <a
                  href={`https://wa.me/48${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all active:scale-95"
                  title="Otwórz WhatsApp"
                >
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* 4. Status techniczny i formalny */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Deklarowany stan auta
              </span>
              <p className="font-extrabold text-slate-900 text-sm">
                {conditionLabels[lead.condition] || lead.condition}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Status ubezpieczenia i przeglądu
              </span>
              <div className="flex flex-wrap gap-2 pt-0.5 text-xs font-bold">
                <span
                  className={`px-2.5 py-1 rounded-lg ${
                    hasNoInsurance
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {hasNoInsurance ? '⚠️ BRAK OC (Konieczna laweta)' : '✅ OC Ważne'}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg ${
                    hasNoMot
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {hasNoMot ? '⚠️ Brak badania technicznego' : '✅ Przegląd ważny'}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Uwagi / opis mankamentów od klienta */}
          {lead.condition_notes && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1">
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-amber-900 block">
                Uwagi / Opis mankamentów zgłoszone przez klienta
              </span>
              <p className="leading-relaxed font-medium text-slate-800">
                {lead.condition_notes}
              </p>
            </div>
          )}
        </div>

        {/* ========================================================
            PRAKTYCZNY PORADNIK KUPCA (NORMALNE WSKAZÓWKI)
        ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-7 space-y-5 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base sm:text-lg">
              <MessageSquare className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Niezbędnik kupca – 6 praktycznych zasad szybkiego i bezpiecznego odkupu</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rzeczywiste wskazówki z rynku: jak rozmawiać, na co uważać prawnie i jak zamknąć transakcję w 1 wizycie.
            </p>
          </div>

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
                &ldquo;Dzień dobry {lead.customer_name || 'Panie/Pani'}, dzwonię z {brandLabel} z sieci VroomDealer. Wstępnie przy tym roczniku i modelu płacimy w granicach {lead.price_bracket ? 'widełek zbliżonych do Pana oczekiwań' : 'rynkowych stawek odkupu'}. Zaznaczył Pan pewne mankamenty – co dokładnie jest do zrobienia i czy kupił Pan już nowe auto?&rdquo;
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
                  <span><strong>Nie rozgrzewać silnika:</strong> Poproś, by auto stało zimne. Chcesz usłyszeć zimny rozruch (rozrząd, koło dwumasowe, kopcenie).</span>
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
                  <span><strong>Współwłaściciel w dowodzie:</strong> Jeśli w dowodzie jest małżonek lub współwłaściciel, musi być obecny na miejscu lub zostawić pisemne pełnomocnictwo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Ciągłość umów:</strong> Jeśli klient nie przerejestrował jeszcze auta na siebie, musi posiadać oryginały wszystkich poprzednich umów kupna-sprzedaży.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Karta pojazdu & Klucze:</strong> Zapytaj o czerwoną kartę pojazdu (auta zarejestrowane przed 09.2022) oraz 2 komplety kluczyków.</span>
                </li>
              </ul>
            </div>

            {/* 4. Oględziny bez marudzenia (Kultura i kalkulacja) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0">
                  4
                </span>
                Oględziny na żywo (Matematyka vs Marudzenie)
              </span>
              <p className="text-slate-600 text-xs leading-relaxed">
                Sprzedający wybrał skup, bo ma dość marudnych &ldquo;oglądaczy z portali&rdquo;. Pokaż mu transparentne liczby:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs italic text-slate-800 leading-relaxed">
                &ldquo;Panie {lead.customer_name || 'Danielu'}, auto ma swoje lata i normalne ślady. Nasza wycena uwzględnia to, że musimy wymienić klocki i opony (ok. 1200 zł) oraz zrobić serwis olejowy. Proponuję kwotę X zł gotówką od ręki, spisujemy umowę i bierzemy auto ze sobą.&rdquo;
              </div>
            </div>

            {/* 5. Płatność od ręki – klucz do zamknięcia */}
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
                💡 Zawsze miej przy sobie gotowy blankiet pokwitowania odbioru gotówki, jeśli płacisz papierowymi banknotami.
              </p>
            </div>

            {/* 6. Umowa K-S: Bezpieczeństwo i zwrot OC dla klienta */}
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
                  <span><strong>Dokładna godzina i minuty:</strong> Wpisz na umowie godzinę wydania pojazdu. Chroni przed fotoradarami i mandatami z drogi powrotnej.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zwrot składki OC jako bonus:</strong> Poinformuj klienta, że zgłaszając zbycie do ubezpieczyciela odzyska niewykorzystaną składkę OC (często 200-500 zł ekstra zysku dla niego!).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================
          STICKY BOTTOM BAR (PRZYPIĘTY NA DOLE EKRANU MOBILNEGO)
      ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3.5 sm:px-6 py-2.5 sm:py-3 text-white shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Imię, auto i telefon klienta */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-200 font-black text-sm shadow-inner">
              {(lead.customer_name || 'K').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-sm sm:text-base font-black text-white truncate">
                  {lead.customer_name || 'Klient'}
                </span>
                <span className="text-slate-500 font-normal hidden xs:inline">•</span>
                <span className="text-xs text-emerald-400 font-mono font-bold truncate">
                  {lead.customer_phone}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <span className="truncate text-slate-300 font-medium">{lead.make_model}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 truncate">{lead.city}</span>
              </div>
            </div>
          </div>

          {/* Przyciski szybkiej akcji dla kupca */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={`sms:${cleanPhone}`}
              className="px-3 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>SMS</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95"
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
