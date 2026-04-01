interface DealerServicesProps {
  hasTowing: boolean;
  hasBuying: boolean;
  whatsappNumber?: string | null;
}

export function DealerServices({
  hasTowing,
  hasBuying,
  whatsappNumber,
}: DealerServicesProps) {
  if (!hasTowing && !hasBuying) return null;

  return (
    <section className="services" id="services">
      <h2 className="services__title">Nasze usługi</h2>
      <div className="services__grid">
        {hasTowing && (
          <div className="services__card">
            <div className="services__icon services__icon--towing">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="5.5" cy="17.5" r="2.5" />
                <circle cx="18.5" cy="17.5" r="2.5" />
                <path d="M8 17H16M2 9L4 4H11L14 9M14 9H21L23 15V17H21M14 9V17" />
              </svg>
            </div>
            <h3 className="services__card-title">Pomoc Drogowa / Laweta</h3>
            <p className="services__card-desc">
              Oferujemy usługi lawety i pomocy drogowej. Transport aut na terenie
              całego kraju — 24/7.
            </p>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Cześć! Potrzebuję lawetę.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="services__cta"
              >
                Zamów lawetę
              </a>
            )}
          </div>
        )}

        {hasBuying && (
          <div className="services__card">
            <div className="services__icon services__icon--buying">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v20m5-17H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="services__card-title">Skup Samochodów</h3>
            <p className="services__card-desc">
              Kupujemy samochody za gotówkę. Szybka wycena, uczciwa cena.
              Formalności po naszej stronie.
            </p>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Cześć! Chcę sprzedać samochód.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="services__cta"
              >
                Wyceń swoje auto
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
