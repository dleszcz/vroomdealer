import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { CheckCircle2, MapPin, Calendar, Banknote } from "lucide-react";

interface Props {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function RecentlyBoughtCarsSection({ tenant, config }: Props) {
  const city = tenant.location?.city || "Topólka";
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";

  const defaultBoughtCars = [
    {
      brand: "Audi A4 B8 2.0 TDI",
      year: "2012",
      price: "24 500 zł",
      location: `Gmina ${city}`,
      timeAgo: "Dzisiaj, 11:30",
      condition: "Sprawny, bezwypadkowy",
    },
    {
      brand: "Volkswagen Passat B7 Variant",
      year: "2013",
      price: "28 900 zł",
      location: "Radziejów",
      timeAgo: "Wczoraj",
      condition: "Uszkodzony zderzak",
    },
    {
      brand: "BMW Seria 3 F30 320d",
      year: "2014",
      price: "42 000 zł",
      location: "Lubraniec",
      timeAgo: "2 dni temu",
      condition: "Sprawny",
    },
    {
      brand: "Opel Astra J Hatchback",
      year: "2011",
      price: "18 500 zł",
      location: "Izbica Kujawska",
      timeAgo: "3 dni temu",
      condition: "Do poprawek lakierniczych",
    },
  ];

  const title = config?.title || "Ostatnio kupione samochody";
  const subtitle =
    config?.subtitle ||
    `Zobacz przykładowe pojazdy wycenione i odkupione za gotówkę przez ${tenant.businessName} w Twojej okolicy.`;

  return (
    <section id="recently-bought" className="vd-section vd-section--bordered">
      <div className="vd-container">
        <div style={{ maxWidth: "720px", margin: "0 auto 36px", textAlign: "center" }}>
          <span className="vd-eyebrow" style={{ color: primaryColor }}>
            Transakcje za gotówkę
          </span>
          <h2 className="vd-heading" style={{ marginBottom: "12px" }}>
            {title}
          </h2>
          <p className="vd-copy" style={{ color: "var(--color-text-soft)", fontSize: "16px", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            maxWidth: "1140px",
            margin: "0 auto",
          }}
        >
          {defaultBoughtCars.map((car, i) => (
            <div
              key={i}
              style={{
                background: "var(--color-surface, #ffffff)",
                border: "1px solid var(--color-border, #e5e7eb)",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    color: "#10b981",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "999px",
                    marginBottom: "14px",
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Odkupiono za gotówkę</span>
                </div>

                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--color-foreground)", marginBottom: "8px" }}>
                  {car.brand}
                </h3>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "13px", color: "var(--color-text-soft)", marginBottom: "14px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={14} style={{ opacity: 0.7 }} /> {car.year} r.
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={14} style={{ opacity: 0.7 }} /> {car.location}
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--color-text-soft)", background: "var(--color-soft-bg, #f8fafc)", padding: "8px 12px", borderRadius: "8px", marginBottom: "16px" }}>
                  Stan: <strong>{car.condition}</strong>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid var(--color-border, #e5e7eb)",
                  paddingTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--color-text-soft)", fontWeight: 700 }}>
                    Kwota wypłacona
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: primaryColor }}>
                    {car.price}
                  </div>
                </div>

                <div style={{ fontSize: "11px", color: "var(--color-text-soft)", fontWeight: 600 }}>
                  {car.timeAgo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
