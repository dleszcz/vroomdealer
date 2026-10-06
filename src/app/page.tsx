import React from 'react';
import Link from 'next/link';
import { Car, Zap, Shield, Search, ArrowRight, LayoutTemplate, Database, Globe, MousePointerClick, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 !text-white shadow-md group-hover:bg-slate-800 transition-colors">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  VroomDealer
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="#funkcje" className="hover:text-slate-900 transition-colors">Funkcje</Link>
              <Link href="/dla-komisow" className="hover:text-slate-900 transition-colors">Dla Komisów (Marketplace)</Link>
              <Link href="/sprzedaj" className="hover:text-slate-900 transition-colors">Skup aut (Demo)</Link>
            </nav>
            <div className="flex items-center">
              <a 
                href={`${process.env.NEXT_PUBLIC_VROOMSITES_URL}/admin`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 !text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                Panel Logowania
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-32 relative bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-8 shadow-sm mx-auto">
            <Zap className="h-3.5 w-3.5 text-slate-900 fill-slate-900" />
            Platforma SaaS dla dealerów
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
            Nowoczesna strona Twojego komisu w <span className="text-slate-700">kilka minut.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Zostaw konkurencję w tyle. Uruchom ultra-szybką stronę www z wbudowanym systemem zarządzania autami, własną domeną i modułem do zbierania leadów na skup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#kontakt" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 !text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-md w-full sm:w-auto">
              Wypróbuj za darmo <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="#funkcje" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-sm w-full sm:w-auto">
              Zobacz funkcje
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="funkcje" className="py-20 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Wszystko, czego potrzebuje nowoczesny komis
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              VroomDealer to nie tylko strona www. To potężne narzędzie stworzone specjalnie z myślą o branży motoryzacyjnej.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ultra-szybkie działanie</h3>
              <p className="text-slate-600 leading-relaxed">
                Strony generowane na VroomDealer ładują się w ułamku sekundy dzięki technologii Edge Cache. Lepsze SEO i wyższa konwersja.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 mb-6">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Panel zarządzania autami</h3>
              <p className="text-slate-600 leading-relaxed">
                Wygodny panel (CRM) do dodawania samochodów, oznaczania jako "Sprzedane" i wyróżniania perełek w ofercie. Wszystko w jednym miejscu.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 mb-6">
                <LayoutTemplate className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Piękny, gotowy szablon</h3>
              <p className="text-slate-600 leading-relaxed">
                Koniec z szukaniem grafików. Otrzymujesz nowoczesny design premium, który budzi zaufanie klientów i automatycznie dopasowuje się do komórek.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Twoja własna domena</h3>
              <p className="text-slate-600 leading-relaxed">
                Podpinamy platformę pod Twój własny adres internetowy (np. mojkomis.pl) z darmowym certyfikatem SSL. Pełna niezależność marki.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 mb-6">
                <MousePointerClick className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Leady na skup aut</h3>
              <p className="text-slate-600 leading-relaxed">
                Wbudowany mechanizm formularzy pozwala Ci samodzielnie zbierać zgłoszenia od klientów, którzy chcą odsprzedać Ci swoje auto.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Brak prowizji</h3>
              <p className="text-slate-600 leading-relaxed">
                Płacisz tylko stały miesięczny abonament za korzystanie z technologii. Zero ukrytych kosztów od sprzedaży czy pozyskanego leada.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-0">
            <Car className="h-5 w-5 text-slate-900" />
            <span className="font-bold text-slate-900 tracking-tight">VroomDealer</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} VroomDealer. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </main>
  );
}
