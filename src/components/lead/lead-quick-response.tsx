'use client';

import React, { useState, useId, useMemo, useEffect } from 'react';
import { MessageSquare, Send, Copy, Check, TrendingDown, XCircle, Sparkles, Handshake, Lock } from 'lucide-react';
import { formatPolishGreeting } from '@/lib/greeting';
import { useLeadReveal } from './lead-reveal-context';

interface LeadQuickResponseProps {
  vehicleTitle: string;
  brandLabel: string;
  customerName: string;
  customerPhone?: string;
}

type ResponseTab = 'interest' | 'counter' | 'reject';

export const LeadQuickResponse: React.FC<LeadQuickResponseProps> = ({
  vehicleTitle,
  brandLabel,
  customerName,
  customerPhone: initialCustomerPhone,
}) => {
  const { isRevealed, cleanPhone: revealedCleanPhone, openModal, lastOfferPrice } = useLeadReveal();
  const [activeTab, setActiveTab] = useState<ResponseTab>('interest');
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const inputId = useId();

  // Prefill offer price if dealer entered it in the reveal modal
  useEffect(() => {
    if (lastOfferPrice && lastOfferPrice.trim()) {
      setOfferPrice(lastOfferPrice.trim());
      setActiveTab('counter');
    }
  }, [lastOfferPrice]);

  const cleanPhone = isRevealed && revealedCleanPhone
    ? revealedCleanPhone
    : (initialCustomerPhone || '').replace(/\D/g, '');

  const greeting = useMemo(() => formatPolishGreeting(customerName), [customerName]);

  // 1. Opcja pierwsza: Zainteresowanie (bez konieczności podawania kwoty)
  const defaultInterestMessage = useMemo(() => {
    return `${greeting}, piszę w sprawie ${vehicleTitle}. Zapoznałem się ze zgłoszeniem i jestem zainteresowany odkupem za gotówkę od ręki z odbiorem na miejscu. Jaka ostateczna kwota gotówką wchodzi w grę?`;
  }, [greeting, vehicleTitle]);

  // 2. Opcja druga: Kontroferta z konkretną kwotą
  const defaultCounterMessage = useMemo(() => {
    if (offerPrice.trim()) {
      return `${greeting}, piszę w sprawie ${vehicleTitle}. Zapoznałem się ze zgłoszeniem i mogę zaproponować ${offerPrice.trim()} zł gotówką od ręki z odbiorem na miejscu i prostą umową. Jeśli propozycja Panu/Pani odpowiada – proszę o kontakt lub krótką odpowiedź.`;
    }
    return `${greeting}, piszę w sprawie ${vehicleTitle}. Zapoznałem się ze zgłoszeniem i mogę zaproponować [kwota] zł gotówką od ręki z odbiorem na miejscu i prostą umową. Jeśli propozycja Panu/Pani odpowiada – proszę o kontakt lub krótką odpowiedź.`;
  }, [greeting, vehicleTitle, offerPrice]);

  // 3. Opcja trzecia: Uprzejma odmowa
  const defaultRejectMessage = useMemo(() => {
    return `${greeting}, piszę w sprawie ${vehicleTitle}. Dziękuję za kontakt, jednak przy tym modelu i roczniku nie będę w stanie zaproponować satysfakcjonującej kwoty. Życzę powodzenia w sprzedaży!`;
  }, [greeting, vehicleTitle]);

  const currentDefaultMessage = useMemo(() => {
    if (activeTab === 'interest') return defaultInterestMessage;
    if (activeTab === 'counter') return defaultCounterMessage;
    return defaultRejectMessage;
  }, [activeTab, defaultInterestMessage, defaultCounterMessage, defaultRejectMessage]);

  const currentMessage = customMessage !== null ? customMessage : currentDefaultMessage;

  // Przyciski są zablokowane TYLKO w kontrofercie, dopóki użytkownik nie wpisze kwoty
  const isActionDisabled = activeTab === 'counter' && !offerPrice.trim();

  const handleTabChange = (tab: ResponseTab) => {
    setActiveTab(tab);
    setCustomMessage(null);
  };

  const handlePriceChange = (val: string) => {
    setOfferPrice(val);
    setCustomMessage(null);
  };

  const handleCopy = () => {
    if (isActionDisabled) return;
    if (!isRevealed) {
      openModal();
      return;
    }
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Build SMS URI (iOS uses &body=, Android/others use ?body=)
  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const smsSeparator = isIos ? '&body=' : '?body=';
  const smsHref = `sms:${cleanPhone}${smsSeparator}${encodeURIComponent(currentMessage)}`;
  const whatsappHref = `https://wa.me/48${cleanPhone}?text=${encodeURIComponent(currentMessage)}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-4 text-left shadow-xs">
      {/* Nagłówek sekcji */}
      <div className="border-b border-slate-200/80 pb-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          Szybka odpowiedź z Twojego telefonu
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Wiadomość wyślesz bezpośrednio ze swojego numeru. Klient odpisze wprost do Ciebie.
        </p>
      </div>

      {/* Trzy opcje wyświetlone w nowej linii */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-xl">
        <button
          type="button"
          onClick={() => handleTabChange('interest')}
          className={`py-2 px-1.5 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activeTab === 'interest'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Handshake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">Zainteresowanie</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('counter')}
          className={`py-2 px-1.5 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activeTab === 'counter'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate">Kontroferta</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('reject')}
          className={`py-2 px-1.5 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
            activeTab === 'reject'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">Uprzejma odmowa</span>
        </button>
      </div>

      {/* Pole kwoty – widoczne TYLKO przy opcji Kontroferta */}
      {activeTab === 'counter' && (
        <div className="space-y-2 animate-fadeIn">
          <label htmlFor={inputId} className="text-xs font-bold text-slate-700 block">
            Twoja maksymalna propozycja gotówkowa (zł):
          </label>
          <div className="relative">
            <input
              id={inputId}
              type="text"
              inputMode="numeric"
              placeholder="np. 14 000"
              value={offerPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className={`w-full h-11 px-3.5 pr-12 rounded-xl border bg-white text-slate-900 font-bold text-sm focus:outline-none transition-colors ${
                !offerPrice.trim()
                  ? 'border-amber-300 focus:border-amber-500 ring-2 ring-amber-100'
                  : 'border-slate-300 focus:border-slate-900'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
              PLN
            </span>
          </div>
        </div>
      )}

      {/* Edytor wiadomości z możliwością zmiany treści */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <label htmlFor="quick-response-editor" className="flex items-center gap-1.5 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Treść wiadomości do klienta (możesz edytować):</span>
          </label>
          <div className="flex items-center gap-2">
            {customMessage !== null && (
              <button
                type="button"
                onClick={() => setCustomMessage(null)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                title="Przywróć domyślny szablon"
              >
                <span>Przywróć domyślną</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          id="quick-response-editor"
          rows={3}
          value={currentMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-blue-600 transition-colors shadow-2xs font-sans resize-none"
        />
      </div>

      {/* Info baner o ukrytym numerze jeśli nieodblokowany */}
      {!isRevealed && (
        <div
          onClick={openModal}
          className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer hover:bg-amber-100/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Numer telefonu klienta jest zamaskowany. Pobierz kontakt (0 zł), aby wysłać wiadomość.</span>
          </div>
          <span className="text-[11px] text-amber-900 font-extrabold underline shrink-0">
            Odblokuj ↗
          </span>
        </div>
      )}

      {/* Przyciski wysyłki */}
      <div className="space-y-2 pt-1">
        {isActionDisabled && isRevealed && (
          <p className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="text-amber-600 font-bold shrink-0">💡</span>
            <span>Wpisz kwotę powyżej, aby odblokować przyciski</span>
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {!isRevealed ? (
            <button
              type="button"
              onClick={openModal}
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 text-center cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Odblokuj numer (SMS)</span>
            </button>
          ) : isActionDisabled ? (
            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs sm:text-sm cursor-not-allowed select-none"
              title="Wpisz kwotę powyżej, aby odblokować"
            >
              <Send className="w-4 h-4 text-slate-400" />
              <span>Otwórz w SMS</span>
            </button>
          ) : (
            <a
              href={smsHref}
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 text-center cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Otwórz w SMS</span>
            </a>
          )}

          {!isRevealed ? (
            <button
              type="button"
              onClick={openModal}
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 text-center cursor-pointer"
            >
              <Lock className="w-4 h-4 text-white" />
              <span>Odblokuj (WhatsApp)</span>
            </button>
          ) : isActionDisabled ? (
            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs sm:text-sm cursor-not-allowed select-none"
              title="Wpisz kwotę powyżej, aby odblokować"
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              <span>Wyślij WhatsApp</span>
            </button>
          ) : (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 text-center cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Wyślij WhatsApp</span>
            </a>
          )}

          <button
            type="button"
            disabled={isRevealed && isActionDisabled}
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl border font-bold text-xs sm:text-sm transition-all ${
              isRevealed && isActionDisabled
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 cursor-pointer'
            }`}
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
    </div>
  );
};
