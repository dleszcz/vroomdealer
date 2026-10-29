import React from "react";
import Image from "next/image";
import { Car } from "@/types/database";
import { CarStatusBadge } from "../car-status-badge";
import { CarsTableSkeleton } from "./cars-table-skeleton";
import { CarsEmptyState } from "./cars-empty-state";
import { AsyncState } from "../../types";
import { Edit2, Star, CheckCircle, ExternalLink, Trash2, AlertTriangle, RefreshCw } from "lucide-react";

interface CarsTableProps {
  carsState: AsyncState<Car[]>;
  onEditCar: (car: Car) => void;
  onToggleSold: (carId: string, currentSold: boolean) => void;
  onToggleFeatured: (carId: string, currentFeatured: boolean) => void;
  onDeleteCar: (carId: string) => void;
  onRetry: () => void;
  onAddCar: () => void;
  tenantSlug: string;
}

export function CarsTable({
  carsState,
  onEditCar,
  onToggleSold,
  onToggleFeatured,
  onDeleteCar,
  onRetry,
  onAddCar,
  tenantSlug,
}: CarsTableProps) {
  // 1. Loading State
  if (carsState.status === "loading") {
    return <CarsTableSkeleton />;
  }

  // 2. Error State
  if (carsState.status === "error") {
    return (
      <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-rose-400 mb-2" strokeWidth={1.75} />
        <h3 className="text-base font-semibold text-rose-200 mb-1">Wystąpił błąd podczas ładowania aut</h3>
        <p className="text-sm text-rose-400/90 mb-4 max-w-md mx-auto">{carsState.error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 transition-colors"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // 3. Empty State
  const cars = carsState.status === "success" ? carsState.data : [];
  if (cars.length === 0) {
    return <CarsEmptyState onAddCar={onAddCar} />;
  }

  // 4. Success State
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
      <div className="divide-y divide-slate-800/80">
        {cars.map((car) => {
          const mainImage = car.images?.[0] || null;
          const formattedPrice = car.price ? `${car.price.toLocaleString("pl-PL")} zł` : "Do uzgodnienia";
          const formattedMileage = car.mileage ? `${car.mileage.toLocaleString("pl-PL")} km` : "-";

          return (
            <div
              key={car.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-800/30 transition-colors"
            >
              {/* Sekcja miniatury i tytułu */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/60">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={`${car.make} ${car.model}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      Brak zdjęć
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-100 truncate">
                      {car.make} {car.model}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">{car.year}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mb-1.5">
                    <span>{formattedMileage}</span>
                    <span>•</span>
                    <span>{car.fuel_type || "Benzyna"}</span>
                    {car.vin && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-slate-300">VIN: {car.vin}</span>
                      </>
                    )}
                  </div>

                  <CarStatusBadge
                    isSold={car.is_sold}
                    isFeatured={car.is_featured}
                    exportToAutoplac={car.export_to_autoplac}
                    autoplacStatus={car.autoplac_status}
                  />
                </div>
              </div>

              {/* Sekcja ceny i akcji */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800/60 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <div className="text-base font-bold text-slate-100 tracking-tight">{formattedPrice}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(car.id, car.is_featured)}
                    title={car.is_featured ? "Usuń wyróżnienie" : "Wyróżnij na stronie"}
                    className={`p-2 rounded-lg transition-colors ${
                      car.is_featured
                        ? "text-amber-400 hover:bg-amber-950/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <Star className="h-4 w-4" strokeWidth={1.75} fill={car.is_featured ? "currentColor" : "none"} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSold(car.id, car.is_sold)}
                    title={car.is_sold ? "Oznacz jako dostępne" : "Oznacz jako sprzedane"}
                    className={`p-2 rounded-lg transition-colors ${
                      car.is_sold
                        ? "text-emerald-400 hover:bg-emerald-950/40"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditCar(car)}
                    title="Edytuj pojazd"
                    className="p-2 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCar(car.id)}
                    title="Usuń pojazd"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
