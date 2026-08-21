import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveTenant } from "@/lib/tenant";
import { BrandProvider } from "@/components/brand-provider";
import { DealerHeader } from "@/components/dealer-header";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { ContactBar } from "@/components/contact-bar";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";
import { CsJoinForm } from "@/components/cs-join-form";

export async function generateMetadata(): Promise<Metadata> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || undefined;

  // Check if host resolves to a specific tenant custom domain
  if (host && !host.includes("localhost") && !host.includes("vroomdealer.pl") && !host.includes("vercel.app")) {
    const tenant = await resolveTenant({ domain: host });
    if (tenant) {
      const title = tenant.seo?.metaTitle || `${tenant.businessName} - Skup Aut i Sprzedaż`;
      const description = tenant.seo?.metaDescription || tenant.businessDescription || "Twój prywatny system sprzedaży i pozyskiwania aut.";
      return {
        title,
        description,
        alternates: { canonical: `https://${tenant.customDomain}` },
        openGraph: { title, description, url: `https://${tenant.customDomain}`, type: "website" },
      };
    }
  }

  // Default SaaS Landing Page Metadata for VroomDealer.pl (v1.0 Spec)
  return {
    title: "VroomDealer.pl - Pozyskuj więcej samochodów od osób prywatnych",
    description: "VroomDealer buduje dla Twojego komisu lokalny kanał pozyskiwania aut: od strony i SEO po kampanie i obsługę leadów. Dołącz do zamkniętych testów.",
    openGraph: {
      title: "VroomDealer.pl - Pozyskuj więcej samochodów od osób prywatnych",
      description: "VroomDealer buduje dla Twojego komisu lokalny kanał pozyskiwania aut: od strony i SEO po kampanie i obsługę leadów.",
      url: "https://vroomdealer.pl",
      type: "website",
    },
  };
}

