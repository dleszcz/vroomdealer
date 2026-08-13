import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface Props { tenant: DealerTenant; config?: SectionConfig; }
const defaults = [
  ["Zostaw dane", "Wypełnij formularz lub zadzwoń."],
  ["Wycena", "Ocenimy auto i przedstawimy ofertę."],
  ["Umowa i płatność", "Podpiszemy umowę i wypłacimy pieniądze."],
  ["Odbiór auta", "Odbierzemy auto lub przyjedziesz do nas."],
];

export function ProcessSection({ config }: Props) {
  const data = (config?.data || {}) as { steps?: { title: string; text: string }[] };
  const steps = data.steps?.length ? data.steps : defaults.map(([title, text]) => ({ title, text }));
  return (
    <section id="process" className="vd-section vd-section--bordered">
      <div className="vd-container process__layout">
        <div>
          <span className="vd-eyebrow">Jak to działa?</span>
          <h2 className="vd-heading">Prosty 4-etapowy proces</h2>
        </div>
        <div className="process__steps">
          <div className="process__line" aria-hidden="true" />
          {steps.slice(0, 4).map((step, index) => (
            <div className="process__step" key={`${step.title}-${index}`}>
              <div className="process__number">{index + 1}</div>
              <h3 className="process__step-title">{step.title}</h3>
              <p className="process__step-text">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
