import React from "react";
import { Car, Plus } from "lucide-react";

interface CarsEmptyStateProps {
  onAddCar: () => void;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function CarsEmptyState({
  onAddCar,
  hasFilters,
  onClearFilters,
}: CarsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60 mb-4">
        <Car className="h-7 w-7" strokeWidth={1.75} />
      </div>

      <h3 className="text-base font-semibold text-slate-200 tracking-tight mb-1">
        {hasFilters ? "Brak aut spełniających kryteria" : "Brak pojazdów w ofercie"}
      </h3>

      <p className="max-w-sm text-sm text-slate-400 mb-6">
        {hasFilters
          ? "Spróbuj zmienić lub zresetować filtry wyszukiwania, aby zobaczyć wszystkie auta."
          : "Dodaj pierwszy samochód do oferty, aby pojawił się na Twojej stronie WWW i w eksporcie Autoplac.pl."}
      </p>

      <div className="flex items-center gap-3">
        {hasFilters && onClearFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Wyczyść filtry
          </button>
        ) : null}

        <button
          type="button"
          onClick={onAddCar}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Dodaj samochód
        </button>
      </div>
    </div>
  );
}