export default async function HomePage() {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || undefined;

  // If request comes from a custom domain, render that tenant
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
            <Footer tenant={tenant} />
          </div>
        </BrandProvider>
      );
    }
  }

  // ─── VroomDealer.pl — SaaS Coming Soon (Spec v1.0) ───
  return (
    <main className="cs">
      {/* Animated background orbs */}
      <div className="cs__orb cs__orb--1" aria-hidden="true" />
      <div className="cs__orb cs__orb--2" aria-hidden="true" />
      <div className="cs__orb cs__orb--3" aria-hidden="true" />

      <div className="cs__content">
        {/* 1. Header / Logo */}
        <div className="cs__logo">
          <span className="cs__logo-vroom">Vroom</span>
          <span className="cs__logo-dealer">Dealer</span>
          <span className="cs__logo-pl">.pl</span>
        </div>

        {/* Badge */}
        <div className="cs__badge">
          <span className="cs__badge-dot" />
          Zamknięte testy w toku
        </div>

        {/* Hero Heading & Subheadline */}
        <h1 className="cs__title">
          Pozyskuj więcej samochodów<br />
          <span className="cs__title-accent">od osób prywatnych.</span>
        </h1>

        <p className="cs__subtitle">
          VroomDealer buduje dla Twojego komisu lokalny kanał pozyskiwania aut: od dedykowanej strony i lokalnego SEO po kampanie i obsługę zgłoszeń.
        </p>

        {/* Hero Actions */}
        <div className="cs__actions">
          <a href="#join-tests" className="cs__btn cs__btn--primary">
            Dołącz do testów ➔
          </a>
          <a
            href={`https://wa.me/48609525935?text=${encodeURIComponent("Dzień dobry, chciałbym porozmawiać o teście VroomDealer dla mojego komisu.")}`}
            className="cs__btn cs__btn--outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Porozmawiaj o teście
          </a>
        </div>

        {/* 2. Problem Section */}
        <div className="cs__section cs__section--problem">
          <span className="cs__eyebrow">Problem rynku</span>
          <h2 className="cs__section-title">Dobrych samochodów nie brakuje. Trudniej je znaleźć.</h2>
          <p className="cs__section-copy">
            Najlepsze auta od osób prywatnych szybko znikają z rynku. VroomDealer pomaga niezależnym komisiom docierać do właścicieli, którzy właśnie chcą sprzedać samochód.
          </p>
        </div>

        {/* 3. How it Works Section */}
        <div className="cs__section cs__section--process">
          <span className="cs__eyebrow">Proces pozyskiwania</span>
          <h2 className="cs__section-title">Jak to działa?</h2>

          <div className="cs__steps">
            <div className="cs__step">
              <div className="cs__step-num">01</div>
              <div className="cs__step-title">Twój komis</div>
              <div className="cs__step-desc">Analizujemy Twój rynek i ustalamy profil kupowanych aut.</div>
            </div>

            <div className="cs__step">
              <div className="cs__step-num">02</div>
              <div className="cs__step-title">Lokalna strona + SEO + kampanie</div>
              <div className="cs__step-desc">Uruchamiamy zoptymalizowany kanał pozyskiwania.</div>
            </div>

            <div className="cs__step">
              <div className="cs__step-num">03</div>
              <div className="cs__step-title">Właściciel trafia do Ciebie</div>
              <div className="cs__step-desc">Sprzedający w okolicy zgłasza auto bez zbędnych pytań.</div>
            </div>

            <div className="cs__step">
              <div className="cs__step-num">04</div>
              <div className="cs__step-title">Kwalifikujesz lead</div>
              <div className="cs__step-desc">Otrzymujesz komplet informacji i wstępną wycenę.</div>
            </div>

            <div className="cs__step">
              <div className="cs__step-num">05</div>
              <div className="cs__step-title">Kupujesz samochód</div>
              <div className="cs__step-desc">Finalizujesz transakcję i zyskujesz auto na plac.</div>
            </div>
          </div>

          <div className="cs__key-message">
            💡 <strong>Kluczowa zasada:</strong> Nie sprzedajemy Ci kolejnej strony internetowej. Budujemy kanał, który ma dostarczać Ci samochody do dalszej sprzedaży.
          </div>
        </div>

        {/* 4. Value-Driven Features */}
        <div className="cs__section cs__section--features">
          <span className="cs__eyebrow">Co zapewnia VroomDealer?</span>
          <h2 className="cs__section-title">System skupiony na wyniku biznesowym</h2>

          <div className="cs__grid-features">
            <div className="cs__grid-card">
              <div className="cs__grid-icon">🌐</div>
              <h3>Lokalna strona komisu</h3>
              <p>Strona zoptymalizowana pod Twój biznes, markę i lokalny rynek operacyjny.</p>
            </div>

            <div className="cs__grid-card">
              <div className="cs__grid-icon">📋</div>
              <h3>Pozyskiwanie leadów</h3>
              <p>Prosty formularz, dzięki któremu właściciel auta może zgłosić samochód bez dzwonienia.</p>
            </div>

            <div className="cs__grid-card">
              <div className="cs__grid-icon">🔍</div>
              <h3>Lokalne SEO</h3>
              <p>Docieramy bezpośrednio do osób szukających skupu aut w Twojej okolicy.</p>
            </div>

            <div className="cs__grid-card">
              <div className="cs__grid-icon">📢</div>
              <h3>Kampanie reklamowe</h3>
              <p>Docieramy do potencjalnych sprzedających w określonym obszarze geograficznym.</p>
            </div>

            <div className="cs__grid-card">
              <div className="cs__grid-icon">📊</div>
              <h3>Analityka & Tracking</h3>
              <p>Dokładnie wiesz, skąd przychodzą zgłoszenia i które kanały przynoszą kupione auta.</p>
            </div>
          </div>
        </div>

        {/* 5. Target Audience Section */}
        <div className="cs__section cs__section--target">
          <span className="cs__eyebrow">Dla kogo?</span>
          <h2 className="cs__section-title">Dla niezależnych komisów samochodowych</h2>
          <p className="cs__section-copy" style={{ marginBottom: "32px" }}>
            VroomDealer powstaje z myślą o małych i średnich komisach, które chcą zwiększyć liczbę samochodów pozyskiwanych bezpośrednio od właścicieli.
          </p>

          <div className="cs__audience-grid">
            <div className="cs__audience-card">
              <div className="cs__audience-bullet">🚗</div>
              <p>Masz ograniczony dostęp do dobrych aut od prywatnych osób.</p>
            </div>
            <div className="cs__audience-card">
              <div className="cs__audience-bullet">⏱️</div>
              <p>Nie masz czasu zajmować się skomplikowanym marketingiem.</p>
            </div>
            <div className="cs__audience-card">
              <div className="cs__audience-bullet">📈</div>
              <p>Chcesz więcej wartościowych zapytań od osób chcących sprzedać samochód.</p>
            </div>
          </div>
        </div>

        {/* 6. Closed Testing & Lead Form Section */}
        <div id="join-tests" className="cs__section cs__section--join">
          <span className="cs__eyebrow">Dołącz do programu</span>
          <h2 className="cs__section-title">Zamknięte testy z wybranymi komisami</h2>
          <p className="cs__section-copy" style={{ marginBottom: "36px" }}>
            VroomDealer jest obecnie w fazie zamkniętych testów z wybranymi komisami samochodowymi. Zgłoś swój komis, aby omówić możliwość dołączenia.
          </p>

          <CsJoinForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="cs__footer">
        <p>© {new Date().getFullYear()} VroomDealer.pl - Wszelkie prawa zastrzeżone.</p>
      </footer>
    </main>
  );
}
