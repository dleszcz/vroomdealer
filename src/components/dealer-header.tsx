"use client";

import { useState } from "react";
import { Profile } from "@/types/database";
import { DealerTenant } from "@/types/landing";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface DealerHeaderProps {
  profile?: Profile | null;
  tenant?: DealerTenant | null;
}

export function DealerHeader({ profile, tenant }: DealerHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const name = tenant?.businessName || profile?.business_name || "D-CAR";
  const slug = tenant?.slug || profile?.slug || "d-car";
  const phone = tenant?.contact?.phone || profile?.contact_phone || "+48 123 456 789";
  const logoUrl = tenant?.logoUrl || tenant?.branding?.logoUrl || profile?.logo_url;

  const headerBg = tenant?.branding?.colors?.headerBg || "#090B0B";

  const navLinks = [
    { label: "Strona główna", href: "#hero" },
    { label: "Skup aut", href: "#lead-form" },
    { label: "Samochody", href: "#vehicles" },
    { label: "Usługi", href: "#services" },
    { label: "O nas", href: "#about" },
    { label: "Kontakt", href: "#contact" },
  ];

  return (
    <header
      className="dealer-header"
      id="dealer-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: headerBg,
        color: "#ffffff",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "76px",
        }}
      >
        {/* Left — Logo */}
        <Link href={`/${slug}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              style={{ height: "60px", maxWidth: "220px", objectFit: "contain" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "var(--color-primary, #1686E0)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                }}
              >
                D
              </div>
              <div>
                <span style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "0.02em", color: "#ffffff", display: "block", lineHeight: 1 }}>
                  D-CAR
                </span>
                <span style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Dawid Woźniak
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Center — Nav Menu */}
        <nav className="header-nav-desktop" style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary, #1686E0)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right — Phone & Primary CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <a
            href="#lead-form"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "10px",
              background: "var(--color-primary, #1686E0)",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: 800,
              textDecoration: "none",
              letterSpacing: "0.03em",
              boxShadow: "0 4px 14px rgba(22, 134, 224, 0.35)",
              transition: "transform 0.2s, opacity 0.2s",
            }}
            onClick={() => trackEvent("hero_cta_clicked", { source: "header_button" })}
          >
            SPRZEDAJ AUTO
          </a>

          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              onClick={() => trackEvent("phone_clicked", { source: "header" })}
              className="header-phone-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary, #1686E0)" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{phone}</span>
            </a>
          )}

          {/* Mobile Toggle */}
          <button
            className="header-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: "0.4rem",
            }}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "#090B0B",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 600, textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
