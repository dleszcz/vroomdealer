"use client";

import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { MultiStepLeadForm } from "./multi-step-lead-form";

interface LeadFormSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function LeadFormSection({ tenant, config }: LeadFormSectionProps) {
  const title = config?.title || "Bezpłatna wycena samochodu";
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";

  return (
    <section id="lead-form" style={{ width: "100%", padding: "5rem 0", background: "#0a0f1d" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem" }}>
          <span
            style={{
              display: "inline-block",
              color: primaryColor,
              fontSize: "0.85rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            SZYBKA WYCENA SKUPU
          </span>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "1rem",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--color-text-soft, rgba(255,255,255,0.7))",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Wypełnij krótki formularz wyceny w 6 krokach. Przyjedziemy po Twoje auto i zapłacimy gotówką od ręki!
          </p>
        </div>

        <MultiStepLeadForm tenant={tenant} />
      </div>
    </section>
  );
}

