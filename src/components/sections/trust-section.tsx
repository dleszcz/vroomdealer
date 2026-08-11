import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface TrustSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function TrustSection({ tenant, config }: TrustSectionProps) {
  const trustPoints = [
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Najlepsze ceny",
      desc: "Płacimy uczciwie i od ręki.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Szybka decyzja",
      desc: "Wycena nawet w 15 minut.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: "Odbiór auta",
      desc: "Przyjedziemy po auto do Ciebie.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      title: "Minimum formalności",
      desc: "Wszystko załatwiamy za Ciebie.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Bezpieczeństwo",
      desc: "Pewna i legalna transakcja.",
    },
  ];

  return (
    <section id="trust" style={{ width: "100%", background: "#ffffff", padding: "5rem 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: "3rem" }}>
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
            DLACZEGO D-CAR?
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#090B0B", margin: 0 }}>
            Skup i sprzedaż samochodów na jasnych zasadach
          </h2>
        </div>

        {/* 5 Cards Horizontal Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
          {trustPoints.map((pt, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "2rem 1.25rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: "rgba(22, 134, 224, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                {pt.icon}
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#090B0B", marginBottom: "0.4rem" }}>
                {pt.title}
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4, margin: 0 }}>
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
