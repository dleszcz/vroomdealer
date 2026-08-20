import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface ReviewsSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function ReviewsSection({ tenant, config }: ReviewsSectionProps) {
  const stats = [
    { value: "100%", label: "uczciwych transakcji" },
    { value: "0 zł", label: "ukrytych kosztów" },
    { value: "7 dni", label: "w tygodniu do Twojej dyspozycji" },
  ];

  return (
    <section id="reviews" style={{ width: "100%", background: "#ffffff", padding: "5rem 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left Column — Stats & Headline */}
          <div>
            <span
              style={{
                display: "inline-block",
                color: "var(--color-primary, #1686E0)",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
              }}
            >
              DLACZEGO WARTO NAM ZAUFAĆ?
            </span>

            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                color: "#090B0B",
                marginBottom: "2.5rem",
                lineHeight: 1.2,
              }}
            >
              Doświadczenie. Uczciwość. Zadowoleni klienci.
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {stats.map((st, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--color-primary, #1686E0)", lineHeight: 1 }}>
                    {st.value}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.5rem", lineHeight: 1.35, fontWeight: 500 }}>
                    {st.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Testimonial Quote Card */}
          <div
            style={{
              background: "#F1F3F5",
              borderRadius: "18px",
              padding: "2.75rem",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                fontSize: "3.5rem",
                color: "var(--color-primary, #1686E0)",
                lineHeight: 1,
                marginBottom: "0.5rem",
                fontFamily: "Georgia, serif",
              }}
            >
              “
            </div>

            <p style={{ fontSize: "1.1rem", color: "#090B0B", lineHeight: 1.65, fontWeight: 500, marginBottom: "1.75rem" }}>
              Szybka wycena, uczciwa oferta i gotówka od ręki. Polecam każdemu, kto chce sprzedać auto bez zbędnych formalności.
            </p>

            <div style={{ fontWeight: 800, color: "#090B0B", fontSize: "1rem", marginBottom: "1.75rem" }}>
              - Michał, Toruń
            </div>

            {/* Slider Dots */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--color-primary, #1686E0)" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#cbd5e1" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#cbd5e1" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#cbd5e1" }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
