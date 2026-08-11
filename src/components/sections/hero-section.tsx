"use client";

import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface HeroSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function HeroSection({ tenant, config }: HeroSectionProps) {
  const eyebrow = config?.subtitle ? config.subtitle.toUpperCase() : `AUTO KOMIS ${tenant.businessName.toUpperCase()}`;
  const title = config?.title || "Sprzedaj nam swoje auto";
  const subtitle = "Szybko, bezpiecznie i bez zbędnych formalności.";

  const heroImg =
    (config?.data?.heroImageUrl as string) ||
    tenant.branding?.media?.heroImageUrl ||
    "/images/dcar-hero.jpg";

  const benefits = [
    { icon: "💼", label: "Gotówka od ręki" },
    { icon: "📋", label: "Bezpłatna wycena" },
    { icon: "🚛", label: "Odbieramy auto" },
    { icon: "⚖️", label: "Formalności po naszej stronie" },
  ];

  return (
    <section
      className="landing__hero"
      id="hero"
      style={{
        width: "100%",
        background: "#080808",
        color: "#ffffff",
        padding: "4.5rem 0 5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "var(--max-width, 1280px)", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center" }}>
          
          {/* Left Column — Content & Buttons */}
          <div>
            <span
              style={{
                display: "inline-block",
                color: "var(--color-primary, #1686E0)",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>

            <h1
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 3.75rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                marginBottom: "1.25rem",
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "#94a3b8",
                lineHeight: 1.6,
                marginBottom: "2.5rem",
                maxWidth: "520px",
              }}
            >
              {subtitle}
            </p>

            {/* 2 Main Buttons (Flex Row Side-by-Side) */}
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1.25rem", marginBottom: "3rem" }}>
              {/* Primary CTA */}
              <a
                href="#lead-form"
                style={{
                  padding: "0.85rem 2.25rem",
                  borderRadius: "12px",
                  background: "var(--color-primary, #1686E0)",
                  color: "#ffffff",
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: "0 6px 22px rgba(22, 134, 224, 0.4)",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s, background 0.2s",
                }}
                onClick={() => trackEvent("lead_form_started", { source: "hero_primary_cta" })}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.03em" }}>SPRZEDAJ AUTO</span>
                <span style={{ fontSize: "0.725rem", opacity: 0.85, fontWeight: 500 }}>Bezpłatna wycena</span>
              </a>

              {/* Secondary CTA */}
              <a
                href="#vehicles"
                style={{
                  padding: "0.85rem 2rem",
                  borderRadius: "12px",
                  background: "transparent",
                  color: "#ffffff",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  textDecoration: "none",
                  textAlign: "center",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.2s",
                }}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.03em" }}>ZOBACZ SAMOCHODY</span>
                <span style={{ fontSize: "0.725rem", color: "#94a3b8", fontWeight: 500 }}>Aktualna oferta</span>
              </a>
            </div>

            {/* Bottom 4 Feature Badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                paddingTop: "1.75rem",
                borderTop: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {benefits.map((b, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600 }}>
                  <span style={{ fontSize: "1.1rem" }}>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Hero Image with Diagonal Blue Accent Line */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.12)",
                position: "relative",
                height: "460px",
              }}
            >
              <img
                src={heroImg}
                alt={tenant.businessName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              
              {/* Distinct Diagonal Blue Accent Line (as in reference mockup) */}
              <div
                style={{
                  position: "absolute",
                  top: "-10%",
                  left: "-10%",
                  width: "45%",
                  height: "120%",
                  background: "linear-gradient(135deg, rgba(22, 134, 224, 0.75) 0%, rgba(22, 134, 224, 0.05) 70%, transparent 100%)",
                  transform: "skewX(-18deg)",
                  pointerEvents: "none",
                  borderRight: "3px solid var(--color-primary, #1686E0)",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
