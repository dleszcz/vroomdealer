"use client";

import { TrackClick } from "./track-click";

interface DealerServicesProps {
  hasTowing: boolean;
  hasBuying: boolean;
  contactPhone?: string | null;
}

export function DealerServices({
  hasTowing,
  hasBuying,
  contactPhone,
}: DealerServicesProps) {
  if (!hasTowing && !hasBuying) return null;

  const phone = contactPhone?.replace(/\s/g, "");

  return (
    <section className="services" id="services">
      <h2 className="services__title">Usługi u Dilera</h2>
      <div className="services__grid">
        {hasTowing && (
          <TrackClick eventName="ClickTowing" eventParams={{ type: 'towing' }}>
            <a
              href={phone ? `tel:${phone}` : '#'}
              className="services__card"
            >
              <div className="services__icon services__icon--towing">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v4" />
                  <path d="M11.8 13v2a2 2 0 1 0 4 0v-2" />
                  <rect x="2" y="9" width="20" height="8" rx="2" />
                  <path d="M5 17v2a2 2 0 1 0 4 0v-2" />
                  <path d="M15 17v2a2 2 0 1 0 4 0v-2" />
                </svg>
              </div>
              <div className="services__content">
                <h3 className="services__card-title">Pomoc Drogowa / Laweta</h3>
                <p className="services__card-desc">
                  Transport aut na terenie całego kraju — 24/7. Szybki dojazd.
                </p>
                <div className="services__link-label">
                  Zadzwoń po pomoc <span className="arrow">→</span>
                </div>
              </div>
            </a>
          </TrackClick>
        )}

        {hasBuying && (
          <TrackClick eventName="ClickSMS" eventParams={{ type: 'buying' }}>
            <a
              href={phone ? `sms:${phone}?body=${encodeURIComponent("Cześć! Chcę sprzedać mój samochód. Proszę o kontakt w sprawie wyceny.")}` : '#'}
              className="services__card"
            >
              <div className="services__icon services__icon--buying">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="services__content">
                <h3 className="services__card-title">Skup Samochodów</h3>
                <p className="services__card-desc">
                  Kupujemy auta za gotówkę. Szybka wycena i formalności na miejscu.
                </p>
                <div className="services__link-label">
                  Wyceń swoje auto <span className="arrow">→</span>
                </div>
              </div>
            </a>
          </TrackClick>
        )}
      </div>
    </section>
  );
}
