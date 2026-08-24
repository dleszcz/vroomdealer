"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/admin/actions";
import { useSearchParams } from "next/navigation";

interface SettingsFormProps {
  profile: {
    notification_email: string | null;
    google_sheets_webhook_url: string | null;
    contact_phone: string | null;
    whatsapp_number: string | null;
    pixel_id: string | null;
    analytics: Record<string, string> | null;
  };
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const justSaved = searchParams.get("saved") === "true";

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateProfile(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Wystąpił błąd");
      }
    });
  }

  return (
    <form action={handleSubmit} style={styles.form}>
      {justSaved && (
        <div style={styles.successBanner}>
          ✅ Ustawienia zostały zapisane pomyślnie!
        </div>
      )}

      {error && <div style={styles.errorBanner}>❌ {error}</div>}

      {/* Section: Powiadomienia */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📧 Powiadomienia e-mail</h3>
        <p style={styles.sectionDesc}>
          Na ten adres e-mail będą wysyłane powiadomienia o nowych zgłoszeniach wycen.
        </p>

        <div style={styles.field}>
          <label htmlFor="notification_email" style={styles.label}>
            E-mail do powiadomień
          </label>
          <input
            id="notification_email"
            name="notification_email"
            type="email"
            defaultValue={profile.notification_email || ""}
            placeholder="komis@twojadomena.pl"
            style={styles.input}
          />
        </div>
      </div>

      {/* Section: Integracje */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔗 Integracje</h3>
        <p style={styles.sectionDesc}>
          Podłącz zewnętrzne narzędzia do automatycznego eksportu danych.
        </p>

        <div style={styles.field}>
          <label htmlFor="google_sheets_webhook_url" style={styles.label}>
            Google Sheets Webhook URL
          </label>
          <input
            id="google_sheets_webhook_url"
            name="google_sheets_webhook_url"
            type="url"
            defaultValue={profile.google_sheets_webhook_url || ""}
            placeholder="https://script.google.com/macros/s/..."
            style={styles.input}
          />
          <p style={styles.hint}>
            URL Webhooka z Google Apps Script, który odbiera dane z formularzy i zapisuje je w arkuszu.
          </p>
        </div>
      </div>

      {/* Section: Analityka */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Analityka</h3>

        <div style={styles.fieldsRow}>
          <div style={styles.field}>
            <label htmlFor="pixel_id" style={styles.label}>
              Meta Pixel ID
            </label>
            <input
              id="pixel_id"
              name="pixel_id"
              type="text"
              defaultValue={profile.pixel_id || profile.analytics?.pixelId || ""}
              placeholder="123456789012345"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="google_analytics_id" style={styles.label}>
              Google Analytics ID (GA4)
            </label>
            <input
              id="google_analytics_id"
              name="google_analytics_id"
              type="text"
              defaultValue={profile.analytics?.googleAnalyticsId || ""}
              placeholder="G-XXXXXXXXXX"
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Section: Kontakt */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📞 Dane kontaktowe</h3>

        <div style={styles.fieldsRow}>
          <div style={styles.field}>
            <label htmlFor="contact_phone" style={styles.label}>
              Telefon kontaktowy
            </label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              defaultValue={profile.contact_phone || ""}
              placeholder="+48 123 456 789"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="whatsapp_number" style={styles.label}>
              WhatsApp
            </label>
            <input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              defaultValue={profile.whatsapp_number || ""}
              placeholder="+48 123 456 789"
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div style={styles.submitRow}>
        <button type="submit" disabled={isPending} style={styles.submitBtn}>
          {isPending ? "⟳ Zapisuję..." : "💾 Zapisz ustawienia"}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  successBanner: {
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "500",
  },
  errorBanner: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: "14px",
  },
  section: {
    background: "rgba(30, 41, 59, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "14px",
    padding: "24px",
  },
  sectionTitle: {
    color: "#f1f5f9",
    fontSize: "17px",
    fontWeight: "700",
    margin: "0 0 4px",
  },
  sectionDesc: {
    color: "#64748b",
    fontSize: "13px",
    margin: "0 0 20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  fieldsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  label: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: "500",
  },
  input: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  hint: {
    color: "#475569",
    fontSize: "12px",
    margin: "2px 0 0",
  },
  submitRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
};
