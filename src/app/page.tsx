export default function HomePage() {
  const phone = "48609525935";
  const whatsappMsg = encodeURIComponent(
    "Dzień dobry, jestem zainteresowany testami VroomDealer dla mojego komisu."
  );
  const waUrl = `https://wa.me/${phone}?text=${whatsappMsg}`;
  const telUrl = `tel:+${phone}`;

  return (
    <main className="landing" id="landing-page">
      {/* Header */}
      <header className="landing__header">
        <div className="landing__header-inner">
          <div className="landing__logo">
            Vroom<span>Dealer</span>.pl
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-inner">
          {/* Left: Text */}
          <div className="landing__text">
            <h1 className="landing__title">
              Twój prywatny system sprzedaży i pozyskiwania aut.
            </h1>
            <p className="landing__subtitle">
              Zbieraj bezpośrednie telefony od kupców, buduj własną markę i automatycznie generuj zapytania o skup samochodów.
            </p>
            <a href={telUrl} className="landing__cta">
              Zadzwoń i zapytaj o dostęp
            </a>
            <p className="landing__teaser">
              Obecnie prowadzimy zamknięte testy. Kolejne miejsca dostępne
              wkrótce.
            </p>
          </div>

          {/* Right: Visual mockup */}
          <div className="landing__visual">
            <div className="landing__visual-bg" />
            <div className="landing__visual-card">
              <img
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000&h=1200&fit=crop"
                alt="Wnętrze luksusowego samochodu"
              />
              <div className="landing__visual-gradient" />

              {/* Floating stats */}
              {/* <div className="landing__stats">
                <div className="landing__stats-header">
                  <span className="landing__stats-label">Status systemu</span>
                  <span className="landing__stats-live">
                    <span className="landing__stats-dot" />
                    Podgląd na żywo
                  </span>
                </div>
                <div className="landing__stats-grid">
                  <div className="landing__stats-item">
                    <div className="landing__stats-item-label">Konwersja</div>
                    <div className="landing__stats-item-value">+320%</div>
                  </div>
                  <div className="landing__stats-item">
                    <div className="landing__stats-item-label">Czas konfiguracji</div>
                    <div className="landing__stats-item-value">30s</div>
                  </div>
                </div>
              </div> */}
            </div>
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
