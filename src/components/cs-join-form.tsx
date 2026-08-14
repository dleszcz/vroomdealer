"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function CsJoinForm() {
  const [name, setName] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !dealerName) return;

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId: "vroomdealer_saas",
          source: "vroomdealer_saas_test_application",
          customerName: name || dealerName,
          customerPhone: phone,
          vehicleDetails: {
            dealerName,
            city,
            note: "Zgłoszenie do zamkniętych testów VroomDealer.pl",
          },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback UI
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "32px",
          borderRadius: "16px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          textAlign: "center",
          maxWidth: "540px",
          margin: "0 auto",
        }}
      >
        <CheckCircle2 size={48} style={{ color: "#10B981", margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Dziękujemy za zgłoszenie!
        </h3>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", lineHeight: 1.5, margin: 0 }}>
          Skontaktujemy się z Tobą telefonicznie w ciągu 24 godzin, aby omówić zasady dołączenia do zamkniętych testów VroomDealer.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "540px",
        margin: "0 auto",
        padding: "32px",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        textAlign: "left",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
          Nazwa Twojego Komisu / Siedziba *
        </label>
        <input
          type="text"
          required
          placeholder="np. Auto Komis Kowalski"
          value={dealerName}
          onChange={(e) => setDealerName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#fff",
            fontSize: "15px",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
            Imię i Nazwisko
          </label>
          <input
            type="text"
            placeholder="np. Jan Kowalski"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
            Miejscowość
          </label>
          <input
            type="text"
            placeholder="np. Poznań"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
          Numer telefonu kontaktowego *
        </label>
        <input
          type="tel"
          required
          placeholder="np. +48 600 100 200"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#fff",
            fontSize: "15px",
            outline: "none",
          }}
        />
      </div>


      <button
        type="submit"
        disabled={loading}
        className="cs__btn cs__btn--primary"
        style={{ width: "100%", justifyContent: "center", minHeight: "52px", fontSize: "16px" }}
      >
        {loading ? (
          "Wysyłanie..."
        ) : (
          <>
            <Send size={18} /> Dołącz do testów ➔
          </>
        )}
      </button>
    </form>
  );
}
