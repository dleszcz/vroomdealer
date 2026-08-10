"use client";

import React from "react";
import { DealerTenant, SectionConfig, DealerService } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface ServicesSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function ServicesSection({ tenant, config }: ServicesSectionProps) {
  const services = tenant.services.filter((s) => s.enabled !== false);

  if (services.length === 0) return null;

  const phone = tenant.contact.phone?.replace(/\s/g, "");

  const renderCTA = (service: DealerService) => {
    if (service.ctaType === "lead_form") {
      return (
        <a
          href="#lead-form"
          className="services__link-label"
          onClick={() => trackEvent("service_clicked", { type: service.type, cta: "lead_form" })}
        >
          {service.ctaLabel || "Zamów wycenę"} <span className="arrow">→</span>
        </a>
      );
    }

    if (service.ctaType === "phone" && phone) {
      return (
        <a
          href={`tel:${phone}`}
          className="services__link-label"
          onClick={() => trackEvent("phone_clicked", { type: service.type, cta: "phone" })}
        >
          {service.ctaLabel || "Zadzwoń teraz"} <span className="arrow">→</span>
        </a>
      );
    }

    if (service.ctaValue) {
      return (
        <a
          href={service.ctaValue}
          className="services__link-label"
          onClick={() => trackEvent("service_clicked", { type: service.type, cta: service.ctaType })}
        >
          {service.ctaLabel || "Dowiedz się więcej"} <span className="arrow">→</span>
        </a>
      );
    }

    return null;
  };

  return (
    <section className="services" id="services" style={{ padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <h2 className="services__title">
          {config?.title || `Usługi u ${tenant.businessName}`}
        </h2>
        <div className="services__grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {services.map((service) => (
            <div
              key={service.id}
              className="services__card"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "16px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  className="services__icon"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: "rgba(30, 41, 59, 0.08)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  {service.type === "car_buying" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  )}
                  {service.type === "towing" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="9" width="20" height="8" rx="2" />
                      <path d="M5 17v2a2 2 0 1 0 4 0v-2M15 17v2a2 2 0 1 0 4 0v-2" />
                    </svg>
                  )}
                  {service.type === "car_sales" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.7 11.1 2.5 11.5 2.5 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  )}
                  {service.type !== "car_buying" && service.type !== "towing" && service.type !== "car_sales" && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  )}
                </div>

                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--color-foreground)" }}>
                  {service.title}
                </h3>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                  {service.description}
                </p>
              </div>

              {renderCTA(service)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
