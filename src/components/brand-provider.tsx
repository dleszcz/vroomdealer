import React from "react";
import { DealerBranding } from "@/types/landing";

interface BrandProviderProps {
  branding?: DealerBranding | null;
  children: React.ReactNode;
}

export function BrandProvider({ branding, children }: BrandProviderProps) {
  if (!branding || !branding.colors) {
    return <>{children}</>;
  }

  const { colors } = branding;
  const cssVariables = `
    :root {
      ${colors.primary ? `--color-primary: ${colors.primary};` : ""}
      ${colors.primaryForeground ? `--color-primary-fg: ${colors.primaryForeground};` : ""}
      ${colors.background ? `--color-background: ${colors.background};` : ""}
      ${colors.foreground ? `--color-foreground: ${colors.foreground};` : ""}
      ${colors.accent ? `--color-accent: ${colors.accent};` : ""}
      ${colors.accentForeground ? `--color-accent-fg: ${colors.accentForeground};` : ""}
      ${colors.surface ? `--color-surface: ${colors.surface};` : ""}
      ${colors.muted ? `--color-muted: ${colors.muted};` : ""}
      ${colors.headerBg ? `--color-header-bg: ${colors.headerBg};` : ""}
      ${colors.footerBg ? `--color-footer-bg: ${colors.footerBg};` : ""}
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </>
  );
}
