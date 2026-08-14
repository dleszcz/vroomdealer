"use client";

import React, { useState } from "react";
import { DealerTenant, SectionConfig } from "@/types/landing";
import { trackEvent } from "@/lib/analytics";

interface LeadFormSectionProps {
  tenant: DealerTenant;
  config?: SectionConfig;
}

export function LeadFormSection({ tenant, config }: LeadFormSectionProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [carDetails, setCarDetails] = useState("");
  const [description, setDescription] = useState("");
  const [rodoAccepted, setRodoAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const title = config?.title || "Szybka wycena auta";
  const contactPhone = tenant.contact.phone || "";
  const address = [tenant.location?.address, tenant.location?.city].filter(Boolean).join(", ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !rodoAccepted) {
      setErrorMsg("Proszę wypełnić pola wymagane (*) i zaakceptować zgodę RODO.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealer_id: tenant.id,
          full_name: fullName,
          phone,
          email: email || undefined,
          car_details: carDetails || undefined,
          description: description || undefined,
          rodo_accepted: rodoAccepted,
        }),
      });

      if (!res.ok) {
        throw new Error("Błąd podczas wysyłania formularza");
      }

      setSubmitted(true);
      trackEvent("lead_submitted", { dealer_id: tenant.id });
    } catch (err: any) {
      setErrorMsg(err.message || "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="lead-form" style={{ width: "100%", background: "#ffffff", padding: "5rem 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "4rem",
            alignItems: "start",
          }}
        >
          {/* Left Column — Info */}
          <div>
            <span
              style={{
                display: "inline-block",
                color: "var(--color-primary, #1686E0)",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
              }}
            >
              FORMULARZ LEADOWY
            </span>

            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                color: "#090B0B",
                marginBottom: "1.25rem",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>

            <p
              style={{
                fontSize: "1.05rem",
                color: "#64748b",
                lineHeight: 1.6,
                marginBottom: "2.5rem",
              }}
            >
              Wypełnij poniższy formularz w 30 sekund. Nasz rzeczoznawca skontaktuje się z Tobą telefonicznie i przedstawi darmową wycenę.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#090B0B",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  📞
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 700 }}>
                    TELEFON DO WYCENY
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#090B0B" }}>
                    {contactPhone}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#090B0B",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  📍
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 700 }}>
                    LOKALIZACJA PLACU
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#090B0B" }}>
                    {address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Form Card */}
          <div
            style={{
              background: "#F1F3F5",
              borderRadius: "18px",
              padding: "2.5rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              border: "1px solid #E2E8F0",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#090B0B", marginBottom: "0.5rem" }}>
                  Dziękujemy za zgłoszenie!
                </h3>
                <p style={{ color: "#64748b" }}>
                  Nasz rzeczoznawca przeanalizuje podane informacje i skontaktuje się z Tobą telefonicznie w najkrótszym możliwym czasie.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {errorMsg && (
                  <div style={{ padding: "0.75rem", borderRadius: "8px", background: "#fee2e2", color: "#991b1b", fontSize: "0.875rem", fontWeight: 600 }}>
                    {errorMsg}
                  </div>
                )}

                {/* Field 1: Imię i nazwisko */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#090B0B", marginBottom: "0.35rem" }}>
                    Imię i nazwisko <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="np. Jan Kowalski"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      background: "#ffffff",
                      fontSize: "0.95rem",
                      color: "#090B0B",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Row: Telefon & Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#090B0B", marginBottom: "0.35rem" }}>
                      Telefon <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+48 600 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        background: "#ffffff",
                        fontSize: "0.95rem",
                        color: "#090B0B",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#090B0B", marginBottom: "0.35rem" }}>
                      E-mail
                    </label>
                    <input
                      type="email"
                      placeholder="jan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        background: "#ffffff",
                        fontSize: "0.95rem",
                        color: "#090B0B",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Field: Marka/Model */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#090B0B", marginBottom: "0.35rem" }}>
                    Rodzaj / Marka i Model auta
                  </label>
                  <input
                    type="text"
                    placeholder="np. BMW 320d (2018 r.)"
                    value={carDetails}
                    onChange={(e) => setCarDetails(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      background: "#ffffff",
                      fontSize: "0.95rem",
                      color: "#090B0B",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Field: Opis */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#090B0B", marginBottom: "0.35rem" }}>
                    Krótki opis auta (opcjonalnie)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Stan auta, przebieg, ewentualne uszkodzenia..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #CBD5E1",
                      background: "#ffffff",
                      fontSize: "0.95rem",
                      color: "#090B0B",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Checkbox RODO */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                  <input
                    type="checkbox"
                    id="rodo"
                    checked={rodoAccepted}
                    onChange={(e) => setRodoAccepted(e.target.checked)}
                    required
                    style={{ marginTop: "0.2rem", width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label htmlFor="rodo" style={{ fontSize: "0.775rem", color: "#64748b", lineHeight: 1.4, cursor: "pointer" }}>
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu ws. wyceny samochodu (RODO). <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "10px",
                    background: "var(--color-primary, #1686E0)",
                    color: "#ffffff",
                    fontSize: "1rem",
                    fontWeight: 800,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(22, 134, 224, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{loading ? "Wysyłanie..." : "WYŚLIJ ZAPYTANIE"}</span>
                  {!loading && <span>→</span>}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
