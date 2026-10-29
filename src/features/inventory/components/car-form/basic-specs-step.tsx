import React from "react";
import { fuelTypes, transmissionTypes, FuelType, TransmissionType } from "../../types";

interface BasicSpecsStepProps {
  make: string;
  model: string;
  year: number | string;
  fuelType: FuelType;
  transmission: TransmissionType;
  engineCapacity?: string;
  color?: string;
  onChange: (field: string, value: string | number) => void;
  errors?: Record<string, string>;
}

export function BasicSpecsStep({
  make,
  model,
  year,
  fuelType,
  transmission,
  engineCapacity = "",
  color = "",
  onChange,
  errors = {},
}: BasicSpecsStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Marka */}
        <div>
          <label htmlFor="car-make" className="block text-xs font-medium text-slate-300 mb-1">
            Marka *
          </label>
          <input
            id="car-make"
            type="text"
            value={make}
            onChange={(e) => onChange("make", e.target.value)}
            placeholder="np. Audi, BMW, Volkswagen"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {errors.make && <p className="mt-1 text-xs text-rose-400">{errors.make}</p>}
        </div>

        {/* Model */}
        <div>
          <label htmlFor="car-model" className="block text-xs font-medium text-slate-300 mb-1">
            Model *
          </label>
          <input
            id="car-model"
            type="text"
            value={model}
            onChange={(e) => onChange("model", e.target.value)}
            placeholder="np. A4, Seria 3, Golf"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {errors.model && <p className="mt-1 text-xs text-rose-400">{errors.model}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rocznik */}
        <div>
          <label htmlFor="car-year" className="block text-xs font-medium text-slate-300 mb-1">
            Rok produkcji *
          </label>
          <input
            id="car-year"
            type="number"
            min={1950}
            max={new Date().getFullYear() + 1}
            value={year}
            onChange={(e) => onChange("year", e.target.value ? parseInt(e.target.value, 10) : "")}
            placeholder="2018"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {errors.year && <p className="mt-1 text-xs text-rose-400">{errors.year}</p>}
        </div>

        {/* Paliwo */}
        <div>
          <label htmlFor="car-fuel" className="block text-xs font-medium text-slate-300 mb-1">
            Paliwo *
          </label>
          <select
            id="car-fuel"
            value={fuelType}
            onChange={(e) => onChange("fuel_type", e.target.value as FuelType)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Skrzynia biegów */}
        <div>
          <label htmlFor="car-transmission" className="block text-xs font-medium text-slate-300 mb-1">
            Skrzynia biegów *
          </label>
          <select
            id="car-transmission"
            value={transmission}
            onChange={(e) => onChange("transmission", e.target.value as TransmissionType)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            {transmissionTypes.map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pojemność silnika */}
        <div>
          <label htmlFor="car-engine" className="block text-xs font-medium text-slate-300 mb-1">
            Pojemność silnika (cm³)
          </label>
          <input
            id="car-engine"
            type="text"
            value={engineCapacity}
            onChange={(e) => onChange("engine_capacity", e.target.value)}
            placeholder="np. 1968"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Kolor */}
        <div>
          <label htmlFor="car-color" className="block text-xs font-medium text-slate-300 mb-1">
            Kolor lakieru
          </label>
          <input
            id="car-color"
            type="text"
            value={color}
            onChange={(e) => onChange("color", e.target.value)}
            placeholder="np. Czarny metalik"
            className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
