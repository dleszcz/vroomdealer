import React from "react";
import { Info, CheckCircle2, AlertCircle } from "lucide-react";

interface AutoplacSyncStepProps {
  exportToAutoplac: boolean;
  vin?: string;
  firstRegistrationDate?: string;
  onChange: (field: string, value: boolean | string) => void;
  errors?: Record<string, string>;
}

export function AutoplacSyncStep({
  exportToAutoplac,
  vin = "",
  firstRegistrationDate = "",
  onChange,
  errors = {},
}: AutoplacSyncStepProps) {
  const isVinValid = /^[A-HJ-NPR-Z0-9]{17}$/.test(vin.trim().toUpperCase());

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      {/* Przełącznik eksportu */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <label htmlFor="export-autoplac-toggle" className="text-sm font-semibold text-slate-200 cursor-pointer">
            Eksportuj do portalu Autoplac.pl
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto zostanie automatycznie dodane do oficjalnego feedu XML pobieranego przez Autoplac.pl i aplikację Yanosik.
          </p>
        </div>

        <input
          id="export-autoplac-toggle"
          type="checkbox"
          checked={exportToAutoplac}
          onChange={(e) => onChange("export_to_autoplac", e.target.checked)}
          className="h-5 w-5 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer mt-0.5"
        />
      </div>

      {exportToAutoplac && (
        <div className="pt-3 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-sky-950/40 border border-sky-800/40 px-3 py-2 text-xs text-sky-300">
            <Info className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
            <span>Autoplac.pl weryfikuje pojazdy w bazie CEPiK. Wprowadź poprawny 17-znakowy numer VIN.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* VIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="car-vin" className="block text-xs font-medium text-slate-300">
                  Numer VIN *
                </label>
                {vin.length > 0 && (
                  <span className={`text-[11px] font-mono flex items-center gap-1 ${isVinValid ? "text-emerald-400" : "text-amber-400"}`}>
                    {isVinValid ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    {vin.length}/17
                  </span>
                )}
              </div>
              <input
                id="car-vin"
                type="text"
                maxLength={17}
                value={vin}
                onChange={(e) => onChange("vin", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                placeholder="np. WAUZZZ8K8BA123456"
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 tracking-wider"
              />
              {errors.vin && <p className="mt-1 text-xs text-rose-400">{errors.vin}</p>}
            </div>

            {/* Data pierwszej rejestracji */}
            <div>
              <label htmlFor="car-reg-date" className="block text-xs font-medium text-slate-300 mb-1">
                Data 1. rejestracji (opcjonalnie)
              </label>
              <input
                id="car-reg-date"
                type="date"
                value={firstRegistrationDate}
                onChange={(e) => onChange("first_registration_date", e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
