import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface ReviewsSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function ReviewsSection({ tenant, config }: ReviewsSectionProps) {
  const reviews = [
    {
      author: "Marek K.",
      city: "Warszawa",
      car: "BMW Serii 3",
      text: `Super podejście! Sprzedałem moją trójkę w jeden dzień. Panowie przyjechali pod dom, wycenili bez marudzenia i wypłacili gotówkę. Polecam ${tenant.businessName}!`,
      rating: 5,
    },
    {
      author: "Piotr W.",
      city: "Pruszków",
      car: "VW Passat",
      text: "Transakcja sprawna i bezpieczna. Umowa jasna, zero ukrytych haczyków. Bardzo miły kontakt telefoniczny.",
      rating: 5,
    },
    {
      author: "Anna M.",
      city: "Piaseczno",
      car: "Toyota Yaris",
      text: "Kupiłam tutaj swoje pierwsze auto. Samochód dokładnie opisany, zgadzał się ze stanem faktycznym. Bardzo pomocna obsługa.",
      rating: 5,
    },
  ];

  return (
    <section id="reviews" style={{ padding: "4rem 1.5rem", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
            {config?.title || `Co mówią klienci o ${tenant.businessName}?`}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
            Opinie kierowców, którzy sprzedali lub kupili u nas samochód.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ color: "#f59e0b", marginBottom: "0.75rem", fontSize: "1.1rem" }}>
                  {"★".repeat(rev.rating)}
                </div>
                <p style={{ color: "var(--color-foreground)", fontStyle: "italic", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  &quot;{rev.text}&quot;
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                <div>
                  <strong style={{ color: "var(--color-foreground)", display: "block" }}>{rev.author}</strong>
                  <span>{rev.city}</span>
                </div>
                <span style={{ padding: "0.25rem 0.5rem", borderRadius: "6px", background: "rgba(30, 41, 59, 0.08)", color: "var(--color-primary)", fontSize: "0.75rem" }}>
                  {rev.car}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
