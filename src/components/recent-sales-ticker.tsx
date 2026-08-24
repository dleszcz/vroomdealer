"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, TrendingUp, X } from "lucide-react";
import { DealerTenant } from "@/types/landing";

interface SaleNotification {
  id: string;
  brand: string;
  price: string;
  city: string;
  time: string;
}

interface RecentSalesTickerProps {
  tenant: DealerTenant;
}

export function RecentSalesTicker({ tenant }: RecentSalesTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const city = tenant.location?.city || "Topólka";

  const notifications: SaleNotification[] = [
    { id: "1", brand: "Audi A4 B8 2.0 TDI", price: "24 500 zł", city, time: "12 min temu" },
    { id: "2", brand: "Volkswagen Passat B7", price: "28 900 zł", city: "Radziejów", time: "34 min temu" },
    { id: "3", brand: "BMW Seria 3 F30", price: "42 000 zł", city: "Lubraniec", time: "1h temu" },
    { id: "4", brand: "Opel Astra J", price: "18 500 zł", city: "Izbica Kujawska", time: "2h temu" },
    { id: "5", brand: "Ford Mondeo MK5", price: "36 000 zł", city: "Włocławek", time: "3h temu" },
  ];

  useEffect(() => {
    // Initial delay before showing first toast
    const initialTimer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 2500);

    return () => clearTimeout(initialTimer);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;

    // Cycle through notifications every 7 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        if (!dismissed) setVisible(true);
      }, 400);
    }, 7500);

    return () => clearInterval(interval);
  }, [dismissed, notifications.length]);

  if (dismissed) return null;

  const currentItem = notifications[currentIndex];
  const primaryColor = tenant.branding?.colors?.primary || "#1686E0";

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "80px",
        left: "20px",
        zIndex: 900,
        maxWidth: "340px",
        width: "calc(100vw - 40px)",
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.95)",
        opacity: visible ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          background: "rgba(10, 15, 29, 0.94)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${primaryColor}44`,
          borderRadius: "16px",
          padding: "14px 16px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        <button
          onClick={() => setDismissed(true)}
          aria-label="Zamknij powiadomienie"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.4)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          <X size={14} />
        </button>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: `${primaryColor}20`,
            border: `1px solid ${primaryColor}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: primaryColor,
            flexShrink: 0,
          }}
        >
          <TrendingUp size={20} />
        </div>

        <div style={{ flex: 1, paddingRight: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              ✓ Odkupiono / Wyceniono
            </span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>• {currentItem.time}</span>
          </div>

          <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>
            {currentItem.brand}
          </div>

          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)", marginTop: "2px" }}>
            Wycena: <strong style={{ color: "#ffffff" }}>{currentItem.price}</strong> ({currentItem.city})
          </div>
        </div>
      </div>
    </div>
  );
}
