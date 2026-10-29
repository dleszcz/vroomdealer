"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Car, Tenant } from "@/types/database";
import { CarsTable } from "./cars-table/cars-table";
import { CarFormContainer } from "./car-form/car-form-container";
import { AutoplacFeedBanner } from "./autoplac-feed-banner";
import { AsyncState } from "../types";
import { Plus, Search, Car as CarIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { saveCarAction, toggleSoldAction, toggleFeaturedAction, deleteCarAction, fetchCarsByTenantAction } from "../actions";

interface CarsInventoryViewProps {
  initialCars: Car[];
  tenant: Tenant;
  feedUrl: string;
}

export function CarsInventoryView({
  initialCars,
  tenant,
  feedUrl,
}: CarsInventoryViewProps) {
  const [, startTransition] = useTransition();
  const [carsList, setCarsList] = useState<Car[]>(initialCars);
  const [carsState, setCarsState] = useState<AsyncState<Car[]>>({
    status: "success",
    data: initialCars,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Dostępność: zamykanie modalu klawiszem Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFormOpen) {
        setIsFormOpen(false);
        setEditingCar(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen]);

  const reloadCars = async () => {
    setCarsState({ status: "loading" });
    const res = await fetchCarsByTenantAction(tenant.id);
    if (!res.success || !res.data) {
      setCarsState({ status: "error", error: res.error || "Błąd pobierania aut" });
    } else {
      setCarsList(res.data);
      setCarsState({ status: "success", data: res.data });
    }
  };

  const filteredCars = carsList.filter((car) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      car.make.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      (car.vin && car.vin.toLowerCase().includes(q))
    );
  });

  const displayedState: AsyncState<Car[]> =
    carsState.status === "success"
      ? { status: "success", data: filteredCars }
      : carsState;

  const handleSaveCar = async (carData: unknown) => {
    const res = await saveCarAction(carData, tenant.id, tenant.slug, editingCar?.id);
    if (!res.success) {
      return { success: false, error: res.error || "Błąd zapisu" };
    }

    setIsFormOpen(false);
    setEditingCar(null);
    await reloadCars();
    return { success: true };
  };

  const handleToggleSold = (carId: string, currentSold: boolean) => {
    startTransition(async () => {
      await toggleSoldAction(carId, !currentSold, tenant.slug);
      await reloadCars();
    });
  };

  const handleToggleFeatured = (carId: string, currentFeatured: boolean) => {
    startTransition(async () => {
      await toggleFeaturedAction(carId, !currentFeatured, tenant.slug);
      await reloadCars();
    });
  };

  const handleDelete = (carId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to auto z bazy?")) return;
    startTransition(async () => {
      await deleteCarAction(carId, tenant.slug);
      await reloadCars();
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Pasek górny */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <CarIcon className="h-5 w-5 text-emerald-400" strokeWidth={1.75} />
              Zarządzanie Flotą ({tenant.business_name})
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Dodawaj i edytuj samochody. Zmiany są widoczne natychmiast na stronie komisu i w feedzie Autoplac.pl.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCar(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Dodaj samochód
        </button>
      </div>

      {/* Baner feedu Autoplac.pl (widoczny tylko gdy funkcja jest włączona w ustawieniach) */}
      {tenant.autoplac_enabled && <AutoplacFeedBanner feedUrl={feedUrl} />}

      {/* Modal formularza */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl my-8">
            <CarFormContainer
              initialCar={editingCar}
              tenantId={tenant.id}
              onSave={handleSaveCar}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCar(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Filtry i wyszukiwarka */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" strokeWidth={1.75} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Szukaj po marce, modelu lub numerze VIN..."
          className="w-full rounded-lg bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Tabela aut z obsługą 4 stanów */}
      <CarsTable
        carsState={displayedState}
        onEditCar={(car) => {
          setEditingCar(car);
          setIsFormOpen(true);
        }}
        onToggleSold={handleToggleSold}
        onToggleFeatured={handleToggleFeatured}
        onDeleteCar={handleDelete}
        onRetry={reloadCars}
        onAddCar={() => {
          setEditingCar(null);
          setIsFormOpen(true);
        }}
        tenantSlug={tenant.slug}
      />
    </div>
  );
}
