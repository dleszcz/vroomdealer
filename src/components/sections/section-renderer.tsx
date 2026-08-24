import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { HeroSection } from "./hero-section";
import { ValuePropsSection } from "./value-props-section";
import { TrustSection } from "./trust-section";
import { ServicesSection } from "./services-section";
import { ProcessSection } from "./process-section";
import { VehiclesSection } from "./vehicles-section";
import { AboutSection } from "./about-section";
import { LeadFormSection } from "./lead-form-section";
import { FAQSection } from "./faq-section";
import { ContactSection } from "./contact-section";
import { ServiceAreasSection } from "./service-areas-section";
import { RecentlyBoughtCarsSection } from "./recently-bought-cars-section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getTenantUrl } from "@/lib/urls";
import { StickyMobileCta } from "../sticky-mobile-cta";

interface SectionRendererProps {
  tenant: DealerTenant;
  mode?: "all" | "skup-aut";
  isCustomDomain?: boolean;
}

export function SectionRenderer({ tenant, mode = "all", isCustomDomain }: SectionRendererProps) {
  const isSkupMode = mode === "skup-aut";
  const sections = tenant.pageConfig?.sections || [];
  let enabled = sections.filter((section) => section.enabled !== false);

  if (isSkupMode) {
    // For dedicated /skup-aut landing page:
    // Filter out: vehicles (cars for sale), about (O nas), faq (FAQ), and general hero
    enabled = enabled.filter(
      (section) =>
        section.type !== "vehicles" &&
        section.type !== "about" &&
        section.type !== "faq" &&
        section.type !== "hero"
    );

    // Ensure lead_form is rendered first
    const leadFormIndex = enabled.findIndex((s) => s.type === "lead_form");
    if (leadFormIndex > 0) {
      const [leadFormSec] = enabled.splice(leadFormIndex, 1);
      enabled.unshift(leadFormSec);
    }
  }

  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";
  const accentColor = tenant.branding?.colors?.accent || primaryColor;
  const headerBg = tenant.branding?.colors?.headerBg || "#080808";
  const footerBg = tenant.branding?.colors?.footerBg || "#080808";

  const hasServiceAreasSection = enabled.some((s) => s.type === "service_areas");
  const hasLocalPages = (tenant.localSeo?.localPages?.filter((lp) => lp.enabled && lp.indexable) || []).length > 0;

  return (
    <div
      className="landing-engine-sections"
      style={{
        ["--color-primary" as string]: primaryColor,
        ["--color-accent" as string]: accentColor,
        ["--color-brand" as string]: primaryColor,
        ["--color-header-bg" as string]: headerBg,
        ["--color-footer-bg" as string]: footerBg,
      }}
    >
      {/* Top Header for Skup Aut dedicated page */}
      {isSkupMode && (
        <section style={{ background: "linear-gradient(135deg, #0a0f1d 0%, #060810 100%)", padding: "24px 0 0" }}>
          <div className="vd-container">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: tenant.businessName, href: getTenantUrl(tenant.slug, "/", tenant.customDomain, isCustomDomain) },
                { label: "Skup aut za gotówkę" },
              ]}
            />
          </div>
        </section>
      )}

      {enabled.map((config: SectionConfig) => {
        switch (config.type) {
          case "hero":
            return <HeroSection key={config.id} tenant={tenant} config={config} isCustomDomain={isCustomDomain} />;
          case "trust":
            return <ValuePropsSection key={config.id} tenant={tenant} config={config} />;
          case "process":
            return <ProcessSection key={config.id} tenant={tenant} config={config} />;
          case "services":
            return <ServicesSection key={config.id} tenant={tenant} config={config} />;
          case "reviews":
            return <TrustSection key={config.id} tenant={tenant} config={config} />;
          case "vehicles":
            return <VehiclesSection key={config.id} tenant={tenant} config={config} isCustomDomain={isCustomDomain} />;
          case "about":
            return <AboutSection key={config.id} tenant={tenant} config={config} />;
          case "service_areas":
            return <ServiceAreasSection key={config.id} tenant={tenant} config={config} isCustomDomain={isCustomDomain} />;
          case "lead_form":
            return (
              <React.Fragment key={config.id}>
                <LeadFormSection tenant={tenant} config={config} />
                <RecentlyBoughtCarsSection tenant={tenant} />
                {!hasServiceAreasSection && hasLocalPages && <ServiceAreasSection tenant={tenant} isCustomDomain={isCustomDomain} />}
              </React.Fragment>
            );
          case "faq":
            return <FAQSection key={config.id} tenant={tenant} config={config} />;
          case "contact":
            return <ContactSection key={config.id} tenant={tenant} config={config} />;
          default:
            return null;
        }
      })}

      <StickyMobileCta tenant={tenant} isCustomDomain={isCustomDomain} />
    </div>
  );
}
