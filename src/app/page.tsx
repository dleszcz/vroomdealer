import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant";
import { BrandProvider } from "@/components/brand-provider";
import { DealerHeader } from "@/components/dealer-header";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { ContactBar } from "@/components/contact-bar";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";

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
    title: "VroomDealer.pl — Platforma sprzedażowa dla komisów samochodowych",
    description: "Ultra-szybkie strony sprzedażowe dla komisów samochodowych. Zwiększ sprzedaż dzięki profesjonalnym ogłoszeniom z retargetingiem i integracją WhatsApp.",
    openGraph: {
      title: "VroomDealer.pl — Platforma sprzedażowa dla komisów samochodowych",
      description: "Ultra-szybkie strony sprzedażowe dla komisów samochodowych.",
      url: "https://vroomdealer.pl",
      type: "website",
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

  // ─── VroomDealer.pl — Coming Soon ───
  return (
    <main className="cs">
      {/* Animated background orbs */}
      <div className="cs__orb cs__orb--1" aria-hidden="true" />
      <div className="cs__orb cs__orb--2" aria-hidden="true" />
      <div className="cs__orb cs__orb--3" aria-hidden="true" />

      <div className="cs__content">
        {/* Logo */}
        <div className="cs__logo">
          <span className="cs__logo-vroom">Vroom</span>
          <span className="cs__logo-dealer">Dealer</span>
          <span className="cs__logo-pl">.pl</span>
        </div>

        {/* Badge */}
        <div className="cs__badge">
          <span className="cs__badge-dot" />
          W budowie
        </div>

        {/* Heading */}
        <h1 className="cs__title">
          Platforma sprzedażowa<br />
          <span className="cs__title-accent">dla komisów samochodowych</span>
        </h1>

        <p className="cs__subtitle">
          Ultra-szybkie strony sprzedażowe z retargetingiem, integracją WhatsApp
          i systemem pozyskiwania leadów. Zamknięte testy w toku.
        </p>

        {/* CTA */}
        <div className="cs__actions">
          <a href="tel:+48609525935" className="cs__btn cs__btn--primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Zapytaj o dostęp
          </a>
          <a
            href={`https://wa.me/48609525935?text=${encodeURIComponent("Dzień dobry, jestem zainteresowany testami VroomDealer dla mojego komisu.")}`}
            className="cs__btn cs__btn--outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Features grid */}
        <div className="cs__features">
          <div className="cs__feature">
            <div className="cs__feature-icon">🚀</div>
            <div className="cs__feature-label">Landing pages<br/>w 5 minut</div>
          </div>
          <div className="cs__feature">
            <div className="cs__feature-icon">📱</div>
            <div className="cs__feature-label">Integracja<br/>WhatsApp</div>
          </div>
          <div className="cs__feature">
            <div className="cs__feature-icon">🎯</div>
            <div className="cs__feature-label">Meta Pixel<br/>& retargeting</div>
          </div>
          <div className="cs__feature">
            <div className="cs__feature-icon">📊</div>
            <div className="cs__feature-label">System<br/>leadów</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="cs__footer">
        <p>© {new Date().getFullYear()} VroomDealer.pl — Wszelkie prawa zastrzeżone.</p>
      </footer>
    </main>
  );
}
