import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { PilotForm } from "@/components/site/pilot-form";

export const metadata: Metadata = {
  title: "VroomDealer: Uniwersalny ekosystem i strona WWW dla Twojego komisu",
  description:
    "Elastyczna platforma sprzedażowa, narzędzia do pozyskiwania aut ze skupu i profesjonalna strona internetowa z mocnym SEO. Rozwiązania wspierające cele biznesowe dealerów samochodowych.",
  alternates: { canonical: "/" },
};

const PROBLEMS = [
  {
    title: "Brak własnej i profesjonalnej przestrzeni",
    text: "Portale ogłoszeniowe to doskonałe źródło ruchu, ale to na własnej stronie budujesz markę, zaufanie i wizerunek eksperta. Bez ofert konkurencji obok Twoich aut.",
  },
  {
    title: "Słaba widoczność w wyszukiwarce Google (SEO)",
    text: "Większość małych stron komisów nie istnieje w Google. Tracisz przez to klientów z Twojej okolicy, którzy wpisują w wyszukiwarkę np. „skup aut Warszawa”.",
  },
  {
    title: "Brak zintegrowanego systemu dla skupu",
    text: "Prowadzisz skup aut? Brakuje Ci narzędzi, które automatycznie wycenią, zorganizują proces odkupu od klientów prywatnych i pozwolą łatwo zarządzać leadami.",
  },
];

const STEPS = [
  {
    title: "Profesjonalna strona WWW",
    text: "Otrzymujesz szybką, nowoczesną stronę internetową zoptymalizowaną pod SEO, która od pierwszych sekund buduje zaufanie do Twojej firmy.",
  },
  {
    title: "Zarządzanie ofertą i sprzedażą",
    text: "Dodawaj auta, publikuj je jednym kliknięciem i korzystaj z nowoczesnych kart pojazdów gotowych do udostępniania w social mediach.",
  },
  {
    title: "Moduł do skupu pojazdów",
    text: "Uruchom dedykowany system dla skupu z formularzami, automatyczną wyceną i panelem do zarządzania pozyskiwanymi pojazdami.",
  },
  {
    title: "Analityka i wsparcie decyzji",
    text: "Sprawdzaj dokładnie, skąd przychodzą Klienci – czy z wizytówki Google, czy ze strony – i optymalizuj swoje procesy na bazie twardych danych.",
  },
];

const FEATURES = [
  ["Strona komisu z aktualną ofertą", "Szybka strona WWW, świetne SEO i własna domena. Dopasowana w pełni do urządzeń mobilnych."],
  ["Moduł Skupu (Leady i CRM)", "Zaawansowane formularze dla klientów prywatnych chcących sprzedać auto, połączone z panelem do zarządzania wycenami."],
  ["Karty aut do udostępniania", "Wygenerowane automatycznie estetyczne linki do samochodów, idealne na Facebooka, grupy oraz WhatsAppa."],
  ["Śledzenie źródeł zapytań", "Analityka, która mówi dokładnie, z jakiego źródła i z której strony klient przeszedł do kontaktu."],
  ["Auta na zamówienie", "Formularz dla klientów szukających konkretnego pojazdu, pozwalający na proaktywną sprzedaż."],
  ["Elastyczność ekosystemu", "Narzędzia dopasowują się do Ciebie. Używaj tylko tych modułów, które aktualnie wspierają Twój biznes."],
];

