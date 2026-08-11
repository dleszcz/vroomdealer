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

  if (cars.length === 0) return null;

  return (
    <section id="vehicles" style={{ width: "100%", background: "#ffffff", padding: "5rem 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
          <div>
            <span
              style={{
                display: "inline-block",
                color: "var(--color-primary, #1686E0)",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
              }}
            >
              AKTUALNA OFERTA
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#090B0B", margin: 0 }}>
              Samochody na sprzedaż
            </h2>
          </div>

          <a
            href={`/${tenant.slug}#vehicles`}
            style={{
              color: "var(--color-primary, #1686E0)",
              fontWeight: 800,
              fontSize: "0.9rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span>ZOBACZ WSZYSTKIE</span>
            <span>→</span>
          </a>
        </div>

        {/* Cars Grid */}
        <div className="car-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} dealerSlug={tenant.slug} />
          ))}
        </div>

      </div>
    </section>
  );
}
