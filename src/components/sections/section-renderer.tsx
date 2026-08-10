import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { HeroSection } from "./hero-section";
import { LeadFormSection } from "./lead-form-section";
import { TrustSection } from "./trust-section";
import { ServicesSection } from "./services-section";
import { ProcessSection } from "./process-section";
import { VehiclesSection } from "./vehicles-section";
import { ReviewsSection } from "./reviews-section";
import { FAQSection } from "./faq-section";
import { ContactSection } from "./contact-section";

interface SectionRendererProps {
  tenant: DealerTenant;
}

export function SectionRenderer({ tenant }: SectionRendererProps) {
  const sections = tenant.pageConfig?.sections || [];
  const enabledSections = sections.filter((s) => s.enabled !== false);

  return (
    <div className="landing-engine-sections">
      {enabledSections.map((config: SectionConfig) => {
        switch (config.type) {
          case "hero":
            return <HeroSection key={config.id} tenant={tenant} config={config} />;
          case "lead_form":
            return <LeadFormSection key={config.id} tenant={tenant} config={config} />;
          case "trust":
            return <TrustSection key={config.id} tenant={tenant} config={config} />;
          case "services":
            return <ServicesSection key={config.id} tenant={tenant} config={config} />;
          case "process":
            return <ProcessSection key={config.id} tenant={tenant} config={config} />;
          case "vehicles":
            return <VehiclesSection key={config.id} tenant={tenant} config={config} />;
          case "reviews":
            return <ReviewsSection key={config.id} tenant={tenant} config={config} />;
          case "faq":
            return <FAQSection key={config.id} tenant={tenant} config={config} />;
          case "contact":
            return <ContactSection key={config.id} tenant={tenant} config={config} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
