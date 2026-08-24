"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Nieprawidłowy email lub hasło"
          : authError.message
      );
      setLoading(false);
      return;
    }

    // Redirect to admin dashboard
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get("redirect") || "/admin/leads";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Logo / Branding */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>🚗</div>
          <h1 style={styles.title}>VroomDealer</h1>
          <p style={styles.subtitle}>Panel Administracyjny</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Adres e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan@komis.pl"
              required
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? (
              <span style={styles.spinner}>⟳</span>
            ) : (
              "Zaloguj się"
            )}
          </button>
        </form>

        <p style={styles.footer}>
          Nie masz konta?{" "}
          <a href="mailto:kontakt@vroomdealer.pl" style={styles.link}>
            Skontaktuj się z nami
          </a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    borderRadius: "20px",
    padding: "40px 32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  logoSection: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  logoIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  title: {
    color: "#10b981",
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
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
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  error: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: "13px",
    textAlign: "center" as const,
  },
  button: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    marginTop: "4px",
  },
  spinner: {
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "24px",
    fontSize: "13px",
    color: "#64748b",
  },
  link: {
    color: "#10b981",
    textDecoration: "none",
  },
};
