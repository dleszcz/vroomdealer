'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, Phone, Building2, Banknote, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { useLeadReveal } from './lead-reveal-context';

export const LeadRevealModal: React.FC = () => {
  const {
    isModalOpen,
    closeModal,
    revealLead,
    isSubmitting,
    buyerProfile,
    customerName,
  } = useLeadReveal();

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Wypełnij danymi z zapamiętanego profilu
  useEffect(() => {
    if (buyerProfile.buyerName) setBuyerName(buyerProfile.buyerName);
    if (buyerProfile.buyerPhone) setBuyerPhone(buyerProfile.buyerPhone);
  }, [buyerProfile]);

  // Reset error when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setErrorMsg(null);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!buyerName.trim()) {
      setErrorMsg('Podaj nazwę skupu lub swoje imię / firmę.');
      return;
    }

    const clean = buyerPhone.replace(/\D/g, '');
    if (clean.length < 9) {
      setErrorMsg('Wpisz poprawny numer telefonu (min. 9 cyfr).');
      return;
    }

    const res = await revealLead(buyerName, buyerPhone, offerPrice);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={isSubmitting ? undefined : closeModal} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-7 text-white z-10 space-y-5 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Odblokuj kontakt do klienta
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bezpośredni numer do właściciela ({customerName || 'Klient'})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance Badges */}
        <div className="grid grid-cols-3 gap-2 py-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold">Odkrycie od ręki</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold">0 zł opłat</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold">Brak pośredników</span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Nazwa Twojego skupu / firmy / Imię</span>
              <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="np. Auto-Skup Poznań lub Jan Kowalski"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Twój numer telefonu (dla skupu)</span>
              <span className="text-emerald-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              placeholder="np. 600 123 456"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="text-[10px] text-slate-500 block">
              Zostanie zapamiętany na Twoim urządzeniu na przyszłość.
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-slate-400" />
                <span>Wstępna deklaracja odkupu gotówką (opcjonalnie)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-semibold">Opcjonalne</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="np. 10000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors pr-10"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                zł
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Pozwala Danielowi i systemowi dopasować ten lead bezpośrednio do Ciebie.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-white font-black text-sm tracking-wide shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pobieram numer klienta...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pobierz kontakt i zadzwoń (Bezpłatnie 0 zł)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
