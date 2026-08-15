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


import { StickyMobileCta } from "../sticky-mobile-cta";

interface SectionRendererProps { tenant: DealerTenant; }

export function SectionRenderer({ tenant }: SectionRendererProps) {
  const sections = tenant.pageConfig?.sections || [];
  const enabled = sections.filter((section) => section.enabled !== false);

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
      {enabled.map((config: SectionConfig) => {
        switch (config.type) {
          case "hero":
            return <HeroSection key={config.id} tenant={tenant} config={config} />;
          case "trust":
            return <ValuePropsSection key={config.id} tenant={tenant} config={config} />;
          case "process":
            return <ProcessSection key={config.id} tenant={tenant} config={config} />;
          case "services":
            return <ServicesSection key={config.id} tenant={tenant} config={config} />;
          case "reviews":
            return <TrustSection key={config.id} tenant={tenant} config={config} />;
          case "vehicles":
            return <VehiclesSection key={config.id} tenant={tenant} config={config} />;
          case "about":
            return <AboutSection key={config.id} tenant={tenant} config={config} />;
          case "service_areas":
            return <ServiceAreasSection key={config.id} tenant={tenant} config={config} />;
          case "lead_form":
            return (
              <React.Fragment key={config.id}>
                {!hasServiceAreasSection && hasLocalPages && <ServiceAreasSection tenant={tenant} />}
                <LeadFormSection tenant={tenant} config={config} />
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

      <StickyMobileCta tenant={tenant} />
    </div>
  );
}

