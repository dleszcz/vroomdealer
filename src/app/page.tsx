import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant";
import { BrandProvider } from "@/components/brand-provider";
import { DealerHeader } from "@/components/dealer-header";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { ContactBar } from "@/components/contact-bar";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || undefined;

  // Check if host resolves to a specific tenant custom domain (e.g. d-car.com.pl)
  if (host && !host.includes("localhost") && !host.includes("vroomdealer.pl") && !host.includes("vercel.app")) {
    const tenant = await resolveTenant({ domain: host });
    if (tenant) {
      const title = tenant.seo?.metaTitle || `${tenant.businessName} — Skup Aut i Sprzedaż`;
      const description = tenant.seo?.metaDescription || tenant.businessDescription || "Twój prywatny system sprzedaży i pozyskiwania aut.";
      return {
        title,
        description,
        alternates: { canonical: `https://${tenant.customDomain}` },
        openGraph: { title, description, url: `https://${tenant.customDomain}`, type: "website" },
      };
    }
  }

  // Default SaaS Landing Page Metadata for VroomDealer.pl
  return {
    title: "VroomDealer.pl — Twój prywatny system sprzedaży i pozyskiwania aut",
    description: "Zbieraj bezpośrednie telefony od kupców, buduj własną markę i automatycznie generuj zapytania o skup samochodów.",
    openGraph: {
      title: "VroomDealer.pl — Twój prywatny system sprzedaży i pozyskiwania aut",
      description: "Zbieraj bezpośrednie telefony od kupców, buduj własną markę i automatycznie generuj zapytania o skup samochodów.",
      url: "https://vroomdealer.pl",
      type: "website",
    },
    facebook: {
      appId: process.env.NEXT_PUBLIC_FB_APP_ID || "",
    },
  };
}

export default async function HomePage() {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || undefined;

  // If request comes from a custom domain (e.g. d-car.com.pl), render that tenant
  if (host && !host.includes("localhost") && !host.includes("vroomdealer.pl") && !host.includes("vercel.app")) {
    const tenant = await resolveTenant({ domain: host });
    if (tenant) {
      const profileShim = {
        id: tenant.id,
        slug: tenant.slug,
        business_name: tenant.businessName,
        business_description: tenant.businessDescription || null,
        logo_url: tenant.logoUrl || null,
        pixel_id: tenant.analytics?.pixelId || null,
        whatsapp_number: tenant.contact.whatsapp || null,
        contact_phone: tenant.contact.phone || null,
        address: tenant.location?.address || null,
        city: tenant.location?.city || null,
        created_at: new Date().toISOString(),
      };

      return (
        <BrandProvider branding={tenant.branding}>
          {tenant.analytics?.pixelId && <MetaPixel pixelId={tenant.analytics.pixelId} />}
          <div className="dealer-layout">
            <DealerHeader tenant={tenant} />
            <main className="dealer-main">
              <SectionRenderer tenant={tenant} />
            </main>
            <ContactBar profile={profileShim} />
            <Footer />
          </div>
        </BrandProvider>
      );
    }
  }

  // Otherwise, render VroomDealer SaaS Main Platform Landing Page
  const phone = "48609525935";
  const whatsappMsg = encodeURIComponent("Dzień dobry, jestem zainteresowany testami VroomDealer dla mojego komisu.");
  const waUrl = `https://wa.me/${phone}?text=${whatsappMsg}`;
  const telUrl = `tel:+${phone}`;

  return (
    <main className="landing" id="landing-page">
      {/* Header */}
      <header className="landing__header">
        <div className="landing__header-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="landing__logo">
            Vroom<span>Dealer</span>.pl
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link
              href="/d-car"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                padding: "0.4rem 0.8rem",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
              }}
            >
              Zobacz demo D-Car ➔
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-inner">
          <div className="landing__text">
            <h1 className="landing__title">
              Twój prywatny system sprzedaży i pozyskiwania aut.
            </h1>
            <p className="landing__subtitle">
              Zbieraj bezpośrednie telefony od kupców, buduj własną markę i automatycznie generuj zapytania o skup samochodów.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
              <a href={telUrl} className="landing__cta">
                Zadzwoń i zapytaj o dostęp
              </a>
              <Link
                href="/d-car"
                className="landing__cta"
                style={{ background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
              >
                Zobacz Landing D-Car ➔
              </Link>
            </div>
            <p className="landing__teaser" style={{ marginTop: "1.25rem" }}>
              Obecnie prowadzimy zamknięte testy. Kolejne miejsca dostępne wkrótce.
            </p>
          </div>

          <div className="landing__visual">
            <div className="landing__visual-bg" />
            <div className="landing__visual-container">
              <div className="landing__visual-card">
                <img
                  src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000&h=1200&fit=crop"
                  alt="VroomDealer System"
                />
                <div className="landing__visual-gradient" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Links Section */}
      <section style={{ padding: "3rem 1.5rem", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            Przetestuj Landing Engine dla Komisów
          </h2>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
            Zobacz jak wygląda gotowa strona komisu generowana przez silnik VroomDealer:
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/d-car"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                background: "var(--color-primary)",
                color: "var(--color-primary-fg)",
                fontWeight: 700,
              }}
            >
              Komis D-Car (/d-car)
            </Link>
            <Link
              href="/komis-maciek"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                color: "var(--color-foreground)",
                fontWeight: 600,
              }}
            >
              Auto Komis Maciek (/komis-maciek)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <p className="landing__footer-copy">
          © {new Date().getFullYear()} VroomDealer.pl. Wszelkie prawa zastrzeżone.
        </p>
        <div className="landing__footer-links">
          <a href="mailto:kontakt@vroomdealer.pl" className="landing__footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            E-mail
          </a>
          <a href={telUrl} className="landing__footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Telefon
          </a>
          <a href={waUrl} className="landing__footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </footer>
    </main>
  );
}
