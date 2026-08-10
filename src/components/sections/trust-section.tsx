import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface TrustSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function TrustSection({ tenant, config }: TrustSectionProps) {
  const trustPoints = [
    {
      icon: "💵",
      title: "Gotówka lub Przelew od ręki",
      desc: "Pieniądze wypłacamy natychmiast przy podpisaniu umowy — gotówką do ręki lub szybkim przelewem ekspresowym.",
    },
    {
      icon: "📜",
      title: "Czyste Formalności",
      desc: "Sporządzamy legalną i bezpieczną umowę kupna-sprzedaży. Przejmujemy pełną odpowiedzialność za pojazd.",
    },
    {
      icon: "🚛",
      title: "Darmowy Odbiór Auta",
      desc: "Posiadamy własną autolawetę. Odbieramy samochody niesprawne i uszkodzone bezpośrednio spod Twojego domu.",
    },
    {
      icon: "⏱️",
      title: "Szybki Dojazd w 30 min",
      desc: `Działamy na terenie ${tenant.location?.city || "całego regionu"}. Przyjeżdżamy na wycenę i oględziny nawet w ten sam dzień.`,
    },
  ];

  return (
    <section id="trust" style={{ padding: "4rem 1.5rem", background: "var(--color-background)" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
            {config?.title || `Dlaczego klienci wybierają ${tenant.businessName}?`}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
            Gwarancja uczciwej transakcji, bezpieczeństwa i maksymalnej wygody.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {trustPoints.map((pt, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                padding: "1.75rem",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{pt.icon}</div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
                {pt.title}
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
