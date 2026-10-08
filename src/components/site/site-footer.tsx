import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-[#fbfaf7]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-[14px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-2">
          <Logo />
          <p>Uniwersalny ekosystem, oprogramowanie i strony WWW dla dealerów aut.</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex gap-6">
            <a href="mailto:biuro@vroomdealer.pl" className="hover:text-zinc-950">
              biuro@vroomdealer.pl
            </a>
            <Link href="/polityka-prywatnosci" className="hover:text-zinc-950">
              Polityka prywatności
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} VroomDealer</p>
        </div>
      </div>
    </footer>
  );
}
