import Link from "next/link";
import { Logo } from "./logo";

const NAV = [
  { href: "/#jak-to-dziala", label: "Jak to działa" },
  { href: "/#pilotaz", label: "Współpraca" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[#fbfaf7]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="VroomDealer, strona główna">
          <Logo />
        </Link>
        <nav aria-label="Główna nawigacja" className="hidden items-center gap-8 text-[14px] text-zinc-600 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-zinc-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#kontakt"
          id="header-cta"
          className="rounded-md bg-zinc-950 px-4 py-2 text-[14px] font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
        >
          Umów rozmowę
        </Link>
      </div>
    </header>
  );
}
