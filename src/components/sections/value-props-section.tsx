import React from "react";
import { BadgeCheck, Banknote, Clock3, FileCheck2, ShieldCheck, Truck } from "lucide-react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface Props { tenant: DealerTenant; config?: SectionConfig; }

const icons = [BadgeCheck, Clock3, Truck, FileCheck2, ShieldCheck];
const defaults = [
  ["Auta w każdym stanie", "Skupujemy pojazdy sprawne, uszkodzone, powypadkowe oraz bez OC/przeglądu."],
  ["Najlepsze ceny", "Płacimy uczciwie i od ręki w gotówce."],
  ["Szybka decyzja", "Wycena online/tel nawet w 15 minut."],
  ["Darmowa laweta", "Przyjedziemy własnym transportem w dogodne miejsce."],
  ["Minimum formalności", "Wszystkie formalności i umowa na miejscu."],
];

export function ValuePropsSection({ tenant, config }: Props) {
  const data = (config?.data || {}) as { items?: { title: string; text: string; icon?: number }[] };
  const items = data.items?.length ? data.items : defaults.map(([title, text], i) => ({ title, text, icon: i }));
  return (
    <section className="vd-section vd-section--bordered" id="value-props">

      <div className="vd-container value-props__layout">
        <div className="value-props__intro">
          <span className="vd-eyebrow">Dlaczego {tenant.businessName}?</span>
          <h2 className="vd-heading value-props__title">Skup i sprzedaż samochodów na jasnych zasadach</h2>
        </div>
        <div className="value-props__items">
          {items.slice(0, 5).map((item, i) => {
            const Icon = icons[item.icon ?? i] || Banknote;
            return <div className="value-prop" key={`${item.title}-${i}`}>
              <Icon className="value-prop__icon" strokeWidth={1.8} />
              <h3 className="value-prop__title">{item.title}</h3>
              <p className="value-prop__text">{item.text}</p>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}
