"use client";

import React, { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { DealerTenant } from "@/types/landing";

interface DealerHeaderProps { tenant: DealerTenant; }

export function DealerHeader({ tenant }: DealerHeaderProps) {
  const [open, setOpen] = useState(false);
  const phone = tenant.contact.phone || "";
  const logo = tenant.logoUrl || tenant.branding.logoUrl;
  const primaryHref = tenant.contact.whatsapp ? `https://wa.me/${tenant.contact.whatsapp.replace(/\D/g, "")}` : phone ? `tel:${phone.replace(/\s/g, "")}` : "#hero";
  const links = [
    ["Strona główna", `/${tenant.slug}`],
    ["Skup aut", primaryHref],
    ["Samochody", `/${tenant.slug}#vehicles`],
    ["Usługi", `/${tenant.slug}#services`],
    ["O nas", `/${tenant.slug}#about`],
    ["Kontakt", `/${tenant.slug}#footer`],
  ];

  const headerBg = tenant.branding?.colors?.headerBg || "#080808";

  return (
    <header className="dealer-header" style={{ background: headerBg }}>
      <div className="dealer-header__inner">
        <a href={`/${tenant.slug}`} aria-label={tenant.businessName}>

          {logo ? (
            <img className="dealer-header__logo" src={logo} alt={tenant.businessName} />
          ) : (
            <span style={{ fontWeight: 800, fontSize: "18px", color: "#fff" }}>{tenant.businessName}</span>
          )}
        </a>


        <nav className="dealer-header__nav" aria-label="Główna nawigacja">
          {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>

        <div className="dealer-header__actions">
          <a className="vd-button vd-button--primary dealer-header__cta" href={primaryHref}>Sprzedaj auto</a>
          {phone && (
            <a className="dealer-header__phone" href={`tel:${phone.replace(/\s/g, "")}`}>
              <Phone size={15} strokeWidth={2.1} />
              <span>{phone}</span>
            </a>
          )}
          <button className="dealer-header__toggle" onClick={() => setOpen(v => !v)} aria-label={open ? "Zamknij menu" : "Otwórz menu"}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="dealer-header__mobile-menu">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a className="vd-button vd-button--primary" href={primaryHref} onClick={() => setOpen(false)}>Sprzedaj auto</a>
        </div>
      )}
    </header>
  );
}
