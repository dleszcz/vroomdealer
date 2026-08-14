"use client";

import React, { useState } from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";

interface FAQSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function FAQSection({ tenant, config }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Jakie dokumenty są potrzebne do sprzedaży auta?",
      a: "Wystarczy dowód rejestracyjny pojazdu, karta pojazdu (jeśli była wydana), dowód osobisty właściciela oraz ważne ubezpieczenie OC. Jeśli auto ma współwłaściciela, potrzebna jest jego obecność lub upoważnienie.",
    },
    ...(tenant.businessRules?.tradeIn?.enabled
      ? [
          {
            q: "Czy mogę zostawić obecne auto w rozliczeniu?",
            a:
              tenant.businessRules.tradeIn.description ||
              "Tak! Umożliwiamy pozostawienie swojego dotychczasowego samochodu w rozliczeniu przy zakupie auta z naszej oferty. Zapewniamy szybką wycenę i sprawne rozliczenie.",
          },
        ]
      : []),
    ...(tenant.businessRules?.purchasePriceLimit?.enabled
      ? [
          {
            q: `Czy skupujecie auta do ${tenant.businessRules.purchasePriceLimit.maxAmount.toLocaleString("pl-PL")} zł?`,
            a:
              tenant.businessRules.purchasePriceLimit.description ||
              `Tak! Skupujemy auta w tym przedziale cenowym (do ${tenant.businessRules.purchasePriceLimit.maxAmount.toLocaleString("pl-PL")} PLN). Skontaktuj się z nami po bezpłatną wycenę.`,
          },
        ]
      : []),
    {
      q: "Jak szybko otrzymam pieniądze za samochód?",
      a: "Pieniądze wypłacamy natychmiast przy podpisaniu umowy — gotówką do ręki lub szybkim przelewem ekspresowym, który pojawia się na Twoim koncie w kilka minut.",
    },
    {
      q: "Czy skupujecie auta niesprawne, uszkodzone lub bez OC?",
      a: "Tak! Odkupujemy samochody w każdym stanie technicznym, w tym uszkodzone, powypadkowe, bez ważnego przeglądu lub OC. Odbieramy je własną lawetą bez dodatkowych opłat.",
    },
    {
      q: "Czy wycena samochodu jest wiążąca i płatna?",
      a: "Nie, nasza wycena jest w 100% darmowa i niezobowiązująca. Jeśli nasza oferta nie będzie Ci odpowiadać, nie ponosisz żadnych kosztów.",
    },
    {
      q: "Gdzie odbywają się oględziny samochodu?",
      a: `Przystosowujemy się do Ciebie! Możesz przyjechać na nasz plac${tenant.location?.address || tenant.location?.city ? ` (${[tenant.location?.address, tenant.location?.city].filter(Boolean).join(", ")})` : ""} lub my przyjedziemy bezpłatnie pod Twój dom.`,
    },
  ];


  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" style={{ padding: "4rem 1.5rem", background: "var(--color-background)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
            {config?.title || "Najczęściej Zadawane Pytania (FAQ)"}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
            Odpowiedzi na najczęstsze pytania dotyczące skupu i sprzedaży aut.
          </p>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    color: "var(--color-foreground)",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ color: "var(--color-primary)", fontSize: "1.25rem", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 1.5rem 1.25rem 1.5rem", color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "1rem" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
