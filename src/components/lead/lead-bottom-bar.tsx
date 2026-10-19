'use client';

import React from 'react';
import { Phone, MapPin, Lock, MessageSquare } from 'lucide-react';
import { useLeadReveal } from './lead-reveal-context';

interface LeadBottomBarProps {
  city: string;
}

export const LeadBottomBar: React.FC<LeadBottomBarProps> = ({ city }) => {
  const { isRevealed, phone, cleanPhone, customerName, openModal } = useLeadReveal();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 py-2.5 sm:py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] text-white shadow-2xl">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center gap-1.5 truncate">
            <span
              className={`text-xs sm:text-sm font-mono font-bold truncate ${
                isRevealed ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {phone}
            </span>
            <span className="text-slate-600 font-normal">•</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              {customerName || 'Klient'}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 truncate flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{city || 'Polska'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isRevealed ? (
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Odkryj kontakt / Zadzwoń</span>
            </button>
          ) : (
            <>
              <a
                href={`sms:${cleanPhone}`}
                className="px-3 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>SMS</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-current shrink-0" />
                <span>Zadzwoń</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
