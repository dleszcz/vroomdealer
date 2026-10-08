"use client";

import { useId, useState } from "react";

const pln = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });

function toNumber(value: string) {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function SavingsCalculator() {
  const [subscription, setSubscription] = useState("900");
  const [promotions, setPromotions] = useState("1500");
  const [share, setShare] = useState(30);
  const ids = { sub: useId(), promo: useId(), share: useId() };

  const sub = toNumber(subscription);
  const promo = toNumber(promotions);
  const monthly = Math.round((promo * share) / 100);
  const total = sub + promo;
  const billAfter = total - monthly;
  const reduction = total > 0 ? Math.round((monthly / total) * 100) : 0;

  const field =
    "w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 pr-14 text-[15px] tabular-nums text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10";

  return (
    <div className="grid overflow-hidden rounded-xl border border-zinc-200 bg-white lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6 p-6 sm:p-8">
        <div>
          <label htmlFor={ids.sub} className="mb-1.5 block text-[14px] font-medium text-zinc-900">
            Abonament OTOMOTO + OLX
          </label>
          <div className="relative">
            <input
              id={ids.sub}
              inputMode="numeric"
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
              className={field}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[13px] text-zinc-400">zł / mies.</span>
          </div>
          <p className="mt-1.5 text-[13px] text-zinc-500">Tej kwoty nie ruszamy. Portale zostają.</p>
        </div>

        <div>
          <label htmlFor={ids.promo} className="mb-1.5 block text-[14px] font-medium text-zinc-900">
            Promowania i podbicia ogłoszeń
          </label>
          <div className="relative">
            <input
              id={ids.promo}
              inputMode="numeric"
              value={promotions}
              onChange={(e) => setPromotions(e.target.value)}
              className={field}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[13px] text-zinc-400">zł / mies.</span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor={ids.share} className="text-[14px] font-medium text-zinc-900">
              Ile promowań zastąpisz własnymi kanałami
            </label>
            <span className="text-[14px] font-medium tabular-nums text-zinc-950">{share}%</span>
          </div>
          <input
            id={ids.share}
            type="range"
            min={10}
            max={60}
            step={5}
            value={share}
            onChange={(e) => setShare(Number(e.target.value))}
            className="w-full accent-emerald-700"
          />
          <div className="mt-1 flex justify-between text-[12px] text-zinc-400">
            <span>ostrożnie</span>
            <span>ambitnie</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between border-t border-zinc-200 bg-zinc-950 p-6 text-zinc-50 sm:p-8 lg:border-l lg:border-t-0">
        <div>
          <p className="text-[13px] text-zinc-400">Szacowana oszczędność</p>
          <p className="mt-1 text-[44px] font-semibold leading-none tracking-tight tabular-nums">
            {pln.format(monthly)}
            <span className="ml-1.5 text-[16px] font-normal text-zinc-400">/ mies.</span>
          </p>
          <p className="mt-2 text-[15px] text-zinc-300 tabular-nums">{pln.format(monthly * 12)} rocznie</p>
        </div>

        <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-zinc-400">Rachunek za portale dziś</dt>
            <dd className="tabular-nums">{pln.format(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">Rachunek po zmianie</dt>
            <dd className="tabular-nums">{pln.format(billAfter)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-400">Spadek kosztów ogłoszeń</dt>
            <dd className="tabular-nums text-emerald-400">−{reduction}%</dd>
          </div>
        </dl>

        <p className="mt-6 text-[12px] leading-relaxed text-zinc-500">
          To szacunek, nie obietnica. W pilotażu mierzymy prawdziwy wynik na Twoich danych: wydatki przed i po, przy tej samej liczbie zapytań.
        </p>
      </div>
    </div>
  );
}
