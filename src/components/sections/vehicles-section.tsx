import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { getCars } from "@/lib/data";
import { CarCard } from "@/components/car-card";

interface VehiclesSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export async function VehiclesSection({ tenant, config }: VehiclesSectionProps) {
  const cars = await getCars(tenant.id);
  const availableCars = cars.filter((c) => !c.is_sold);
  const soldCars = cars.filter((c) => c.is_sold);

  if (cars.length === 0) return null;

  return (
    <section id="vehicles" style={{ padding: "4rem 1.5rem", background: "var(--color-background)" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
            {config?.title || "Aktualna Oferta i Ostatnio Kupione Samochody"}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
            Przeglądaj wyselekcjonowane auta dostępne od ręki oraz przykłady pojazdów, które niedawno odkupiliśmy.
          </p>
        </div>

        {availableCars.length > 0 && (
          <div style={{ marginBottom: "3.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "1.5rem" }}>
              Dostępne na placu ({availableCars.length})
            </h3>
            <div className="car-grid">
              {availableCars.map((car) => (
                <CarCard key={car.id} car={car} dealerSlug={tenant.slug} />
              ))}
            </div>
          </div>
        )}

        {soldCars.length > 0 && (
          <div style={{ opacity: 0.8 }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "1.5rem" }}>
              Ostatnio kupione / Sprzedane ({soldCars.length})
            </h3>
            <div className="car-grid">
              {soldCars.map((car) => (
                <CarCard key={car.id} car={car} dealerSlug={tenant.slug} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
