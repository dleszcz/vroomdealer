import React from "react";

interface PricingSpecsStepProps {
  price: number | string;
  mileage: number | string;
  description: string;
  onChange: (field: string, value: string | number) => void;
  errors?: Record<string, string>;
}

export function PricingSpecsStep({
  price,
  mileage,
  description,
  onChange,
  errors = {},
}: PricingSpecsStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cena */}
        <div>
          <label htmlFor="car-price" className="block text-xs font-medium text-slate-300 mb-1">
            Cena brutto (PLN) *
          </label>
          <input
            id="car-price"
            type="number"
            min={0}
            step={100}
            value={price}
            onChange={(e) => onChange("price", e.target.value ? parseFloat(e.target.value) : "")}
            placeholder="np. 45000"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
          {errors.price && <p className="mt-1 text-xs text-rose-400">{errors.price}</p>}
        </div>

        {/* Przebieg */}
        <div>
          <label htmlFor="car-mileage" className="block text-xs font-medium text-slate-300 mb-1">
            Przebieg (km) *
          </label>
          <input
            id="car-mileage"
            type="number"
            min={0}
            value={mileage}
            onChange={(e) => onChange("mileage", e.target.value ? parseInt(e.target.value, 10) : "")}
            placeholder="np. 185000"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
          {errors.mileage && <p className="mt-1 text-xs text-rose-400">{errors.mileage}</p>}
        </div>
      </div>

      {/* Opis pojazdu */}
      <div>
        <label htmlFor="car-description" className="block text-xs font-medium text-slate-300 mb-1">
          Opis pojazdu i wyposażenie
        </label>
        <textarea
          id="car-description"
          rows={5}
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Wpisz szczegółowy opis pojazdu, historię serwisową, stan techniczny oraz najważniejsze elementy wyposażenia..."
          className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-y"
        />
        {errors.description && <p className="mt-1 text-xs text-rose-400">{errors.description}</p>}
      </div>
    </div>
  );
}
