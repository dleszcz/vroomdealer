"use client";

import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface AboutSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function AboutSection({ tenant, config }: AboutSectionProps) {
  const heroImage =
    tenant.branding?.media?.heroImageUrl ||
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop";

  return (
    <section className="about-section" id="about" style={{ width: "100%", background: "#F1F3F5", padding: "5rem 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3.5rem",
            alignItems: "center",
          }}
        >
          {/* Left — Image of Dealer Yard */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                border: "1px solid #E2E8F0",
                height: "360px",
              }}
            >
              <img
                src={heroImage}
                alt={`Plac komisu ${tenant.businessName}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Right — Text & Checklist */}
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
              PIERWSZY PARTNER WALIDACYJNY VROOMDEALER
            </span>

            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                color: "#090B0B",
                marginBottom: "1.25rem",
                lineHeight: 1.2,
              }}
            >
              {config?.title || `${tenant.businessName} – lokalny komis, realne wyniki`}
            </h2>

            <p
              style={{
                fontSize: "1.05rem",
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              {tenant.businessName} to pierwszy komis, z którym rozwijamy VroomDealer. Razem testujemy i udoskonalamy system, który naprawdę działa.
            </p>

            <ul style={{ display: "flex", flexDirection: "column", gap: "0.85rem", padding: 0, margin: "0 0 2.25rem 0", listStyle: "none" }}>
              {[
                "Własna strona komisu",
                "Pozyskiwanie wartościowych aut",
                "Pełne wsparcie i technologia VroomDealer",
              ].map((item, index) => (
                <li key={index} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "var(--color-primary, #1686E0)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.75rem",
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: "0.95rem", color: "#090B0B", fontWeight: 700 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#lead-form"
              style={{
                display: "inline-block",
                padding: "0.85rem 2rem",
                borderRadius: "10px",
                background: "var(--color-primary, #1686E0)",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: "0.03em",
                boxShadow: "0 4px 14px rgba(22, 134, 224, 0.3)",
              }}
            >
              ZOBACZ NASZĄ STRONĘ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
