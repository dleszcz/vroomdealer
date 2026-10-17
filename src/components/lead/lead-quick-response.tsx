'use client';

import React, { useState, useId } from 'react';
import { MessageSquare, Send, Copy, Check, TrendingDown, XCircle, Sparkles } from 'lucide-react';

interface LeadQuickResponseProps {
  vehicleTitle: string;
  brandLabel: string;
  customerName: string;
  customerPhone: string;
}

export const LeadQuickResponse: React.FC<LeadQuickResponseProps> = ({
  vehicleTitle,
  brandLabel,
  customerName,
  customerPhone,
}) => {
  const [activeTab, setActiveTab] = useState<'counter' | 'reject'>('counter');
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const inputId = useId();

  const cleanPhone = customerPhone.replace(/\D/g, '');
  const greeting = customerName && customerName !== 'Klient' && customerName !== 'Brak'
    ? `Dzień dobry, Panie/Pani ${customerName}`
    : 'Dzień dobry';

  const counterMessage = offerPrice.trim()
    ? `${greeting}, w nawiązaniu do zgłoszenia ${vehicleTitle} w serwisie ${brandLabel}. Po analizie stanu i kosztów przygotowania, możemy zaproponować pewne ${offerPrice.trim()} zł płatne gotówką od ręki z odbiorem pod Pana domem. Jeśli zależy Panu na szybkiej i bezpiecznej transakcji bez marudnych oglądaczy – proszę o odpowiedź lub kontakt telefoniczny.`
    : `${greeting}, w nawiązaniu do zgłoszenia ${vehicleTitle} w serwisie ${brandLabel}. Chętnie odkupimy auto za gotówkę od ręki z odbiorem pod domem. Proszę o informację, jaka ostateczna kwota gotówką wchodziłaby w grę?`;

  const rejectMessage = `${greeting}, dziękujemy za zgłoszenie ${vehicleTitle} w serwisie ${brandLabel}. W tym momencie nasi lokalni partnerzy nie mają wolnych mocy na odkup tego konkretnego modelu/rocznika. Życzymy udanej i bezproblemowej sprzedaży!`;

  const currentMessage = activeTab === 'counter' ? counterMessage : rejectMessage;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Build SMS URI (iOS uses &body=, Android/others use ?body=, ?&body= works across most)
  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const smsSeparator = isIos ? '&body=' : '?body=';
  const smsHref = `sms:${cleanPhone}${smsSeparator}${encodeURIComponent(currentMessage)}`;
  const whatsappHref = `https://wa.me/48${cleanPhone}?text=${encodeURIComponent(currentMessage)}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-4 text-left shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Szybka odpowiedź z telefonu (0 zł kosztów)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Wysyłasz ze swojego telefonu przez SMS lub WhatsApp. Klient odpisze bezpośrednio do Ciebie.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('counter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'counter'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
            <span>Kontroferta</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reject')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reject'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Uprzejma odmowa</span>
          </button>
        </div>
      </div>

      {activeTab === 'counter' && (
        <div className="space-y-2">
          <label htmlFor={inputId} className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Twoja maksymalna propozycja gotówkowa (zł):</span>
            <span className="text-[11px] text-slate-400 font-normal">Wstawia kwotę do treści SMS</span>
          </label>
          <div className="relative">
            <input
              id={inputId}
              type="text"
              inputMode="numeric"
              placeholder="np. 14 000"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full h-11 px-3.5 pr-12 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:border-slate-900 focus:outline-none transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
              PLN
            </span>
          </div>
        </div>
      )}

      {/* Podgląd generowanej wiadomości */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Podgląd wiadomości do klienta:
          </span>
          <span className="text-slate-400 font-mono text-[10px]">{currentMessage.length} zn.</span>
        </div>
        <p className="leading-relaxed text-slate-800 italic select-all">
          “{currentMessage}”
        </p>
      </div>

      {/* Przyciski akcji (SMS, WhatsApp, Kopiuj) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <a
          href={smsHref}
          className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 text-center cursor-pointer"
        >
          <Send className="w-4 h-4 text-emerald-400" />
          <span>Otwórz w SMS</span>
        </a>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 text-center cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>Wyślij WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Skopiowano!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Kopiuj treść</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
