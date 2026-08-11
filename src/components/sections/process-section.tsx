import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface ProcessSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function ProcessSection({ tenant, config }: ProcessSectionProps) {
  const steps = [
    {
      num: "1",
      title: "Zostaw dane",
      desc: "Wypełnij formularz lub zadzwoń.",
    },
    {
      num: "2",
      title: "Wycena",
      desc: "Ocenimy auto i przedstawimy ofertę.",
    },
    {
      num: "3",
      title: "Umowa i płatność",
      desc: "Podpiszemy umowę i wypłacimy pieniądze.",
    },
    {
      num: "4",
      title: "Odbiór auta",
      desc: "Odbierzemy auto lub przyjedziesz do nas.",
    },
  ];

  return (
    <section id="process" style={{ width: "100%", background: "#ffffff", padding: "5rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: "var(--max-width, 1280px)", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              color: "var(--color-primary, #1686E0)",
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            JAK TO DZIAŁA?
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#090B0B", margin: 0 }}>
            Prosty 4-etapowy proces
          </h2>
        </div>

        {/* 4 Steps Timeline Row */}
        <div style={{ position: "relative" }}>
          {/* Horizontal Connecting Line (Desktop) */}
          <div
            style={{
              position: "absolute",
              top: "22px",
              left: "5%",
              right: "5%",
              height: "2px",
              background: "#E5E7EB",
              zIndex: 0,
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", position: "relative", zIndex: 1 }}>
            {steps.map((st, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  position: "relative",
                  background: "#ffffff",
                  paddingRight: "1rem",
                }}
              >
                {/* Step Circle Number */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "var(--color-primary, #1686E0)",
                    color: "#ffffff",
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    boxShadow: "0 4px 14px rgba(22, 134, 224, 0.35)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {st.num}
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#090B0B", marginBottom: "0.5rem" }}>
                  {st.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
