import React from "react";
import { ArrowRight } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { getCars } from "@/lib/data";
import { CarCard } from "@/components/car-card";

interface Props { tenant: DealerTenant; config?: SectionConfig; }

export async function VehiclesSection({ tenant }: Props) {
  const cars = (await getCars(tenant.id)).filter(car => !car.is_sold).slice(0, 5);
  if (!cars.length) return null;
  return (
    <section id="vehicles" className="vd-section vd-section--bordered">
      <div className="vd-container">
        <div className="vehicles__header">
          <div>
            <span className="vd-eyebrow">Aktualna oferta</span>
            <h2 className="vd-heading">Samochody na sprzedaż</h2>
          </div>
          <a className="vehicles__all" href={`/${tenant.slug}`}><span>Zobacz wszystkie</span><ArrowRight size={14} /></a>
        </div>
        <div className="vehicles__grid">
          {cars.map(car => <CarCard key={car.id} car={car} dealerSlug={tenant.slug} />)}
        </div>
      </div>
    </section>
  );
}
