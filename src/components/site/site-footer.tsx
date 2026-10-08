import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-surface-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-[14px] text-zinc-500 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="flex flex-col gap-2">
          <Logo />
          <p>Uniwersalny ekosystem, oprogramowanie i strony WWW dla dealerów aut.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/polityka-prywatnosci" className="hover:text-zinc-950">
            Polityka prywatności
          </Link>
          <p>&copy; {new Date().getFullYear()} VroomDealer</p>
        </div>
      </div>
    </footer>
  );
}
