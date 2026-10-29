"use client";

import React, { useState, useTransition } from "react";
import { Car } from "@/types/database";
import { carInputSchema, FuelType, TransmissionType } from "../../types";
import { BasicSpecsStep } from "./basic-specs-step";
import { PricingSpecsStep } from "./pricing-specs-step";
import { AutoplacSyncStep } from "./autoplac-sync-step";
import { PhotoUploaderStep } from "./photo-uploader-step";
import { X, Loader2, Save } from "lucide-react";
import { z } from "zod";

interface CarFormContainerProps {
  initialCar?: Car | null;
  tenantId: string;
  onSave: (carData: unknown) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export function CarFormContainer({
  initialCar,
  tenantId,
  onSave,
  onCancel,
}: CarFormContainerProps) {
  const [isPending, startTransition] = useTransition();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    make: initialCar?.make || "",
    model: initialCar?.model || "",
    year: initialCar?.year || new Date().getFullYear(),
    fuel_type: (initialCar?.fuel_type as FuelType) || "Benzyna",
    transmission: (initialCar?.transmission as TransmissionType) || "Manualna",
    engine_capacity: initialCar?.engine_capacity || "",
    color: initialCar?.color || "",
    price: initialCar?.price || "",
    mileage: initialCar?.mileage || "",
    description: initialCar?.description || "",
    images: initialCar?.images || [],
    export_to_autoplac: initialCar?.export_to_autoplac || false,
    vin: initialCar?.vin || "",
    first_registration_date: initialCar?.first_registration_date || "",
    is_sold: initialCar?.is_sold || false,
    is_featured: initialCar?.is_featured || false,
  });

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const payload = {
      ...formData,
      tenant_id: tenantId,
      slug: initialCar?.slug || `${formData.make}-${formData.model}-${formData.year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    const validation = carInputSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string") {
          fieldErrors[path] = issue.message;
        }
      }
      setFormErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const res = await onSave(validation.data);
      if (!res.success) {
        setServerError(res.error || "Wystąpił nieoczekiwany błąd zapisu");
      }
    });
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl max-w-3xl mx-auto">
      {/* Nagłówek */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            {initialCar ? "Edycja pojazdu" : "Nowy pojazd w ofercie"}
          </h2>
          <p className="text-xs text-slate-400">
            Wprowadź dane auta. Zostanie ono natychmiast opublikowane na stronie WWW komisu.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      {serverError && (
        <div className="rounded-lg bg-rose-950/60 border border-rose-800 p-3 mb-5 text-xs text-rose-300">
          {serverError}
        </div>
      )}

      {/* Formularz */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicSpecsStep
          make={formData.make}
          model={formData.model}
          year={formData.year}
          fuelType={formData.fuel_type}
          transmission={formData.transmission}
          engineCapacity={formData.engine_capacity}
          color={formData.color}
          onChange={handleFieldChange}
          errors={formErrors}
        />

        <PricingSpecsStep
          price={formData.price}
          mileage={formData.mileage}
          description={formData.description}
          onChange={handleFieldChange}
          errors={formErrors}
        />

        <AutoplacSyncStep
          exportToAutoplac={formData.export_to_autoplac}
          vin={formData.vin}
          firstRegistrationDate={formData.first_registration_date}
          onChange={handleFieldChange}
          errors={formErrors}
        />

        <PhotoUploaderStep
          photos={formData.images}
          onChange={(newPhotos) => handleFieldChange("images", newPhotos)}
          errors={formErrors}
        />

        {/* Przyciski akcji */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" strokeWidth={1.75} />
                Zapisz pojazd
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
