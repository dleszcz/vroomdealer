"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  Clock,
  Car,
  Layers,
  MessageSquare,
  Check,
  PhoneCall,
  MapPin,
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
    const matches = cleanToken.match(/[0-9a-f-]{10,}/i);
    const finalToken = matches ? matches[0] : cleanToken;
    router.push(`/lead/${finalToken}`);
  };

  return (
    <div className="min-h-screen bg-[#090B0E] text-zinc-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-[#090B0E]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2" aria-label="VroomScout, strona główna">
              <Logo inverted suffix="Scout" />
            </Link>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 pl-3 border-l border-zinc-800 hidden xs:inline-block">
              Sieć Odkupu Samochodów
            </span>
          </div>

          <div>
            <a
              href="https://vroomdealer.pl"
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              VroomDealer.pl →
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 sm:pt-22 pb-16 sm:pb-24 border-b border-zinc-800/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-[58px] font-extrabold text-white tracking-[-0.03em] leading-[1.12]">
              Auta od osób prywatnych bezpośrednio do Twojego skupu
            </h1>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Klienci indywidualni codziennie składają zapytania wyceny w naszych serwisach skupowych (m.in. AutoZglowy.pl, ZdajAuto.pl). Przekazujemy zweryfikowane zgłoszenia ze zdjęciami <strong>na wyłączność</strong> dla jednego partnera w Twoim rejonie.
          </p>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#formularz-partnerski"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-sm transition-all active:scale-98"
            >
              <span>Zgłoś swój skup do sieci</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#token-lookup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 font-semibold text-sm sm:text-base transition-all"
            >
              <Search className="w-4 h-4 text-zinc-400" />
              <span>Sprawdź kod leada</span>
            </a>
          </div>

          {/* Key Facts Bar */}
          <div className="pt-8 sm:pt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#11141C] border border-zinc-800/80">
              <span className="block font-extrabold text-base sm:text-lg text-white">Wyłączność</span>
              <span className="text-xs text-zinc-400 mt-1 block">1 partner na dany powiat, bez otwartych giełd</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#11141C] border border-zinc-800/80">
              <span className="block font-extrabold text-base sm:text-lg text-white">0 zł na start</span>
              <span className="text-xs text-zinc-400 mt-1 block">Brak prowizji i abonamentu w fazie testowej</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#11141C] border border-zinc-800/80">
              <span className="block font-extrabold text-base sm:text-lg text-white">Wycena i zdjęcia</span>
              <span className="text-xs text-zinc-400 mt-1 block">Oczekiwana cena, opis usterek i stan OC/badania</span>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#11141C] border border-zinc-800/80">
              <span className="block font-extrabold text-base sm:text-lg text-white">Bezpośredni kontakt</span>
              <span className="text-xs text-zinc-400 mt-1 block">Telefon i WhatsApp bezpośrednio do właściciela</span>
            </div>
          </div>
        </div>
      </section>

      {/* Token Lookup Console */}
      <section id="token-lookup" className="scroll-mt-20 py-12 sm:py-16 bg-[#0D1016] border-b border-zinc-800/80">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121620] border border-zinc-800 shadow-xl space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Otwórz kartę wyceny pojazdu
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Wklej token leada lub pełny odnośnik z powiadomienia e-mail / SMS.
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
                  className={`w-full h-12 px-4 rounded-xl bg-[#090B0E] border ${
                    tokenError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-zinc-700'
                  } text-white font-mono text-sm placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none transition-colors`}
                />
              </div>

              {tokenError && (
                <p className="text-xs text-red-400 font-medium">
                  Wpisz poprawny identyfikator zgłoszenia (np. z wiadomości e-mail lub SMS).
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Przejdź do karty pojazdu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How it works for partners */}
      <section className="py-16 sm:py-24 border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
              Przebieg procesu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Jak VroomScout przekazuje pojazdy do Twojego skupu?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Zamiast płacić za nieskuteczną reklamę i licytować się w grupach z setkami handlarzy, otrzymujesz ustrukturyzowane zgłoszenie bezpośrednio od osoby prywatnej.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Krok 1</span>
              <h3 className="text-base font-bold text-white">Klient zgłasza auto online</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Właściciel pojazdu wypełnia formularz na AutoZglowy.pl lub ZdajAuto.pl. Podaje rocznik, przebieg, stan techniczny, wady, oczekiwaną kwotę oraz dodaje zdjęcia.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">Krok 2</span>
              <h3 className="text-base font-bold text-white">Automatyczny routing regionalny</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Silnik VroomScout weryfikuje lokalizację klienta i przypisuje lead wyłącznie do jednego partnera w danym powiecie. Klient nie jest bombardowany dziesiątkami telefonów.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">Krok 3</span>
              <h3 className="text-base font-bold text-white">Bezpośrednia rozmowa i odkup</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Otrzymujesz gotową kartę leada z bezpośrednim numerem telefonu i szablonem WhatsApp. Negocjujesz, umawiasz oględziny i finalizujesz transakcję.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 border-b border-zinc-800/80 bg-[#0C0E14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
              Wartość biznesowa
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kluczowe przewagi modelu partnerskiego
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-sm sm:text-base text-white">Brak konkurencji o ten sam lead</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Zgłoszenie nie trafia na giełdę. Klient czeka na kontakt wyłącznie od Ciebie jako zaufanego partnera w regionie.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-2.5">
              <Clock className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-sm sm:text-base text-white">Szybkość powiadomień</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Dostajesz powiadomienie e-mail i powiązany link w ułamku sekundy od momentu kliknięcia wyceny przez klienta.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-2.5">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-sm sm:text-base text-white">Własny rejon działania</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Sam decydujesz, z jakich miast i powiatów chcesz pozyskiwać auta. Nie marnujesz czasu na zgłoszenia z odległych województw.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-2.5">
              <Car className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-sm sm:text-base text-white">Transparentny stan techniczny</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Wiesz od razu, czy auto odpala, czy ma ważne OC i badanie techniczne oraz jakiej kwoty oczekuje sprzedający.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-2.5">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-sm sm:text-base text-white">Gotowy szablon WhatsApp</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Jeśli w zgłoszeniu brakuje zdjęć, jednym kliknięciem wysyłasz do klienta szablon prośby o dosłanie fotek na WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11141C] border border-zinc-800 space-y-2.5">
              <Layers className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-sm sm:text-base text-white">Ekosystem VroomDealer</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Odkupione pojazdy możesz w przyszłości jednym kliknięciem przenieść do oferty sprzedaży na stronie www Twojego komisu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Application Form Section */}
      <section id="dolacz-do-sieci" className="py-16 sm:py-24 border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
              Rekrutacja partnerów regionalnych
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Zabezpiecz wyłączność na odkup aut w swoim rejonie
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Poszukujemy sprawdzonych komisów, skupów aut i przedsiębiorców z branży motoryzacyjnej, którzy chcą otrzymywać stały dopływ aut od osób prywatnych.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">
                  Darmowy udział w etapie testowym dla pierwszych 20 partnerów regionalnych.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">
                  Elastyczny profil aut: auta sprawne, powypadkowe, dostawcze lub do poprawek.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">
                  Bezpośredni kontakt z zespołem inżynierów i twórców VroomDealer.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#11141C] border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
              Prowadzisz komis i szukasz także dedykowanej strony WWW lub systemu CRM?{' '}
              <a href="https://vroomdealer.pl" className="text-blue-400 hover:underline font-bold">
                Sprawdź pełny ekosystem VroomDealer.pl →
              </a>
            </div>
          </div>

          <div id="formularz-partnerski" className="scroll-mt-24">
            <ScoutPartnerForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-14 bg-[#07090C] text-zinc-500 text-xs text-center border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex justify-center pb-1">
            <Logo inverted suffix="Scout" />
          </div>
          <p className="font-medium text-zinc-400">
            VroomScout Partner Engine — Moduł ekosystemu VroomDealer dedykowany pozyskiwaniu aut dla branży motoryzacyjnej.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-zinc-400 text-xs px-2">
            <a href="https://vroomdealer.pl" className="hover:text-white transition-colors">
              VroomDealer.pl
            </a>
            <span className="text-zinc-600 hidden xs:inline">•</span>
            <a href="https://autozglowy.pl" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              AutoZglowy.pl
            </a>
            <span className="text-zinc-600 hidden xs:inline">•</span>
            <a href="https://zdajauto.pl" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              ZdajAuto.pl
            </a>
            <span className="text-zinc-600 hidden xs:inline">•</span>
            <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">
              Polityka prywatności
            </Link>
          </div>
          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()} VroomDealer. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  );
}
