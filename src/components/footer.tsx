"use client";

import React from "react";
import { Clock3, MapPin, Phone } from "lucide-react";
import { DealerTenant } from "@/types/landing";

interface FooterProps { tenant?: DealerTenant | null; }

export function Footer({ tenant }: FooterProps) {
  const name = tenant?.businessName || "";
  const phone = tenant?.contact?.phone || "";
  const email = tenant?.contact?.email || "";
  const city = tenant?.location?.city || "";
  const address = tenant?.location?.address || "";
  const logo = tenant?.logoUrl || tenant?.branding?.logoUrl;

  const footerBg = tenant?.branding?.colors?.footerBg || "#080808";

  // Active service areas for local SEO links
  const activeLocalPages =
    tenant?.localSeo?.localPages?.filter(
      (lp) => lp.enabled && lp.indexable && lp.showInFooter !== false
    ) || [];


  return (
    <footer id="footer" className="dealer-footer" style={{ background: footerBg }}>
      <div className="vd-container">
        <div className="dealer-footer__grid">
          <div>
            {logo ? (
              <img className="dealer-footer__logo" src={logo} alt={name} />
            ) : (
              <span style={{ fontWeight: 800, fontSize: "20px", color: "#fff", display: "block", marginBottom: "12px" }}>
                {name}
              </span>
            )}
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
              <a href={`/${tenant?.slug || ""}`}>Strona główna</a>
              <a href={`/${tenant?.slug || ""}#lead-form`}>Skup aut</a>
              <a href={`/${tenant?.slug || ""}#vehicles`}>Samochody</a>
              <a href={`/${tenant?.slug || ""}#services`}>Usługi</a>
              <a href={`/${tenant?.slug || ""}#about`}>O nas</a>
              <a href={`/${tenant?.slug || ""}#footer`}>Kontakt</a>
            </div>
          </div>
          {activeLocalPages.length > 0 ? (
            <div>
              <h3 className="dealer-footer__heading">Obsługiwane okolice</h3>
              <div className="dealer-footer__links">
                {activeLocalPages.slice(0, 5).map((lp) => (
                  <a key={lp.slug} href={`/${tenant?.slug || ""}/${lp.slug}`}>
                    Skup aut {lp.city}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="dealer-footer__heading">Usługi</h3>
              <div className="dealer-footer__links">
                <a href={`/${tenant?.slug || ""}#lead-form`}>Skup aut</a>
                <a href={`/${tenant?.slug || ""}#vehicles`}>Sprzedaż aut</a>
                <a href={`/${tenant?.slug || ""}#services`}>Pomoc drogowa</a>
                <a href={`/${tenant?.slug || ""}#services`}>Transport aut</a>
                <a href={`/${tenant?.slug || ""}#services`}>Inne usługi</a>
              </div>
            </div>
          )}

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
        </div>

        <div className="dealer-footer__bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <span className="dealer-footer__powered">Powered by <strong>VroomDealer</strong></span>
        </div>
      </div>
    </footer>
  );
}
