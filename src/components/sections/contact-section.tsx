"use client";

import React from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface ContactSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function ContactSection({ tenant, config }: ContactSectionProps) {
  const phone = tenant.contact.phone;
  const telUrl = phone ? `tel:${phone.replace(/\s/g, "")}` : "#";
  const whatsappNumber = tenant.contact.whatsapp;
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Dzień dobry! Piszę ze strony ${tenant.businessName} w sprawie wyceny lub zakupu auta.`
      )}`
    : null;

  return (
    <section id="contact" style={{ padding: "4rem 1.5rem", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
            {config?.title || `Skontaktuj się z ${tenant.businessName}`}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
            Jesteśmy do Twojej dyspozycji 7 dni w tygodniu. Zadzwoń lub napisz.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {/* Phone box */}
          <div style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📞</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
              Telefon Bezpośredni
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Szybka rozmowa z doradcą i natychmiastowa darmowa wycena.
            </p>
            {phone && (
              <a
                href={telUrl}
                onClick={() => trackEvent("phone_clicked", { source: "contact_section" })}
                style={{
                  display: "inline-block",
                  padding: "0.85rem 1.5rem",
                  borderRadius: "8px",
                  background: "var(--color-primary)",
                  color: "var(--color-primary-fg)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                }}
              >
                {phone}
              </a>
            )}
          </div>

          {/* WhatsApp box */}
          <div style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
              Wiadomość WhatsApp
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
              Wyślij zdjęcia samochodu i opis do wyceny w kilkadziesiąt sekund.
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_clicked", { source: "contact_section" })}
                style={{
                  display: "inline-block",
                  padding: "0.85rem 1.5rem",
                  borderRadius: "8px",
                  background: "#25d366",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                }}
              >
                Napisz na WhatsApp
              </a>
            )}
          </div>

          {/* Location box */}
          <div style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📍</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.5rem" }}>
              Adres i Siedziba
            </h3>
            <p style={{ color: "var(--color-foreground)", fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>
              {tenant.businessName}
            </p>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
              {tenant.location?.address ? `${tenant.location.address}, ` : ""}
              {tenant.location?.city || "Warszawa"}
            </p>
            <p style={{ color: "var(--color-primary)", fontSize: "0.85rem", marginTop: "1rem", fontWeight: 600 }}>
              Dojazd lawetą do klienta 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
