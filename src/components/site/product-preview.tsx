/**
 * Static illustration of the product: a car page shared on WhatsApp and
 * the monthly report. Pure HTML/CSS so it stays sharp and needs no stock photos.
 */
export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]" aria-label="Przykład: karta auta udostępniona na WhatsAppie i raport miesięczny">
      {/* Chat card */}
      <div className="rounded-2xl border border-zinc-200 bg-[#efeae2] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.18)]">
        <div className="mb-3 flex items-center gap-2 text-[12px] text-zinc-500">
          <span className="h-6 w-6 rounded-full bg-zinc-300" />
          <span className="font-medium text-zinc-700">Grupa: Auta Kraków i okolice</span>
        </div>

        <div className="ml-auto w-[88%] overflow-hidden rounded-lg bg-[#d9fdd3] text-zinc-900 shadow-sm">
          <div className="m-1 overflow-hidden rounded-md bg-white/70">
            <div className="relative aspect-[1.91/1] bg-gradient-to-br from-zinc-300 via-zinc-200 to-zinc-300">
              {/* Simplified car silhouette */}
              <svg viewBox="0 0 200 80" className="absolute inset-x-6 bottom-3 text-zinc-500/70" fill="currentColor" aria-hidden>
                <path d="M18 58c0-6 4-10 10-11l26-4 22-16c4-3 9-4 14-4h38c5 0 9 2 13 5l17 15 22 4c6 1 10 6 10 12v5c0 2-2 4-4 4h-12a16 16 0 0 0-31 0H78a16 16 0 0 0-31 0H22c-2 0-4-2-4-4z" />
                <circle cx="62" cy="64" r="11" />
                <circle cx="158" cy="64" r="11" />
              </svg>
              <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700">12 zdjęć</span>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">twojkomis.pl</p>
              <p className="text-[14px] font-semibold leading-snug">Audi A4 Avant 2.0 TDI, 2019</p>
              <p className="text-[12px] text-zinc-600">148 000 km · automat · sprowadzony z Niemiec</p>
              <p className="mt-1 text-[14px] font-semibold">79 900 zł <span className="font-normal text-zinc-500">z opłatami</span></p>
            </div>
          </div>
          <p className="px-3 pb-2 pt-1 text-[13px]">Świeżo po rejestracji, do obejrzenia od ręki 👇</p>
          <p className="px-3 pb-1.5 text-right text-[10px] text-zinc-500">10:42</p>
        </div>
      </div>

      {/* Lead card */}
      <div className="relative -mt-6 ml-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.25)] sm:-ml-10 sm:mr-10">
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] font-medium text-emerald-600">Nowy lead: Skup aut</p>
          <p className="text-[11px] text-zinc-400">14 min temu</p>
        </div>
        <div className="mt-3">
          <p className="text-[14px] font-semibold text-zinc-950">Volkswagen Golf VII, 2017</p>
          <p className="mt-1 text-[13px] text-zinc-600">1.4 TSI, przebieg: 124 000 km</p>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="rounded bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600">Bezwypadkowy</span>
          <span className="rounded bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600">Krajowy</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
          <p className="text-[12px] font-medium text-zinc-950">Oczekiwana: 45 000 zł</p>
          <button className="rounded bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">Wyceń</button>
        </div>
      </div>
    </div>
  );
}
