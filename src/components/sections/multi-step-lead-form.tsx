"use client";

import React, { useState } from "react";
import { DealerTenant } from "@/types/landing";
import { ArrowRight, ArrowLeft, CheckCircle2, Upload, Car, Phone, ShieldCheck } from "lucide-react";

interface MultiStepLeadFormProps {
  tenant: DealerTenant;
  localCity?: string;
}

export function MultiStepLeadForm({ tenant, localCity }: MultiStepLeadFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Vehicle basic
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  // Step 2: Year & Mileage
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  // Step 3: Fuel & Transmission & Condition
  const [fuelType, setFuelType] = useState("benzyna");
  const [transmission, setTransmission] = useState("manualna");
  const [condition, setCondition] = useState("sprawny");

  // Step 4: Expected Price
  const [expectedPrice, setExpectedPrice] = useState("");

  // Step 5: Photos (base64 preview thumbnails)
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Step 6: Contact Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(localCity || tenant.location?.city || "");

  const totalSteps = 6;
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 6);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPreviews((prev) => [...prev, reader.result as string].slice(0, 6));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const canNext = () => {
    if (step === 1) return brand.trim().length > 0;
    if (step === 2) return year.trim().length > 0;
    if (step === 3) return true;
    if (step === 4) return true;
    if (step === 5) return true;
    if (step === 6) return phone.trim().length >= 7;
    return true;
  };

  const nextStep = () => {
    if (!canNext()) {
      if (step === 1) setErrorMsg("Wpisz markę i model samochodu.");
      else if (step === 2) setErrorMsg("Wpisz rok produkcji.");
      else if (step === 6) setErrorMsg("Wpisz numer telefonu kontaktowego.");
      return;
    }
    setErrorMsg("");
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg("Podaj numer telefonu kontaktowego.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId: tenant.slug,
          source: localCity ? "local_seo_multi_step_form" : "multi_step_lead_form",
          landingPath: window.location.pathname,
          customerName: name || "Klient skupu",
          customerPhone: phone,
          customerEmail: email || null,
          localSeoCity: localCity,
          photos: photoPreviews,
          vehicleDetails: {
            brand,
            model,
            year,
            mileage,
            fuelType,
            transmission,
            condition,
            expectedPrice,
            city,
            note: `Zgłoszenie z formularza skupu (${tenant.businessName})`,
          },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Wystąpił błąd podczas wysyłania. Spróbuj ponownie.");
      }
    } catch {
      // Fallback display
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        id="lead-form"
        style={{
          padding: "40px 24px",
          borderRadius: "20px",
          background: "rgba(22, 134, 224, 0.08)",
          border: "1px solid rgba(22, 134, 224, 0.3)",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <CheckCircle2 size={56} style={{ color: primaryColor, margin: "0 auto 20px" }} />
        <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
          Dziękujemy za zgłoszenie!
        </h3>
        <p style={{ color: "var(--color-text-soft)", fontSize: "16px", lineHeight: 1.6, margin: "0 0 24px" }}>
          Otrzymaliśmy dane Twojego samochodu <strong>{brand} {model}</strong>. Przedstawiciel {tenant.businessName} skontaktuje się z Tobą pod numerem <strong>{phone}</strong> w celu bezpłatnej wyceny.
        </p>
        <a
          href={`tel:${(tenant.contact.phone || "+48530826501").replace(/\s+/g, "")}`}
          className="vd-button vd-button--primary"
          style={{ display: "inline-flex", minHeight: "52px", fontSize: "16px" }}
        >
          <Phone size={18} /> Zadzwoń do wyceniającego
        </a>
      </div>
    );
  }

  return (
    <div
      id="lead-form"
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "32px 24px",
        borderRadius: "24px",
        background: "rgba(10, 15, 29, 0.88)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Progress Bar & Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 800, color: primaryColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Krok {step} z {totalSteps}
          </span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
            {Math.round((step / totalSteps) * 100)}% ukończono
          </span>
        </div>
        <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.12)", borderRadius: "999px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(step / totalSteps) * 100}%`,
              background: primaryColor,
              borderRadius: "999px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#fca5a5",
            fontSize: "14px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        {/* STEP 1: Brand & Model */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
              Jaki samochód chcesz sprzedać?
            </h3>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>
              Podaj markę i model pojazdu.
            </p>
            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  Marka pojazdu <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Volkswagen, Audi, BMW, Ford"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    padding: "0 18px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    color: "#ffffff",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  Model pojazdu
                </label>
                <input
                  type="text"
                  placeholder="np. Passat B7, A4 B8, Golf VII"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    padding: "0 18px",
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    color: "#ffffff",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Year & Mileage */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Rok i przebieg samochodu
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-soft)", marginBottom: "20px" }}>
              Wskazanie wieku i przebiegu pomaga w szybszej wycenie.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                  Rok produkcji *
                </label>
                <input
                  type="number"
                  required
                  placeholder="np. 2014"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                  Przebieg (km)
                </label>
                <input
                  type="number"
                  placeholder="np. 185000"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Fuel, Transmission, Condition */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Napęd i stan techniczny
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-soft)", marginBottom: "20px" }}>
              Skupujemy auta sprawne, powypadkowe oraz bez OC/przeglądu.
            </p>

            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                  Rodzaj paliwa
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "16px",
                    outline: "none",
                  }}
                >
                  <option value="benzyna">Benzyna</option>
                  <option value="diesel">Diesel</option>
                  <option value="lpg">Benzyna + LPG</option>
                  <option value="hybryda">Hybryda</option>
                  <option value="elektryczny">Elektryczny</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                    Skrzynia biegów
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "52px",
                      padding: "0 16px",
                      borderRadius: "12px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  >
                    <option value="manualna">Manualna</option>
                    <option value="automatyczna">Automatyczna</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                    Stan pojazdu
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "52px",
                      padding: "0 16px",
                      borderRadius: "12px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  >
                    <option value="sprawny">Sprawny / Używany</option>
                    <option value="uszkodzony">Uszkodzony mechanicznie</option>
                    <option value="powypadkowy">Powypadkowy</option>
                    <option value="bez_oc_przegladu">Bez OC / Przeglądu</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Expected Price */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Oczekiwana kwota (opcjonalnie)
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-soft)", marginBottom: "20px" }}>
              Podaj kwotę, jaką chciałbyś otrzymać za swój samochód.
            </p>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                Sugerowana cena (PLN)
              </label>
              <input
                type="number"
                placeholder="np. 15000"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "52px",
                  padding: "0 16px",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Photos Upload */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Zdjęcia samochodu (opcjonalnie)
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-soft)", marginBottom: "20px" }}>
              Dodaj 1–6 zdjęć z telefonu, aby otrzymać precyzyjną wycenę.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "24px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "2px dashed rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <Upload size={28} style={{ color: primaryColor }} />
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                  Dodaj zdjęcia z telefonu
                </span>
                <span style={{ fontSize: "13px", color: "var(--color-text-soft)" }}>
                  Wybierz zdjęcia z galerii lub zrób zdjęcie aparatem
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {photoPreviews.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {photoPreviews.map((src, idx) => (
                  <div key={idx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "4/3" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Podgląd ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Contact Info & Final Submit */}
        {step === 6 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Gdzie wysłać wycenę?
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-soft)", marginBottom: "20px" }}>
              Podaj numer telefonu, aby nasz wyceniający mógł się z Tobą skontaktować.
            </p>

            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                  Numer telefonu kontaktowego *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="np. +48 530 826 501"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                    Imię i Nazwisko
                  </label>
                  <input
                    type="text"
                    placeholder="np. Jan Kowalski"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "52px",
                      padding: "0 16px",
                      borderRadius: "12px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                    Miejscowość
                  </label>
                  <input
                    type="text"
                    placeholder="np. Topólka / Radziejów"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "52px",
                      padding: "0 16px",
                      borderRadius: "12px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
                  Adres e-mail (opcjonalnie)
                </label>
                <input
                  type="email"
                  placeholder="np. jan.kowalski@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "8px" }}>
                <input
                  type="checkbox"
                  id="rodoConsent"
                  required
                  defaultChecked
                  style={{ marginTop: "3px", width: "16px", height: "16px", accentColor: primaryColor, cursor: "pointer" }}
                />
                <label htmlFor="rodoConsent" style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, cursor: "pointer" }}>
                  Wyrażam zgodę na kontakt telefoniczny w celu bezpłatnej wyceny oraz akceptuję{" "}
                  <a href={`/${tenant.slug}/polityka-prywatnosci`} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor, textDecoration: "underline" }}>
                    Politykę Prywatności
                  </a>{" "}
                  i{" "}
                  <a href={`/${tenant.slug}/regulamin`} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor, textDecoration: "underline" }}>
                    Regulamin
                  </a>.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px", gap: "12px" }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 20px",
                minHeight: "52px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={18} /> Wstecz
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "0 28px",
                minHeight: "52px",
                borderRadius: "12px",
                background: primaryColor,
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: `0 4px 14px ${primaryColor}55`,
              }}
            >
              Dalej <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "0 28px",
                minHeight: "52px",
                borderRadius: "12px",
                background: primaryColor,
                color: "#fff",
                fontSize: "16px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                boxShadow: `0 6px 20px ${primaryColor}66`,
                width: step === totalSteps ? "100%" : "auto",
              }}
            >
              {loading ? "Wysyłanie zgłoszenia..." : "Wyślij zgłoszenie do wyceny ➔"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
