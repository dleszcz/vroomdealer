"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitPilotApplication, type PilotFormState } from "@/app/actions";

const initial: PilotFormState = { status: "idle" };

const input =
  "w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-[15px] text-zinc-950 placeholder:text-zinc-400 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 aria-[invalid=true]:border-red-500";
const label = "mb-1.5 block text-[14px] font-medium text-zinc-900";

export function PilotForm() {
  const [state, action, pending] = useActionState(submitPilotApplication, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-xl border border-zinc-200 bg-white p-8">
        <p className="text-[18px] font-semibold text-zinc-950">Dziękujemy, mamy Twoje zgłoszenie.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">
          Zadzwonimy w ciągu jednego dnia roboczego. Porozmawiamy o Twoich potrzebach i ewentualnym wdrożeniu naszego ekosystemu.
        </p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="dealerName" className={label}>Nazwa komisu</label>
          <input id="dealerName" name="dealerName" required autoComplete="organization" aria-invalid={!!err.dealerName} className={input} />
          {err.dealerName && <p className="mt-1 text-[13px] text-red-600">{err.dealerName}</p>}
        </div>
        <div>
          <label htmlFor="contactName" className={label}>Imię <span className="font-normal text-zinc-400">(opcjonalnie)</span></label>
          <input id="contactName" name="contactName" autoComplete="given-name" className={input} />
        </div>
        <div>
          <label htmlFor="city" className={label}>Miasto</label>
          <input id="city" name="city" required autoComplete="address-level2" aria-invalid={!!err.city} className={input} />
          {err.city && <p className="mt-1 text-[13px] text-red-600">{err.city}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={label}>Telefon</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" aria-invalid={!!err.phone} className={input} />
          {err.phone && <p className="mt-1 text-[13px] text-red-600">{err.phone}</p>}
        </div>
        <div>
          <label htmlFor="email" className={label}>E-mail <span className="font-normal text-zinc-400">(opcjonalnie)</span></label>
          <input id="email" name="email" type="email" autoComplete="email" className={input} />
        </div>
        <div>
          <label htmlFor="adSpend" className={label}>Ilość aut w ofercie / skupowanych rocznie</label>
          <select id="adSpend" name="adSpend" defaultValue="" className={input}>
            <option value="">Wybierz</option>
            <option>do 50 aut</option>
            <option>50–150 aut</option>
            <option>150–300 aut</option>
            <option>powyżej 300 aut</option>
          </select>
        </div>
        <div>
          <label htmlFor="stock" className={label}>Główne źródło aut</label>
          <select id="stock" name="stock" defaultValue="" className={input}>
            <option value="">Wybierz</option>
            <option>Import z zagranicy</option>
            <option>Skup aut krajowych</option>
            <option>Krajowy + import</option>
            <option>Tylko pośrednictwo</option>
          </select>
        </div>
        {/* Honeypot */}
        <div aria-hidden className="hidden">
          <label htmlFor="website">Strona</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-5 text-[14px] text-red-600">{state.message}</p>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-zinc-500 sm:max-w-xs">
          Wysyłając formularz, zgadzasz się na kontakt w sprawie wdrożenia. Szczegóły w{" "}
          <Link href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-zinc-900">polityce prywatności</Link>.
        </p>
        <button
          type="submit"
          id="pilot-form-submit"
          disabled={pending}
          className="rounded-md bg-zinc-950 px-5 py-3 text-[15px] font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Wysyłanie…" : "Wyślij zgłoszenie"}
        </button>
      </div>
    </form>
  );
}
