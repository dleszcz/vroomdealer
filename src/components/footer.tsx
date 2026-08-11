import React from "react";
import Link from "next/link";
import { DealerTenant } from "@/types/landing";

interface FooterProps {
  tenant?: DealerTenant | null;
}

export function Footer({ tenant }: FooterProps) {
  const name = tenant?.businessName || "D-CAR Dawid Woźniak";
  const phone = tenant?.contact?.phone || "+48 123 456 789";
  const email = tenant?.contact?.email || "biuro@d-car.pl";
  const city = tenant?.location?.city || "Miasto";
  const address = tenant?.location?.address || "ul. Przykładowa 123, 00-000";

  const footerBg = tenant?.branding?.colors?.footerBg || "#090B0B";

  return (
    <footer
      className="footer"
      id="footer"
      style={{
        width: "100%",
        background: footerBg,
        color: "#ffffff",
        padding: "4rem 0 2rem",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* 5 Columns Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Col 1: Brand & Logo */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ marginBottom: "0.85rem" }}>
              {tenant?.logoUrl || tenant?.branding?.logoUrl ? (
                <img
                  src={tenant.logoUrl || tenant.branding?.logoUrl || "/images/dcar-logo.svg"}
                  alt={name}
                  style={{ height: "48px", maxWidth: "180px", objectFit: "contain" }}
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "var(--color-primary, #1686E0)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "1.1rem",
                    }}
                  >
                    D
                  </div>
                  <div>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#ffffff", display: "block", lineHeight: 1 }}>
                      D-CAR
                    </span>
                    <span style={{ fontSize: "0.6rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Dawid Woźniak
                    </span>
                  </div>
                </div>
              )}
            </div>

            <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              Skup i sprzedaż samochodów. Szybko, uczciwie, bezpiecznie.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {["FB", "IG", "TT", "YT"].map((soc, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  {soc}
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: SZYBKIE LINKI */}
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Szybkie linki
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <li><a href="#hero" style={{ color: "#94a3b8", textDecoration: "none" }}>Strona główna</a></li>
              <li><a href="#lead-form" style={{ color: "#94a3b8", textDecoration: "none" }}>Skup aut</a></li>
              <li><a href="#vehicles" style={{ color: "#94a3b8", textDecoration: "none" }}>Samochody</a></li>
              <li><a href="#services" style={{ color: "#94a3b8", textDecoration: "none" }}>Usługi</a></li>
              <li><a href="#about" style={{ color: "#94a3b8", textDecoration: "none" }}>O nas</a></li>
              <li><a href="#contact" style={{ color: "#94a3b8", textDecoration: "none" }}>Kontakt</a></li>
            </ul>
          </div>

          {/* Col 3: USŁUGI */}
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Usługi
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <li><a href="#lead-form" style={{ color: "#94a3b8", textDecoration: "none" }}>Skup aut</a></li>
              <li><a href="#vehicles" style={{ color: "#94a3b8", textDecoration: "none" }}>Sprzedaż aut</a></li>
              <li><a href="#services" style={{ color: "#94a3b8", textDecoration: "none" }}>Pomoc drogowa</a></li>
              <li><a href="#services" style={{ color: "#94a3b8", textDecoration: "none" }}>Transport aut</a></li>
              <li><a href="#services" style={{ color: "#94a3b8", textDecoration: "none" }}>Inne usługi</a></li>
            </ul>
          </div>

          {/* Col 4: KONTAKT */}
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Kontakt
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "#94a3b8" }}>
              <span>📞 {phone}</span>
              <span>✉️ {email}</span>
              <span>📍 {address} {city}</span>
              <span style={{ marginTop: "0.25rem", color: "#cbd5e1" }}>⏰ Pn - Pt: 8:00 - 18:00</span>
              <span style={{ color: "#cbd5e1" }}>Sob: 9:00 - 14:00</span>
            </div>
          </div>

          {/* Col 5: OBSERWUJ NAS */}
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Obserwuj nas
            </h4>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["FB", "IG", "TT"].map((soc, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {soc}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "#64748b",
          }}
        >
          <div>
            © 2025 {name}
          </div>
          <div>
            Powered by <strong><Link href="/" style={{ color: "#ffffff", textDecoration: "none" }}>VroomDealer</Link></strong>
          </div>
        </div>

      </div>
    </footer>
  );
}
