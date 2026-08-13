"use client";

import React from "react";
import { Clock3, MapPin, Phone } from "lucide-react";
import { DealerTenant } from "@/types/landing";

interface FooterProps { tenant?: DealerTenant | null; }

export function Footer({ tenant }: FooterProps) {
  const name = tenant?.businessName || "D-CAR";
  const phone = tenant?.contact?.phone || "";
  const email = tenant?.contact?.email || "";
  const city = tenant?.location?.city || "";
  const address = tenant?.location?.address || "";
  const logo = tenant?.logoUrl || tenant?.branding?.logoUrl || "/images/dcar-logo.png";

  const footerBg = tenant?.branding?.colors?.footerBg || "#080808";

  return (
    <footer id="footer" className="dealer-footer" style={{ background: footerBg }}>
      <div className="vd-container">
        <div className="dealer-footer__grid">
          <div>
            <img className="dealer-footer__logo" src={logo} alt={name} />
            <p className="dealer-footer__description">Skup i sprzedaż samochodów. Szybko, uczciwie, bezpiecznie.</p>
            <div className="dealer-footer__socials">
              <span className="dealer-footer__social">FB</span>
              <span className="dealer-footer__social">IG</span>
              <span className="dealer-footer__social">TT</span>
              <span className="dealer-footer__social">YT</span>
            </div>
          </div>
          <div>
            <h3 className="dealer-footer__heading">Szybkie linki</h3>
            <div className="dealer-footer__links">
              <a href="#hero">Strona główna</a><a href="#lead-form">Skup aut</a><a href="#vehicles">Samochody</a><a href="#services">Usługi</a><a href="#about">O nas</a><a href="#footer">Kontakt</a>
            </div>
          </div>
          <div>
            <h3 className="dealer-footer__heading">Usługi</h3>
            <div className="dealer-footer__links">
              <a href="#lead-form">Skup aut</a><a href="#vehicles">Sprzedaż aut</a><a href="#services">Pomoc drogowa</a><a href="#services">Transport aut</a><a href="#services">Inne usługi</a>
            </div>
          </div>
          <div>
            <h3 className="dealer-footer__heading">Kontakt</h3>
            <div className="dealer-footer__links">
              {phone && <a className="dealer-footer__contact" href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={12} /> {phone}</a>}
              {email && <a className="dealer-footer__contact" href={`mailto:${email}`}>✉ {email}</a>}
              {(address || city) && <span className="dealer-footer__contact"><MapPin size={12} /> {address}{address && city ? ", " : ""}{city}</span>}
              <span className="dealer-footer__contact"><Clock3 size={12} /> Pn–Pt: 8:00–18:00</span>
              <span className="dealer-footer__contact">Sob: 9:00–14:00</span>
            </div>
          </div>
          <div>
            <h3 className="dealer-footer__heading">Obserwuj nas</h3>
            <div className="dealer-footer__socials">
              <span className="dealer-footer__social">FB</span><span className="dealer-footer__social">IG</span><span className="dealer-footer__social">TT</span><span className="dealer-footer__social">YT</span>
            </div>
          </div>
        </div>
        <div className="dealer-footer__bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <span className="dealer-footer__powered">Powered by <strong>VroomDealer</strong></span>
        </div>
      </div>
    </footer>
  );
}
