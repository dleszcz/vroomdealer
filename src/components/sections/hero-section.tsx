"use client";

import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface HeroSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function HeroSection({ tenant, config }: HeroSectionProps) {
  const phone = tenant.contact.phone;
  const telUrl = phone ? `tel:${phone.replace(/\s/g, "")}` : "#";
  const whatsappNumber = tenant.contact.whatsapp;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Dzień dobry! Piszę ze strony ${tenant.businessName} w sprawie bezpłatnej wyceny / zakupu auta.`
      )}`
    : null;

  const title = config?.title || tenant.seo?.metaTitle || `Twój prywatny system sprzedaży i skupu aut w ${tenant.location?.city || "Warszawie"}`;
  const subtitle = config?.subtitle || tenant.businessDescription || "Zbieraj bezpośrednie telefony od kupców, uzyskaj natychmiastową wycenę swojego auta i kupuj sprawdzone samochody z gwarancją.";

  const heroImg =
    (config?.data?.heroImageUrl as string) ||
    tenant.branding.media?.heroImageUrl ||
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000&h=1200&fit=crop";

  return (
    <section className="landing__hero" id="hero">
      <div className="landing__hero-inner">
        <div className="landing__text">
          <div className="brand-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "9999px", background: "var(--color-surface)", border: "1px solid var(--color-border)", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-primary)" }} />
            <span>{tenant.businessName} • {tenant.location?.city || "Polska"}</span>
          </div>

          <h1 className="landing__title">{title}</h1>
          <p className="landing__subtitle">{subtitle}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
            <a
              href="#lead-form"
              className="landing__cta"
              onClick={() => trackEvent("lead_form_started", { source: "hero_primary_cta" })}
            >
              Wyceń swoje auto
            </a>

            {phone && (
              <a
                href={telUrl}
                className="landing__cta"
                style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                onClick={() => trackEvent("phone_clicked", { source: "hero_cta" })}
              >
                📞 {phone}
              </a>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="landing__cta"
                style={{ background: "#25d366", color: "#ffffff" }}
                onClick={() => trackEvent("whatsapp_clicked", { source: "hero_cta" })}
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="landing__visual">
          <div className="landing__visual-bg" />
          <div className="landing__visual-container">
            <div className="landing__visual-card">
              <img src={heroImg} alt={tenant.businessName} />
              <div className="landing__visual-gradient" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
