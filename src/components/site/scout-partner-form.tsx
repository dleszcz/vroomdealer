"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { submitScoutPartnerApplication, type PilotFormState } from "@/app/actions";

const initial: PilotFormState = { status: "idle" };

const inputStyle =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 aria-[invalid=true]:border-red-500";
const labelStyle = "mb-1.5 block text-[13px] font-semibold text-slate-800";

export function ScoutPartnerForm() {
  const [state, action, pending] = useActionState(submitScoutPartnerApplication, initial);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-8 text-center shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h3 className="font-heading font-black text-2xl text-slate-950">
            Dziękujemy! Zgłoszenie przyjęte
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Twoje zgłoszenie do partnerskiej sieci odkupu <strong>VroomScout</strong> zostało pomyślnie zarejestrowane.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-emerald-100/80 text-left space-y-2.5 shadow-sm max-w-md mx-auto">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">
              ✓
            </span>
            <span>Skontaktujemy się telefonicznie w ciągu <strong>24 godzin</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">
              ✓
            </span>
            <span>Ustalimy rejon działania i preferowany profil aut</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px] shrink-0">
              ✓
            </span>
            <span>Darmowy dostęp w etapie pilotażowym bez prowizji wstępnych</span>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-500">
          Pilne pytanie? Zadzwoń do opiekuna programu:{" "}
          <a href="tel:+48577022555" className="font-bold text-blue-600 hover:underline">
            +48 577 022 555
          </a>
        </div>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-950 border border-slate-100">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-100/60">
          <ShieldCheck className="w-3.5 h-3.5" />
          Program pilotażowy VroomScout
        </div>
        <h3 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
          Zgłoszenie partnera skupu
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
          Wypełnij krótki formularz. Skontaktujemy się telefonicznie w ciągu 24h, aby ustalić Twój rejon i preferowany profil aut.
        </p>
      </div>

      <form action={action} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="scout-dealerName" className={labelStyle}>
              Nazwa komisu / firmy <span className="text-red-500">*</span>
            </label>
            <input
              id="scout-dealerName"
              name="dealerName"
              required
              placeholder="np. Auto-Handel MotoExpress"
              autoComplete="organization"
              aria-invalid={!!err.dealerName}
              className={inputStyle}
            />
            {err.dealerName && <p className="mt-1 text-xs text-red-600 font-medium">{err.dealerName}</p>}
          </div>

          <div>
            <label htmlFor="scout-contactName" className={labelStyle}>
              Imię i nazwisko <span className="font-normal text-slate-400">(opcjonalnie)</span>
            </label>
            <input
              id="scout-contactName"
              name="contactName"
              placeholder="Jan Kowalski"
              autoComplete="name"
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="scout-city" className={labelStyle}>
              Miasto / Rejon działania <span className="text-red-500">*</span>
            </label>
            <input
              id="scout-city"
              name="city"
              required
              placeholder="np. Poznań i wielkopolskie"
              autoComplete="address-level2"
              aria-invalid={!!err.city}
              className={inputStyle}
            />
            {err.city && <p className="mt-1 text-xs text-red-600 font-medium">{err.city}</p>}
          </div>

          <div>
            <label htmlFor="scout-phone" className={labelStyle}>
              Telefon kontaktowy <span className="text-red-500">*</span>
            </label>
            <input
              id="scout-phone"
              name="phone"
              type="tel"
              required
              placeholder="np. 500 123 456"
              autoComplete="tel"
              aria-invalid={!!err.phone}
              className={inputStyle}
            />
            {err.phone && <p className="mt-1 text-xs text-red-600 font-medium">{err.phone}</p>}
          </div>

          <div>
            <label htmlFor="scout-email" className={labelStyle}>
              E-mail <span className="font-normal text-slate-400">(opcjonalnie)</span>
            </label>
            <input
              id="scout-email"
              name="email"
              type="email"
              placeholder="kontakt@twojkomis.pl"
              autoComplete="email"
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="scout-stock" className={labelStyle}>
              Profil odkupywanych aut
            </label>
            <select id="scout-stock" name="stock" defaultValue="" className={inputStyle}>
              <option value="">Wszystkie pojazdy (dowolny profil)</option>
              <option value="Sprawne auta do 30 000 zł">Sprawne auta do 30 000 zł</option>
              <option value="Sprawne auta powyżej 30 000 zł">Sprawne auta powyżej 30 000 zł</option>
              <option value="Auta uszkodzone / powypadkowe">Auta uszkodzone / powypadkowe</option>
              <option value="Auta dostawcze / użytkowe">Auta dostawcze / użytkowe</option>
              <option value="Auta premium i młode roczniki">Auta premium i młode roczniki</option>
            </select>
          </div>

          <div>
            <label htmlFor="scout-adSpend" className={labelStyle}>
              Szacowany miesięczny odkup
            </label>
            <select id="scout-adSpend" name="adSpend" defaultValue="" className={inputStyle}>
              <option value="">Wybierz szacowany wolumen</option>
              <option value="1–5 aut miesięcznie">1–5 aut miesięcznie</option>
              <option value="5–15 aut miesięcznie">5–15 aut miesięcznie</option>
              <option value="15–30 aut miesięcznie">15–30 aut miesięcznie</option>
              <option value="Powyżej 30 aut miesięcznie">Powyżej 30 aut miesięcznie</option>
            </select>
          </div>

          {/* Honeypot */}
          <div aria-hidden className="hidden">
            <label htmlFor="scout-website">Strona</label>
            <input id="scout-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
        </div>

        {state.status === "error" && state.message && (
          <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {state.message}
          </p>
        )}

        <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Wysyłając zgłoszenie, wyrażasz zgodę na kontakt w sprawie pilotażu sieci odkupu. Szczegóły w{" "}
            <Link href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-slate-900">
              polityce prywatności
            </Link>.
          </p>
          <button
            type="submit"
            id="scout-partner-submit"
            disabled={pending}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-600/40 disabled:opacity-60 cursor-pointer"
          >
            {pending ? (
              "Wysyłanie zgłoszenia…"
            ) : (
              <>
                <span>Zgłoś akces do sieci</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
