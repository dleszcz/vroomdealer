import React from "react";
import { Check } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface Props { tenant: DealerTenant; config?: SectionConfig; }

export function AboutSection({ tenant, config }: Props) {
  const title = config?.title || "O nas";
  const validationMode = /lokalny komis|partner walidacyjny|vroomdealer/i.test(title) || tenant.slug === "d-car";
  if (!validationMode) {
    return (
      <section id="about" className="vd-section vd-section--bordered">
        <div className="vd-container">
          <span className="vd-eyebrow">O nas</span>
          <h2 className="vd-heading">{tenant.businessName}</h2>
          <p className="vd-copy" style={{ maxWidth: 680, marginTop: 16 }}>{tenant.businessDescription || "Lokalny komis samochodowy."}</p>
        </div>
      </section>
    );
  }

  const image = (config?.data?.imageUrl as string) || "/images/dcar-validation.png";
  return (
    <section id="about" className="vd-section validation">
      <div className="vd-container validation__layout">
        <div className="validation__image"><img src={image} alt={`${tenant.businessName} - partner walidacyjny VroomDealer`} /></div>
        <div className="validation__content">
          <div>
            <span className="vd-eyebrow">Pierwszy partner walidacyjny VroomDealera</span>
            <h2 className="vd-heading validation__title">D-CAR – lokalny komis, realne wyniki</h2>
            <p className="vd-copy validation__text">D-CAR to pierwszy komis, z którym rozwijamy VroomDealera. Razem testujemy i udoskonalamy system, który naprawdę działa.</p>
            <a className="vd-button vd-button--primary" href="#hero">Zobacz naszą stronę</a>
          </div>
          <div className="validation__list">
            {["Własna strona komisu", "Pozyskiwanie wartościowych aut", "Pełne wsparcie i technologia VroomDealer"].map(item => <div className="validation__item" key={item}><span className="validation__check"><Check size={10} strokeWidth={3} /></span>{item}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
