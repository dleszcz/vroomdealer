import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface Props { tenant: DealerTenant; config?: SectionConfig; }

export function TrustSection({ tenant, config }: Props) {
  const data = (config?.data || {}) as {
    heading?: string;
    stats?: { value: string; label: string }[];
    quote?: string;
    author?: string;
  };
  const stats = data.stats || [
    { value: "100%", label: "uczciwych transakcji" },
    { value: "0 zł", label: "ukrytych kosztów" },
    { value: "7 dni", label: "w tygodniu do Twojej dyspozycji" },
  ];

  return (
    <section className="vd-section vd-section--bordered" id="trust">
      <div className="vd-container trust__layout">
        <div>
          <span className="vd-eyebrow">Dlaczego warto nam zaufać?</span>
          <h2 className="vd-heading">{data.heading || "Doświadczenie. Uczciwość. Zadowoleni klienci."}</h2>
          <div className="trust__stats">
            {stats.slice(0, 3).map((stat, i) => <div key={`${stat.value}-${i}`}>
              <span className="trust__stat-value">{stat.value}</span>
              <span className="trust__stat-label">{stat.label}</span>
            </div>)}
          </div>
        </div>
        <div className="testimonial">
          <span className="testimonial__quote">“</span>
          <p className="testimonial__text">{data.quote || "Szybka wycena, uczciwa oferta i wszystko gotowe od ręki. Polecam każdemu, kto chce sprzedać auto bez zbędnych formalności."}</p>
          <div className="testimonial__author">{data.author || "Klient komisu"}</div>
          <div className="testimonial__dots" aria-hidden="true">
            <span className="testimonial__dot testimonial__dot--active" /><span className="testimonial__dot" /><span className="testimonial__dot" /><span className="testimonial__dot" />
          </div>
        </div>
      </div>
    </section>
  );
}
