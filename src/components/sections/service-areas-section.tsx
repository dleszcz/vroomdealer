"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { getTenantUrl } from "@/lib/urls";

interface Props {
  tenant: DealerTenant;
  config?: SectionConfig;
  isCustomDomain?: boolean;
}

export function ServiceAreasSection({ tenant, config, isCustomDomain }: Props) {
  const primaryCity = tenant.localSeo?.primaryLocation?.city || tenant.location?.city || "";
  const locality = tenant.localSeo?.primaryLocation?.locality;
  const county = tenant.localSeo?.primaryLocation?.county || tenant.location?.county;

  const title =
    config?.title ||
    (primaryCity ? `Skup aut w ${primaryCity} i okolicach` : "Obsługiwane okolice i obszar działania");
  const subtitle =
    config?.subtitle ||
    `${tenant.businessName} działa w ${locality ? `${locality}, ` : ""}${primaryCity}${
      county ? ` (powiat ${county})` : ""
    } i oferuje darmowy dojazd oraz skup samochodów za gotówkę w okolicznych miejscowościach.`;

  // Get active, indexable local pages that allow local area links
  const activeLocalPages =
    tenant.localSeo?.localPages?.filter(
      (lp) => lp.enabled && lp.indexable && lp.showInLocalAreaLinks !== false
    ) || [];

  if (activeLocalPages.length === 0) {
    return null;
  }

  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";

  return (
    <section id="service-areas" className="vd-section vd-section--bordered vd-section--soft">
      <div className="vd-container">
        <div style={{ maxWidth: "720px", margin: "0 auto 36px", textAlign: "center" }}>
          <span className="vd-eyebrow" style={{ color: primaryColor }}>
            Lokalny obszar obsługi
          </span>
          <h2 className="vd-heading" style={{ marginBottom: "12px" }}>
            {title}
          </h2>
          <p className="vd-copy" style={{ color: "var(--color-text-soft)", fontSize: "16px", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {activeLocalPages.map((lp) => (
            <Link
              key={lp.slug}
              href={getTenantUrl(tenant.slug, `/${lp.slug}`, tenant.customDomain, isCustomDomain)}
              style={{

                padding: "20px",
                borderRadius: "12px",
                background: "#fff",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textDecoration: "none",
                color: "var(--color-foreground)",
                fontWeight: 700,
                fontSize: "15px",
                transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              className="vd-service-area-card"
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(22, 134, 224, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: primaryColor,
                  flexShrink: 0,
                }}
              >
                <MapPin size={20} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-foreground)" }}>
                  Skup aut {lp.city}
                </span>
                <span style={{ fontSize: "14px", color: primaryColor, fontWeight: 800 }}>
                  ➔
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
