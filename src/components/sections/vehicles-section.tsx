import React from "react";
import { ArrowRight } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { getCars } from "@/lib/data";
import { CarCard } from "@/components/car-card";

interface Props { tenant: DealerTenant; config?: SectionConfig; }

export async function VehiclesSection({ tenant }: Props) {
  const allCars = (await getCars(tenant.id)).filter(car => !car.is_sold);
  if (!allCars.length) return null;

  const displayLimit = 4;
  const carsToDisplay = allCars.slice(0, displayLimit);
  const hasMore = allCars.length > displayLimit;

  return (
    <section id="vehicles" className="vd-section vd-section--bordered">
      <div className="vd-container">
        <div className="vehicles__header">
          <div>
            <span className="vd-eyebrow">Aktualna oferta</span>
            <h2 className="vd-heading">Samochody na sprzedaż</h2>
          </div>
          {hasMore && (
            <a className="vehicles__all" href={`/${tenant.slug}/samochody`}>
              <span>Zobacz wszystkie ({allCars.length})</span>
              <ArrowRight size={14} />
            </a>
          )}
        </div>
        <div className="vehicles__grid">
          {carsToDisplay.map(car => <CarCard key={car.id} car={car} dealerSlug={tenant.slug} />)}
        </div>
      </div>
    </section>
  );
}
