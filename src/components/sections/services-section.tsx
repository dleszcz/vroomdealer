"use client";

import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface ServicesSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function ServicesSection({ tenant, config }: ServicesSectionProps) {
  const phone = tenant.contact.phone || "+48 609 525 935";

  const cards = [
    {
      id: "srv-buying",
      title: "Skup aut",
      text: "Skupujemy auta wszystkich marek, w każdym stanie technicznym.",
      btnText: "SPRZEDAJ AUTO",
      btnVariant: "solid",
      href: "#lead-form",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: "srv-sales",
      title: "Sprzedaż aut",
      text: "Szeroki wybór sprawdzonych samochodów.",
      btnText: "ZOBACZ OFERTĘ",
      btnVariant: "outline",
      href: "#vehicles",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.7 11.1 2.5 11.5 2.5 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
    },
    {
      id: "srv-towing",
      title: "Pomoc drogowa",
      text: "Laweta 24/7 na terenie całego kraju.",
      btnText: phone,
      btnVariant: "outline",
      href: `tel:${phone.replace(/\s/g, "")}`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <rect x="2" y="9" width="20" height="8" rx="2" />
          <path d="M5 17v2a2 2 0 1 0 4 0v-2M15 17v2a2 2 0 1 0 4 0v-2" />
        </svg>
      ),
    },
    {
      id: "srv-other",
      title: "Inne usługi",
      text: "Transport aut, przygotowanie do rejestracji i inne.",
      btnText: "SPRAWDŹ",
      btnVariant: "outline",
      href: "#lead-form",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" style={{ width: "100%", background: "#ffffff", padding: "5rem 0", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: "var(--max-width, 1280px)", margin: "0 auto", padding: "0 1.5rem" }}>
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
            NASZA OFERTA
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#090B0B", margin: 0 }}>
            Kompleksowe usługi motoryzacyjne
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {cards.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "2.25rem 1.75rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "space-between",
                minHeight: "280px",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(22, 134, 224, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  {c.icon}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#090B0B", marginBottom: "0.5rem" }}>
                  {c.title}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "0.875rem", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
                  {c.text}
                </p>
              </div>

              {c.btnVariant === "solid" ? (
                <a
                  href={c.href}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "var(--color-primary, #1686E0)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(22, 134, 224, 0.3)",
                    textAlign: "center",
                  }}
                  onClick={() => trackEvent("service_clicked", { type: c.id })}
                >
                  {c.btnText}
                </a>
              ) : (
                <a
                  href={c.href}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "var(--color-primary, #1686E0)",
                    border: "1.5px solid var(--color-primary, #1686E0)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                  onClick={() => trackEvent("service_clicked", { type: c.id })}
                >
                  {c.btnText}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
