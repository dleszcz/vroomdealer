"use client";

import React from "react";
import { Banknote, ClipboardCheck, Scale, Truck } from "lucide-react";
import { DealerTenant, HeroConfig, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface HeroSectionProps { tenant: DealerTenant; config?: SectionConfig; }


const iconMap = { cash: Banknote, check: ClipboardCheck, truck: Truck, scale: Scale };

export function HeroSection({ tenant, config }: HeroSectionProps) {
  const data = (config?.data || {}) as HeroConfig;
  const heroImage = data.image || tenant.branding.media?.heroImageUrl || "";
  const benefits = data.benefits?.length ? data.benefits : [
    { label: "Gotówka od ręki", icon: "cash" },
    { label: "Bezpłatna wycena", icon: "check" },
    { label: "Auto w rozliczeniu", icon: "check" },
    { label: "Skup aut do 10 000 zł", icon: "cash" },
    { label: "Odbieramy auto", icon: "truck" },
    { label: "Formalności po naszej stronie", icon: "scale" },
  ];

  const primaryHref = data.primaryCta?.href || `/${tenant.slug}/skup-aut`;
  const secondaryHref = data.secondaryCta?.href || `/${tenant.slug}#vehicles`;

  return (
    <section id="hero" className="dealer-hero">
      {heroImage && <div className="dealer-hero__media" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />}
      <div className="vd-container dealer-hero__content">
        <div className="dealer-hero__copy">
          <div className="dealer-hero__eyebrow">{data.eyebrow || `${tenant.businessName.toUpperCase()}`}</div>

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