const FAQ = [
  {
    q: "Czy ten system zastępuje popularne portale z ogłoszeniami?",
    a: "Nie. VroomDealer działa równolegle i pomaga budować Twoją własną, niezależną markę. Portale to wciąż niezastąpione, główne źródło klientów.",
  },
  {
    q: "Czy moduł Skupu aut jest obowiązkowy?",
    a: "Nie. System jest modułowy. Jeśli skupujesz auta, włączamy Ci system generowania leadów. Jeśli tylko sprzedajesz – korzystasz wyłącznie z platformy sprzedażowej.",
  },
  {
    q: "Co jeśli posiadam już własną domenę internetową?",
    a: "Możemy podpiąć platformę VroomDealer pod Twoją obecną domenę w przeciągu 24 godzin.",
  },
  {
    q: "Czy pobieracie dane z innych platform bez mojej zgody?",
    a: "Absolutnie nie. Wszelkie integracje wymagają pełnej autoryzacji z Twojej strony, a zarządzanie ofertą odbywa się z poziomu naszego panelu administracyjnego.",
  },
  {
    q: "Jakie są koszty wdrożenia?",
    a: "Skontaktuj się z nami w celu omówienia szczegółów – nasza oferta i model współpracy dostosowane są bezpośrednio do profilu Twojej działalności (importer, komis, skup).",
  },
  {
    q: "Czy muszę podpisywać długoterminową umowę?",
    a: "Nie. Rozumiemy zmienność rynku motoryzacyjnego. Zależy nam na tym, by system sam bronił się wartością, jaką generuje dla Twojego biznesu.",
  },
];

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[13px] font-bold uppercase tracking-wider text-brand">{eyebrow}</p>
      <h2 className="mt-2 font-heading text-[30px] font-semibold leading-[1.15] tracking-tight text-zinc-950 sm:text-[36px]">{title}</h2>
      {children && <p className="mt-4 text-[17px] leading-relaxed text-zinc-600">{children}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="bg-surface-secondary text-zinc-950">
        {/* Hero */}
        <section className="border-b border-zinc-200 bg-surface-primary">
          <div className="mx-auto flex max-w-4xl flex-col items-center px-5 pb-20 pt-16 text-center sm:px-8 lg:pb-32 lg:pt-28">
            <h1 className="font-heading text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-zinc-950 sm:text-[56px] lg:text-[64px]">
              Uniwersalny ekosystem dla Twojego komisu.
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-zinc-600 sm:text-[20px]">
              Elastyczna platforma sprzedażowa, zaawansowany system do zarządzania skupem aut oraz niesamowicie szybka strona internetowa zoptymalizowana pod Google.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#kontakt"
                id="hero-cta-contact"
                className="rounded-md bg-brand px-5 py-3 text-center text-[15px] font-medium text-zinc-50 transition-colors hover:bg-brand-hover"
              >
                Umów się na prezentację
              </Link>
              <Link
                href="#jak-to-dziala"
                id="hero-cta-how"
                className="rounded-md border border-zinc-300 bg-white px-5 py-3 text-center text-[15px] font-medium text-zinc-950 transition-colors hover:border-zinc-950"
              >
                Zobacz, jak to działa
              </Link>
            </div>
            <p className="mt-6 text-[14px] text-zinc-500">Skupiasz się na tym, co potrafisz najlepiej – my dajemy Ci narzędzia.</p>
          </div>
        </section>

        {/* Problem */}
        <section className="border-b border-zinc-200">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <SectionHeading eyebrow="Wyzwania rynkowe" title="Sprzedajesz i skupujesz auta, ale brakuje Ci zintegrowanych narzędzi." />
            <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 md:grid-cols-3">
              {PROBLEMS.map((p, i) => (
                <li key={p.title} className="bg-white p-7">
                  <span className="text-[13px] tabular-nums text-zinc-400">0{i + 1}</span>
                  <h3 className="mt-3 text-[18px] font-semibold leading-snug text-zinc-950">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* How it works */}
        <section id="jak-to-dziala" className="scroll-mt-16 border-b border-zinc-200 bg-surface-primary">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <SectionHeading eyebrow="Jak to działa" title="Cztery kroki. Żadnego przepisywania ogłoszeń." />
            <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative border-t border-zinc-950 pt-5">
                  <span className="text-[13px] font-medium tabular-nums text-zinc-950">Krok {i + 1}</span>
                  <h3 className="mt-2 text-[17px] font-semibold text-zinc-950">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-zinc-200">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
            <SectionHeading eyebrow="Co dostajesz" title="Narzędzie do sprzedaży, nie wizytówka.">
              Każdy element ma jedno zadanie: przyprowadzić klienta bez płacenia portalowi i pokazać Ci, że to działa.
            </SectionHeading>
            <dl className="divide-y divide-zinc-200 border-y border-zinc-200">
              {FEATURES.map(([title, text]) => (
                <div key={title} className="grid gap-1 py-5 sm:grid-cols-[220px_1fr] sm:gap-8">
                  <dt className="text-[15px] font-semibold text-zinc-950">{title}</dt>
                  <dd className="text-[15px] leading-relaxed text-zinc-600">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Pilot */}
        <section id="pilotaz" className="scroll-mt-16 border-b border-zinc-200 bg-surface-primary">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
            <SectionHeading eyebrow="Współpraca" title="Szukamy pierwszych partnerów do wdrożenia.">
              Zanim udostępnimy platformę szeroko, szukamy partnerów (komisów, importerów, skupów), którzy chcą zbudować z nami przewagę technologiczną dla swojej firmy.
            </SectionHeading>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-7">
                <h3 className="text-[17px] font-semibold text-zinc-950">Ty dostajesz</h3>
                <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-zinc-600">
                  <li className="flex gap-3"><Check />Nowoczesną stronę internetową i dedykowany moduł CRM do leadów ze skupu</li>
                  <li className="flex gap-3"><Check />Przeniesienie oferty i wdrożenie ekosystemu po naszej stronie</li>
                  <li className="flex gap-3"><Check />Pełne wdrożenie analityki, abyś wiedział co dokładnie sprzedaje Twoje auta</li>
                  <li className="flex gap-3"><Check />Gwarancję najniższej, niezmiennej ceny abonamentu w przyszłości</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-7">
                <h3 className="text-[17px] font-semibold text-zinc-950">My prosimy o</h3>
                <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-zinc-600">
                  <li className="flex gap-3"><Dash />Otwartość na zmiany i gotowość do ulepszania swoich procesów</li>
                  <li className="flex gap-3"><Dash />Szczerą informację zwrotną raz w miesiącu</li>
                  <li className="flex gap-3"><Dash />Zgodę na umieszczenie logo Twojej firmy jako case-study po udanym wdrożeniu</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16 border-b border-zinc-200">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
            <SectionHeading eyebrow="FAQ" title="Najczęstsze pytania" />
            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium text-zinc-950 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="text-[20px] font-light text-zinc-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="scroll-mt-16 bg-surface-primary">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
            <div>
              <SectionHeading eyebrow="Kontakt" title="Porozmawiajmy 15 minut o Twoim biznesie.">
                Zadzwonimy, zapytamy o Twoje cele (sprzedaż, skup) i szczerze powiemy, w jaki sposób nasz ekosystem może wspomóc rozwój Twojej firmy.
              </SectionHeading>
              <p className="mt-8 text-[15px] text-zinc-600">
                Wolisz napisać?{" "}
                <a href="mailto:biuro@vroomdealer.pl" className="font-medium text-zinc-950 underline underline-offset-4">
                  biuro@vroomdealer.pl
                </a>
              </p>
            </div>
            <PilotForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="mt-1 h-4 w-4 flex-none text-brand" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dash() {
  return <span aria-hidden className="mt-[11px] h-px w-3 flex-none bg-brand" />;
}
