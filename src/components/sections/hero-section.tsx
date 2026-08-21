"use client";

import React from "react";
import { Banknote, ClipboardCheck, Scale, Truck } from "lucide-react";
import { DealerTenant, HeroConfig, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { getTenantUrl } from "@/lib/urls";

interface HeroSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
  mode?: "all" | "skup-aut";
}

const iconMap = { cash: Banknote, check: ClipboardCheck, truck: Truck, scale: Scale };

export function HeroSection({ tenant, config, mode = "all" }: HeroSectionProps) {
  const data = (config?.data || {}) as HeroConfig;
  const heroImage = data.image || tenant.branding.media?.heroImageUrl || "";
  const isSkupMode = mode === "skup-aut";
  const phone = tenant.contact.phone || "";
  const cleanPhone = phone.replace(/\s/g, "");

  const benefits = data.benefits?.length ? data.benefits : [
    { label: "Gotówka od ręki", icon: "cash" },
    { label: "Bezpłatna wycena", icon: "check" },
    { label: "Auto w rozliczeniu", icon: "check" },
    { label: "Skup aut w każdym stanie", icon: "cash" },
    { label: "Odbieramy darmową lawetą", icon: "truck" },
    { label: "Formalności i umowa od ręki", icon: "scale" },
  ];

  const primaryHref = isSkupMode ? "#lead-form" : (data.primaryCta?.href || getTenantUrl(tenant.slug, "/skup-aut", tenant.customDomain));
  const secondaryHref = isSkupMode
    ? (phone ? `tel:${cleanPhone}` : "#lead-form")
    : (data.secondaryCta?.href || getTenantUrl(tenant.slug, "/#vehicles", tenant.customDomain));

  const city = tenant.location?.city || "";
  const title = isSkupMode
    ? `Express skup aut za gotówkę${city ? ` w ${city}` : ""}`
    : (data.title || "Sprzedaj nam swoje auto");

  const description = isSkupMode
    ? "Odkupujemy samochody w każdym stanie — całe, uszkodzone, powypadkowe oraz bez OC. Bezpłatny dojazd lawetą i wypłata gotówki od ręki na miejscu!"
    : (data.description || "Szybko, bezpiecznie i bez zbędnych formalności.");

  const primaryLabel = isSkupMode ? "Bezpłatna wycena online" : (data.primaryCta?.label || "Sprzedaj auto");
  const primarySublabel = isSkupMode ? "Wypełnij formularz w 1 min" : (data.primaryCta?.sublabel || "Bezpłatna wycena");

  const secondaryLabel = isSkupMode ? "Zadzwoń do wyceniającego" : (data.secondaryCta?.label || "Zobacz samochody");
  const secondarySublabel = isSkupMode ? (phone || "Bezpośredni kontakt") : (data.secondaryCta?.sublabel || "Aktualna oferta");

  return (
    <section id="hero" className="dealer-hero">
      {heroImage && <div className="dealer-hero__media" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />}
      <div className="vd-container dealer-hero__content">
        {isSkupMode && (
          <div style={{ marginBottom: "16px" }}>
            <Breadcrumbs
              variant="dark"
              items={[
                { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain) },
                { label: "Skup aut za gotówkę" },
              ]}
            />
          </div>
        )}

        <div className="dealer-hero__copy">
          <div className="dealer-hero__eyebrow">
            {isSkupMode ? "⚡ SKUP AUT ZA GOTÓWKĘ" : (data.eyebrow || `${tenant.businessName.toUpperCase()}`)}
          </div>

          <h1 className="dealer-hero__title">{title}</h1>
          <p className="dealer-hero__description">{description}</p>

          <div className="dealer-hero__actions">
            <a
              className="vd-button vd-button--primary dealer-hero__button"
              href={primaryHref}
              onClick={() => trackEvent("lead_form_started", { source: isSkupMode ? "skup_hero_cta" : "hero_primary_cta", dealer_id: tenant.id })}
            >
              <span>{primaryLabel}</span>
              <small>{primarySublabel}</small>
            </a>
            <a className="vd-button vd-button--outline-dark dealer-hero__button" href={secondaryHref}>
              <span>{secondaryLabel}</span>
              <small>{secondarySublabel}</small>
            </a>
          </div>

          <div className="dealer-hero__benefits">
            {benefits.map((benefit, index) => {
              const Icon = iconMap[(benefit.icon || "check") as keyof typeof iconMap] || ClipboardCheck;
              return (
                <div className="dealer-hero__benefit" key={`${benefit.label}-${index}`}>
                  <Icon size={16} strokeWidth={2} />
                  <span>{benefit.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
