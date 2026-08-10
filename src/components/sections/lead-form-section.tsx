"use client";

import React, { useState } from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface LeadFormSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function LeadFormSection({ tenant, config }: LeadFormSectionProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [makeModel, setMakeModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg("Podaj numer telefonu, abyśmy mogli się skontaktować.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId: tenant.id,
          source: "lead_form_section",
          landingPath: typeof window !== "undefined" ? window.location.pathname : "/",
          customerName: name || undefined,
          customerPhone: phone,
          vehicleDetails: {
            makeModel: makeModel || undefined,
            year: year ? parseInt(year, 10) : undefined,
            expectedPrice: price ? parseInt(price, 10) : undefined,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Wystąpił błąd podczas wysyłania formularza.");
      }

      setSuccess(true);
      trackEvent("lead_submitted", {
        dealerId: tenant.id,
        makeModel,
        year,
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Coś poszło nie tak. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="landing__section" id="lead-form" style={{ padding: "4rem 1.5rem", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "0.75rem" }}>
            {config?.title || "Darmowa, Szybka Wycena Twojego Auta"}
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.1rem" }}>
            {config?.subtitle || "Wypełnij formularz w 30 sekund. Otrzymaj darmową wycenę i propozycję zakupu za gotówkę."}
          </p>
        </div>

        {success ? (
          <div style={{ padding: "2.5rem", borderRadius: "16px", background: "rgba(37, 211, 102, 0.08)", border: "1px solid var(--color-accent)", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
              Dziękujemy za zgłoszenie!
            </h3>
            <p style={{ color: "var(--color-foreground)" }}>
              Nasz doradca skontaktuje się z Tobą telefonicznie w ciągu kilkunastu minut.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                  Marka i Model samochodu
                </label>
                <input
                  type="text"
                  placeholder="np. BMW 320d, Audi A4"
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                  Rocznik i Przebieg (opcjonalnie)
                </label>
                <input
                  type="text"
                  placeholder="np. 2018 r. / 150 tys. km"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                  Oczekiwana cena (PLN)
                </label>
                <input
                  type="number"
                  placeholder="np. 45000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                  Numer telefonu <span style={{ color: "var(--color-accent)" }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+48 600 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                  Imię (opcjonalnie)
                </label>
                <input
                  type="text"
                  placeholder="np. Jan Kowalski"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: "8px", background: "var(--color-background)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
                />
              </div>
            </div>

            {errorMsg && (
              <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "8px",
                background: "var(--color-primary)",
                color: "var(--color-primary-fg)",
                fontWeight: 700,
                fontSize: "1.1rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Wysyłanie zgłoszenia..." : "Poproś o darmową wycenę ➔"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
