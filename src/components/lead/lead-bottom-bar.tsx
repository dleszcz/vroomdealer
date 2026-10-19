'use client';

import React from 'react';
import { Phone, MapPin, Loader2, MessageSquare } from 'lucide-react';
import { useLeadReveal } from './lead-reveal-context';

interface LeadBottomBarProps {
  city: string;
}

export const LeadBottomBar: React.FC<LeadBottomBarProps> = ({ city }) => {
  const { isRevealed, cleanPhone, customerName, revealLead, isRevealing } = useLeadReveal();

  const handleCall = async (e: React.MouseEvent) => {
    if (isRevealed && cleanPhone) {
      return; // native anchor tag handles href={`tel:${cleanPhone}`}
    }
    e.preventDefault();
    if (isRevealing) return;
    const res = await revealLead();
    if (res.success && res.phone) {
      const digits = res.phone.replace(/\D/g, '');
      window.location.href = `tel:${digits}`;
    }
  };

  const handleSms = async (e: React.MouseEvent) => {
    if (isRevealed && cleanPhone) {
      return; // native anchor tag handles href={`sms:${cleanPhone}`}
    }
    e.preventDefault();
    if (isRevealing) return;
    const res = await revealLead();
    if (res.success && res.phone) {
      const digits = res.phone.replace(/\D/g, '');
      window.location.href = `sms:${digits}`;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 py-2.5 sm:py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] text-white shadow-2xl">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        {/* Lewa strona: Imię klienta i lokalizacja (bez zaśmiecania numerem telefonu) */}
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs sm:text-sm font-black text-white truncate">
              {customerName || 'Właściciel pojazdu'}
            </span>
            <span className="text-slate-600 font-normal">•</span>
            <span className="text-[11px] text-emerald-400 font-semibold truncate">
              Bezpośredni kontakt
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{city || 'Polska'}</span>
          </div>
        </div>

        {/* Prawa strona: Przyciski SMS i Zadzwoń – od razu otwierają natywne aplikacje telefonu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={isRevealed && cleanPhone ? `sms:${cleanPhone}` : '#'}
            onClick={handleSms}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            <span>SMS</span>
          </a>

          <a
            href={isRevealed && cleanPhone ? `tel:${cleanPhone}` : '#'}
            onClick={handleCall}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            {isRevealing ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Phone className="w-4 h-4 fill-current shrink-0" />
            )}
            <span>Zadzwoń</span>
          </a>
        </div>
      </div>
    </div>
  );
};
