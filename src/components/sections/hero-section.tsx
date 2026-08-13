"use client";

import React from "react";
import { Banknote, ClipboardCheck, Scale, Truck } from "lucide-react";
import { DealerTenant, HeroConfig, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface HeroSectionProps { tenant: DealerTenant; config?: SectionConfig; }


const iconMap = { cash: Banknote, check: ClipboardCheck, truck: Truck, scale: Scale };

export function HeroSection({ tenant, config }: HeroSectionProps) {
  const data = (config?.data || {}) as HeroConfig;
  const sanitizeImage = (img?: string | null) => (img && typeof img === "string" && !img.includes("unsplash") ? img : null);
  const heroImage = sanitizeImage(data.image) || sanitizeImage(tenant.branding.media?.heroImageUrl) || "/images/dcar-hero.png";
  const benefits = data.benefits?.length ? data.benefits : [
    { label: "Gotówka od ręki", icon: "cash" },
    { label: "Bezpłatna wycena", icon: "check" },
    { label: "Odbieramy auto", icon: "truck" },
    { label: "Formalności po naszej stronie", icon: "scale" },
  ];

  const primaryHref = data.primaryCta?.href || (tenant.contact.whatsapp ? `https://wa.me/${tenant.contact.whatsapp.replace(/\D/g, "")}` : tenant.contact.phone ? `tel:${tenant.contact.phone.replace(/\s/g, "")}` : "#about");
  const integratedHeroTreatment = heroImage.includes("dcar-hero");
  const secondaryHref = data.secondaryCta?.href || "#vehicles";

  return (
    <section id="hero" className={`dealer-hero ${integratedHeroTreatment ? "dealer-hero--integrated" : ""}`}>
      <div className="dealer-hero__media" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />
      {data.showAccent !== false && !integratedHeroTreatment && <div className="dealer-hero__accent" aria-hidden="true" />}
      <div className="vd-container dealer-hero__content">
        <div className="dealer-hero__copy">
          <div className="dealer-hero__eyebrow">{data.eyebrow || `AUTO KOMIS ${tenant.businessName.toUpperCase()}`}</div>
          <h1 className="dealer-hero__title">{data.title || "Sprzedaj nam swoje auto"}</h1>
          <p className="dealer-hero__description">{data.description || "Szybko, bezpiecznie i bez zbędnych formalności."}</p>

          <div className="dealer-hero__actions">
            <a className="vd-button vd-button--primary dealer-hero__button" href={primaryHref} onClick={() => trackEvent("lead_form_started", { source: "hero_primary_cta", dealer_id: tenant.id })}>
              <span>{data.primaryCta?.label || "Sprzedaj auto"}</span>
              <small>{data.primaryCta?.sublabel || "Bezpłatna wycena"}</small>
            </a>
            <a className="vd-button vd-button--outline-dark dealer-hero__button" href={secondaryHref}>
              <span>{data.secondaryCta?.label || "Zobacz samochody"}</span>
              <small>{data.secondaryCta?.sublabel || "Aktualna oferta"}</small>
            </a>
          </div>

          <div className="dealer-hero__benefits">
            {benefits.map((benefit, index) => {
              const Icon = iconMap[(benefit.icon || "check") as keyof typeof iconMap] || ClipboardCheck;
              return <div className="dealer-hero__benefit" key={`${benefit.label}-${index}`}><Icon size={16} strokeWidth={2} /><span>{benefit.label}</span></div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
