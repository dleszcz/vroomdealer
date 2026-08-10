import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface ProcessSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function ProcessSection({ config }: ProcessSectionProps) {
  const steps = [
    {
      step: "01",
      title: "Wypełnij formularz lub zadzwoń",
      desc: "Podaj podstawowe informacje o samochodzie (marka, model, rocznik, stan) w formularzu online lub zadzwoń bezpośrednio.",
    },
    {
      step: "02",
      title: "Szybka wycena i bezpłatne oględziny",
      desc: "Przedstawiamy Ci natychmiastową wycenę. Jeśli ją zaakceptujesz, przyjeżdżamy we wskazane miejsce na bezpłatny przegląd.",
    },
    {
      step: "03",
      title: "Umowa i wypłata gotówki od ręki",
      desc: "Podpisujemy prostą umowę kupna-sprzedaży i przekazujemy pieniądze do ręki lub robimy przelew ekspresowy na miejscu.",
    },
  ];

  return (
    <section id="process" style={{ padding: "4rem 1.5rem", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
            {config?.title || "Jak wygląda skup auta w 3 prostych krokach?"}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
            Oszczędź czas — od zgłoszenia do wypłaty gotówki w mniej niż 2 godziny!
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                padding: "2rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "var(--color-primary)",
                  marginBottom: "1rem",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(30, 41, 59, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.step}
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
                {s.title}
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
