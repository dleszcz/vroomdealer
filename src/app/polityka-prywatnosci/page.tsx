import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych w serwisie VroomDealer.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

const h2 = "mt-10 text-[19px] font-semibold text-zinc-950";
const p = "mt-3 text-[15px] leading-relaxed text-zinc-600";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#fbfaf7]">
        <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8 lg:py-24">
          <h1 className="text-[34px] font-semibold tracking-tight text-zinc-950">Polityka prywatności</h1>
          <p className="mt-2 text-[14px] text-zinc-500">Ostatnia aktualizacja: październik 2026</p>

          <h2 className={h2}>1. Administrator danych</h2>
          <p className={p}>
            Administratorem danych osobowych przekazanych przez formularze w serwisie vroomdealer.pl jest VroomDealer. W sprawach dotyczących danych osobowych napisz na{" "}
            <a href="mailto:biuro@vroomdealer.pl" className="text-zinc-950 underline underline-offset-2">biuro@vroomdealer.pl</a>.
          </p>

          <h2 className={h2}>2. Jakie dane zbieramy i po co</h2>
          <p className={p}>
            Przez formularz zgłoszeniowy zbieramy: nazwę komisu, imię, numer telefonu, adres e-mail, miasto oraz orientacyjne informacje o wielkości oferty i kosztach ogłoszeń. Używamy ich wyłącznie, aby skontaktować się w sprawie pilotażu i przygotować ofertę współpracy (art. 6 ust. 1 lit. b i f RODO).
          </p>

          <h2 className={h2}>3. Komu przekazujemy dane</h2>
          <p className={p}>
            Nie sprzedajemy ani nie udostępniamy danych innym firmom w celach marketingowych. Dane przetwarzają w naszym imieniu wyłącznie dostawcy usług technicznych: hosting, baza danych i wysyłka e-maili, na podstawie umów powierzenia.
          </p>

          <h2 className={h2}>4. Jak długo przechowujemy dane</h2>
          <p className={p}>
            Do zakończenia rozmów o współpracy, a jeśli do niej nie dojdzie, nie dłużej niż 12 miesięcy od ostatniego kontaktu.
          </p>

          <h2 className={h2}>5. Twoje prawa</h2>
          <p className={p}>
            Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia oraz wniesienia sprzeciwu. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
