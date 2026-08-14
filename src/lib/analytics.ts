"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export type EventName =
  | "page_view"
  | "cta_click"
  | "phone_clicked"
  | "whatsapp_clicked"
  | "lead_form_started"
  | "lead_submitted"
  | "vehicle_viewed"
  | "service_clicked"
  | "ClickTowing"
  | "ClickSMS"
  | "ClickWhatsApp"
  | "ClickCall"
  | string;


export function trackEvent(eventName: EventName, eventParams?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  // 1. Meta Pixel (fbq)
  if (typeof window.fbq === "function") {
    try {
      window.fbq("trackCustom", eventName, eventParams);
      if (process.env.NODE_ENV === "development") {
        console.log(`🎯 [Analytics] Meta Pixel tracked: ${eventName}`, eventParams);
      }
    } catch (err) {
      console.error("[Analytics] Meta Pixel error:", err);
    }
  }

  // 2. Google Analytics (gtag) if present
  if (typeof window.gtag === "function") {
    try {
      window.gtag("event", eventName, eventParams);
    } catch (err) {
      console.error("[Analytics] Google Analytics error:", err);
    }
  }
}
