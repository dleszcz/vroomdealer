'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  Zap,
  Clock,
  Phone,
  MapPin,
  Sparkles,
  ChevronDown,
  Layers,
  MessageSquare,
  Truck,
  Check,
} from 'lucide-react';
import { ScoutPartnerForm } from './scout-partner-form';
import { Logo } from './logo';

export function ScoutLanding() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState(false);

  const handleOpenLead = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken || cleanToken.length < 5) {
      setTokenError(true);
      return;
    }
    // If user pasted a full URL, extract the token part
    const matches = cleanToken.match(/[0-9a-f-]{10,}/i);
    const finalToken = matches ? matches[0] : cleanToken;
    router.push(`/lead/${finalToken}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2" aria-label="VroomScout, strona główna">
              <Logo inverted suffix="Scout" />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Zap className="w-3 h-3" /> Partner Engine
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#token-lookup"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Weryfikacja leada
            </a>
            <a
              href="#dolacz-do-sieci"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98"
            >
              Dołącz do sieci odkupu
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-radial from-blue-950/30 via-slate-950/0 to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bezpośrednie zgłoszenia od klientów indywidualnych</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Gotowe leady na odkup aut z Twojej okolicy <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              wprost na Twój telefon
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-400 leading-relaxed">
            Klienci indywidualni codziennie wyceniają swoje samochody na naszych portalach skupowych (m.in. AutoZglowy.pl, ZdajAuto.pl). Przekazujemy ich zgłoszenia <strong>na wyłączność</strong> do sprawdzonych partnerów w regionie.
          </p>

          {/* Quick CTA & Token Jump */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#dolacz-do-sieci"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/20 transition-all active:scale-98"
            >
              <span>Zgłoś swój skup do sieci partnerów</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#token-lookup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-sm sm:text-base transition-all"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Otwórz kartę wyceny leada</span>
            </a>
          </div>

          {/* Key Trust Counters */}
          <div className="pt-8 sm:pt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="block font-black text-xl sm:text-2xl text-white">100%</span>
              <span className="text-xs text-slate-400 font-medium">Wyłączność na zgłoszenie</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="block font-black text-xl sm:text-2xl text-emerald-400">0 zł</span>
              <span className="text-xs text-slate-400 font-medium">Opłat za start w pilotażu</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="block font-black text-xl sm:text-2xl text-blue-400">&lt; 2 min</span>
              <span className="text-xs text-slate-400 font-medium">Czas dostarczenia leada</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="block font-black text-xl sm:text-2xl text-white">Zdjęcia + opis</span>
              <span className="text-xs text-slate-400 font-medium">Kompletne dane techniczne</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Token Lookup Card */}
      <section id="token-lookup" className="py-12 sm:py-16 bg-slate-900/70 border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Otrzymałeś powiadomienie SMS lub e-mail z tokenem leada?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Wklej unikalny identyfikator zgłoszenia lub link, aby od razu przejść do dedykowanej karty pojazdu.
                </p>
              </div>
            </div>

            <form onSubmit={handleOpenLead} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="np. 3f450a84-2517-4d9b-9e27-e05f221f2202"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    setTokenError(false);
                  }}
                  className={`w-full h-13 px-4 rounded-2xl bg-slate-900 border ${
                    tokenError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-700'
                  } text-white font-mono text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-colors`}
                />
              </div>

              {tokenError && (
                <p className="text-xs text-red-400 font-medium">
                  Wpisz poprawny identyfikator tokena (skopiowany z wiadomości e-mail lub SMS).
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Otwórz mobilną kartę leada</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How it works for partners */}
      <section className="py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
              Model współpracy
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 tracking-tight">
              Jak VroomScout dostarcza auta do Twojego skupu?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Zamiast czekać na telefony z ogłoszeń lub licytować się z 15 handlarzami w grupach na Facebooku, otrzymujesz gotowe zgłoszenia prosto z okolicy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-3xl font-black text-slate-700">01</span>
              <h3 className="text-lg font-bold text-white">Klient zgłasza auto online</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Właściciel pojazdu wypełnia formularz na AutoZglowy.pl lub ZdajAuto.pl. Podaje rocznik, paliwo, stan techniczny, usterki, oczekiwaną kwotę oraz dodaje zdjęcia.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-3xl font-black text-blue-500">02</span>
              <h3 className="text-lg font-bold text-white">Automatyczny routing i wyłączność</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Silnik VroomScout weryfikuje lokalizację klienta i przypisuje lead wyłącznie do jednego partnera w danym powiecie. Klient nie jest bombardowany dziesiątkami telefonów.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-3xl font-black text-emerald-400">03</span>
              <h3 className="text-lg font-bold text-white">Kontakt 1-Click i odkup</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Otrzymujesz interaktywną kartę leada. Jednym kliknięciem wybierasz numer lub piszesz na WhatsApp z predefiniowaną wiadomością. Umawiasz odbiór i finalizujesz transakcję.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
              Dlaczego warto
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Przewagi sieci VroomScout nad tradycyjnym skupem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-base text-white">Brak licytacji z konkurencją</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Zgłoszenie nie trafia na otwartą giełdę. Klient czeka na kontakt wyłącznie od Ciebie jako zaufanego partnera regionalnego.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <Clock className="w-6 h-6 text-blue-400" />
              <h4 className="font-bold text-base text-white">Szybkość działania</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dostajesz powiadomienie e-mail i webhook w ułamku sekundy od momentu wysłania formularza przez klienta.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <MapPin className="w-6 h-6 text-purple-400" />
              <h4 className="font-bold text-base text-white">Własny zasięg geograficzny</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Sam decydujesz, z jakich miast, powiatów czy województw chcesz pozyskiwać auta. Nie dostajesz zgłoszeń z drugiego końca Polski.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <Car className="w-6 h-6 text-amber-400" />
              <h4 className="font-bold text-base text-white">Pełna transparentność stanu</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Wiesz od razu, czy auto odpala, czy ma ważne OC, kiedy kończy się badanie techniczne i jaka jest oczekiwana kwota klienta.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <MessageSquare className="w-6 h-6 text-sky-400" />
              <h4 className="font-bold text-base text-white">Gotowy szablon WhatsApp</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Jeśli w zgłoszeniu brakuje zdjęć, jednym kliknięciem wysyłasz do klienta szablon prośby o dosłanie fotek na WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <Layers className="w-6 h-6 text-indigo-400" />
              <h4 className="font-bold text-base text-white">Integracja z VroomDealer</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Pozyskane pojazdy możesz w przyszłości jednym kliknięciem przenieść do swojej oferty sprzedaży na stronie www i portalach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Application Form */}
      <section id="dolacz-do-sieci" className="py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
              Program pilotażowy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Dołącz do sieci odkupu aut w swoim regionie
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Poszukujemy sprawdzonych komisów, skupów aut i przedsiębiorców z branży motoryzacyjnej, którzy chcą otrzymywać stały dopływ aut od osób prywatnych.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  Darmowy udział w etapie testowym dla pierwszych 20 partnerów regionalnych.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  Elastyczny profil aut: auta sprawne, powypadkowe, dostawcze lub do poprawek.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  Bezpośredni kontakt z zespołem inżynierów VroomDealer.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              Prowadzisz komis i szukasz także dedykowanej strony WWW lub systemu CRM?{' '}
              <a href="https://vroomdealer.pl" className="text-blue-400 hover:underline font-bold">
                Sprawdź pełny ekosystem VroomDealer.pl →
              </a>
            </div>
          </div>

          <div>
            <ScoutPartnerForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-slate-950 text-slate-500 text-xs text-center border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex justify-center pb-1">
            <Logo inverted suffix="Scout" />
          </div>
          <p className="font-semibold text-slate-400">
            VroomScout Partner Engine — Moduł ekosystemu VroomDealer dedykowany pozyskiwaniu aut dla branży motoryzacyjnej.
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <a href="https://vroomdealer.pl" className="hover:text-white transition-colors">
              Platforma VroomDealer.pl
            </a>
            <span>•</span>
            <a href="https://autozglowy.pl" target="_blank" className="hover:text-white transition-colors">
              AutoZglowy.pl
            </a>
            <span>•</span>
            <a href="https://zdajauto.pl" target="_blank" className="hover:text-white transition-colors">
              ZdajAuto.pl
            </a>
          </div>
          <p className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} VroomDealer. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}
