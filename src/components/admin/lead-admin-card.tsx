'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Fuel, 
  MapPin, 
  Gauge, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  Send, 
  ChevronDown, 
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Sparkles,
  Info,
  Building2,
  Eye,
} from 'lucide-react';

import { generateBuyerPitch, extractExtras } from '@/lib/pitch-template';
import { assessMarketPrice, parsePriceAmount, getOtomotoSearchUrl, getOlxSearchUrl } from '@/lib/market-pricing';
import { getAiValuationAction } from '@/app/admin/actions';
import type { AiValuationResult } from '@/lib/ai-valuation';
import { parseBuyerReveals, stripRevealTags } from '@/lib/lead-reveal';
import { formatLocation } from '@/lib/location-resolver';

interface LeadAdminCardProps {

  lead: any;
  onStatusChange?: (leadId: string, newStatus: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; icon: any }> = {
  new: { label: 'Nowe', badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: Clock },
  sent_to_buyer: { label: 'Wysłane', badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: Truck },
  bought: { label: 'Kupione', badgeClass: 'text-white bg-emerald-600 border-emerald-500', icon: CheckCircle2 },
  rejected: { label: 'Odrzucone', badgeClass: 'text-slate-400 bg-slate-800 border-slate-700', icon: XCircle },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 60) {
    return `${Math.max(1, diffMins)} min temu`;
  }
  if (diffHours < 24 && now.getDate() === date.getDate()) {
    return `Dzisiaj, ${date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.getDate() === date.getDate()) {
    return `Wczoraj, ${date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const LeadAdminCard: React.FC<LeadAdminCardProps> = ({ lead, onStatusChange }) => {
  const [copied, setCopied] = useState(false);
  const [copiedLeadUrl, setCopiedLeadUrl] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(lead.status || 'new');

  // Extract mileage, power
  const mileageMatch = lead.condition_notes?.match(/Przebieg:\s*([0-9\s]+(?:\s*km)?)/i);
  const mileage = lead.mileage || (mileageMatch ? mileageMatch[1].trim() : null);

  // Parse price for market assessment
  const numericPrice = parsePriceAmount(lead.price_bracket, lead.condition_notes);
  const assessment = assessMarketPrice(lead.make_model, lead.year, numericPrice);

  const token = lead.access_token || lead.id;
  const leadUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? `${window.location.origin}/${token}`
    : `https://scout.vroomdealer.pl/${token}`;

  const pitchMessage = generateBuyerPitch(lead, leadUrl);
  const cleanPhone = (lead.customer_phone || '').replace(/\D/g, '');

  const otomotoUrl = getOtomotoSearchUrl(lead.make_model, lead.year, lead.fuel);
  const olxUrl = getOlxSearchUrl(lead.make_model, lead.year);

  // Handle Share (iOS Native Share Sheet)
  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Oferta odkupu: ${lead.make_model} (${lead.year})`,
          text: pitchMessage,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyPitch(e);
    }
  };

  const handleCopyPitch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(pitchMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusSelect = (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    setCurrentStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(lead.id, newStatus);
    }
  };

  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const smsHref = `sms:${isIos ? '&body=' : '?body='}${encodeURIComponent(pitchMessage)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(pitchMessage)}`;

  const currentStatusObj = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
  const StatusIcon = currentStatusObj.icon;

  const buyerReveals = parseBuyerReveals(lead.condition_notes);
  const cleanNotes = stripRevealTags(lead.condition_notes);
  const extras = extractExtras(cleanNotes);
  const hasNoInsurance = cleanNotes.includes('BRAK WAŻNEGO OC');
  const hasNoMot = cleanNotes.includes('BRAK WAŻNEGO PRZEGLĄDU');

  // AI Valuation State (cached per lead in localStorage)
  const [aiValuation, setAiValuation] = useState<AiValuationResult | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`vroom_ai_val_${lead.id}`);
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [loadingAi, setLoadingAi] = useState(false);

  const handleLoadAiValuation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loadingAi) return;
    setLoadingAi(true);
    try {
      const res = await getAiValuationAction(lead);
      if (res.success && res.valuation) {
        setAiValuation(res.valuation);
        try {
          localStorage.setItem(`vroom_ai_val_${lead.id}`, JSON.stringify(res.valuation));
        } catch {}
      }
    } catch (err) {
      console.error('Błąd wyceny AI:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  return (

    <div className={`transition-colors border-b border-slate-800/80 ${isExpanded ? 'bg-slate-900/60' : 'hover:bg-slate-900/30'}`}>
      {/* ========================================================
          KOMPAKTOWY WIERSZ (CLEAN LINEAR / STRIPE LIST ITEM)
      ======================================================== */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="py-3 px-3.5 sm:px-4 cursor-pointer select-none space-y-1.5"
      >
        {/* Row 1: Time, Source, Status */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 font-mono text-slate-400">
            <span>{formatTimeAgo(lead.created_at)}</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-sans font-medium">
              {lead.source_domain || 'AutoZglowy.pl'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {buyerReveals.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1"
                title="Skup odkrył pełny numer telefonu klienta"
              >
                <Eye className="w-2.5 h-2.5" />
                <span>Odkryto ({buyerReveals[buyerReveals.length - 1].timestamp})</span>
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold flex items-center gap-1 ${currentStatusObj.badgeClass}`}>
              <StatusIcon className="w-2.5 h-2.5" />
              <span>{currentStatusObj.label}</span>
            </span>

            <ChevronDown 
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-400' : ''}`} 
            />
          </div>
        </div>

        {/* Row 2: Title & Specs on left, Price & Market Assessment aligned right */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {lead.make_model} <span className="text-slate-400 font-normal text-xs">({lead.year})</span>
            </h2>

            <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400 font-medium">
              <span className="text-slate-300 font-semibold">{formatLocation(lead.city)}</span>
              <span className="text-slate-600">•</span>
              <span className="uppercase text-[11px] text-slate-400">{lead.fuel}</span>
              {cleanNotes.includes('Pilna sprzedaż') && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-extrabold text-[11px]">⚡ Pilnie (1–3 dni)</span>
                </>
              )}
              {cleanNotes.includes('Sprzedaż w ciągu 2 tygodni') && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-blue-400 font-medium text-[11px]">🗓️ W 2 tyg.</span>
                </>
              )}
              {mileage && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {mileage.includes('km') ? mileage : `${mileage} km`}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-right shrink-0 space-y-0.5">
            <span className={`text-sm sm:text-base font-black block ${numericPrice ? 'text-emerald-400' : 'text-slate-300'}`}>
              {numericPrice ? (lead.price_bracket || `${numericPrice.toLocaleString('pl-PL')} zł`) : 'Czeka na wycenę'}
            </span>
            {numericPrice ? (
              <span className={`text-[11px] font-bold block ${
                assessment.status === 'deal' 
                  ? 'text-emerald-400' 
                  : assessment.status === 'fair' 
                  ? 'text-amber-400' 
                  : assessment.status === 'overpriced' 
                  ? 'text-red-400' 
                  : 'text-slate-400'
              }`}>
                {assessment.badgeLabel}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-500 block">
                Brak oczekiwanej kwoty
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          ROZWINIĘTE SZCZEGÓŁY (CZYSTA TYPOGRAFIA BEZ "CARDS IN CARDS")
      ======================================================== */}
      {isExpanded && (
        <div className="px-3.5 sm:px-4 pb-4 pt-1 space-y-3.5 border-t border-slate-800/60 animate-fadeIn">
          {/* Status Switcher Tabs (Flat inline) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Zmień status:
            </span>
            <div className="flex flex-wrap gap-1">
              {Object.entries(STATUS_CONFIG).map(([stKey, stObj]) => {
                const isActive = currentStatus === stKey;
                return (
                  <button
                    key={stKey}
                    type="button"
                    onClick={(e) => handleStatusSelect(e, stKey)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <stObj.icon className="w-3 h-3" />
                    <span>{stObj.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details (Clean key-value lines with subtle accent) */}
          <div className="border-l-2 border-slate-700 pl-3 space-y-1.5 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 font-medium">Stan auta: </span>
              <span className="text-white font-semibold">
                {lead.condition === 'bardzo_dobry' ? 'Bardzo dobry (sprawny)' : lead.condition}
              </span>
              <span className="text-slate-500 mx-1.5">•</span>
              <span className={hasNoInsurance ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {hasNoInsurance ? 'Brak OC (laweta)' : 'OC ważne'}
              </span>
              <span className="text-slate-500 mx-1.5">•</span>
              <span className={hasNoMot ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                {hasNoMot ? 'Brak przeglądu' : 'Przegląd ważny'}
              </span>
            </div>

            {extras && (
              <div>
                <span className="text-slate-400 font-medium">Uwagi zgłoszone: </span>
                <span className="text-slate-200">{extras}</span>
              </div>
            )}

            <div>
              <span className="text-slate-400 font-medium">Sprzedający: </span>
              <span className="text-white font-bold">{lead.customer_name || 'Klient'}</span>
              <span className="text-slate-500 mx-1.5">•</span>
              <a
                href={`tel:${cleanPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-emerald-400 hover:underline font-mono font-bold inline-flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{lead.customer_phone}</span>
              </a>
            </div>

            {/* Bezpośredni link do karty leada */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-slate-400 font-medium">Link do leada: </span>
              <a
                href={leadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-400 hover:underline font-mono text-[11px] font-semibold inline-flex items-center gap-1"
              >
                <span>{leadUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator?.clipboard) {
                    navigator.clipboard.writeText(leadUrl);
                    setCopiedLeadUrl(true);
                    setTimeout(() => setCopiedLeadUrl(false), 2000);
                  }
                }}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors cursor-pointer"
              >
                {copiedLeadUrl ? 'Skopiowano!' : 'Kopiuj'}
              </button>
            </div>

            {/* Market Valuation & Otomoto / OLX search links */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-400">
                {numericPrice ? assessment.description : 'Klient nie podał kwoty – czeka na propozycję odkupu.'}
              </span>
              <span className="text-slate-600">|</span>
              <a
                href={otomotoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-red-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Otomoto ↗</span>
              </a>
              <a
                href={olxUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-teal-400 hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>OLX ↗</span>
              </a>
            </div>
          </div>

          {/* Sekcja statusu odkrycia kontaktu przez skup */}
          {buyerReveals.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Status kontaktu: Odkryty przez skup ({buyerReveals.length}x)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">99% szans na kontakt</span>
              </div>
              <div className="space-y-1.5">
                {buyerReveals.map((buyer, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">
                          {buyer.buyerName || 'Skup aut (kliknięcie w link)'}
                        </span>
                        {buyer.offerPrice && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                            Oferta: {buyer.offerPrice} zł
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Odkryto numer telefonu: <strong className="text-slate-300">{buyer.timestamp}</strong>
                      </span>
                    </div>
                    {buyer.buyerPhone && (
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${buyer.buyerPhone.replace(/\D/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{buyer.buyerPhone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sekcja Mikro-Wyceny AI (Flat, clean styling bez kart w kartach) */}
          <div className="space-y-2 pt-0.5">
            {!numericPrice ? (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">ℹ️</span>
                  <span>Klient nie podał kwoty – kalkulacja marży i wycena wyłączona</span>
                </div>
                <span className="text-[11px] text-blue-400 font-semibold">Użyj „Zainteresowanie” w SMS</span>
              </div>
            ) : !aiValuation ? (
              <button
                type="button"
                onClick={handleLoadAiValuation}
                disabled={loadingAi}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wycena handlowa & zysk skupu AI</span>
                </div>
                <span className="text-[11px] text-amber-400 font-bold">
                  {loadingAi ? 'Analizuję rynek...' : 'Oblicz ⚡'}
                </span>
              </button>
            ) : (

              <div className="border-l-2 border-amber-500 pl-3 py-1 space-y-2 text-xs">
                {/* Header: Rating & Source Badge */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>{aiValuation.ratingLabel}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    aiValuation.source === 'gemini'
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      : aiValuation.source === 'quota_fallback'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  }`}>
                    {aiValuation.methodLabel || (aiValuation.source === 'gemini' ? '⚡ Gemini Flash' : '📐 Algorytm Vroom (0 zł)')}
                  </span>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sugerowany odkup skupu:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">{aiValuation.suggestedBuyPrice}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Średnia detaliczna rynek:</span>
                    <span className="font-bold text-slate-200 font-mono text-sm">{aiValuation.estimatedMarketPrice}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/40 px-2 py-1 rounded border border-slate-800/60">
                  <span>Szacowana marża skupu:</span>
                  <span className="font-bold text-emerald-400">{aiValuation.profitMargin}</span>
                </div>

                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {aiValuation.verdict}
                </p>


                {/* Informacja jak to liczymy */}
                {aiValuation.methodDescription && (
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300 font-semibold">Jak to liczymy: </strong>
                      {aiValuation.methodDescription}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                  <span>Kierunek: <span className="text-slate-300 font-medium">{aiValuation.targetAudience}</span></span>
                  <button
                    type="button"
                    onClick={handleLoadAiValuation}
                    disabled={loadingAi}
                    className="text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                  >
                    <span>{loadingAi ? 'Kalkuluję...' : 'Przelicz ponownie ↺'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Sekcja Oferty dla skupu (Flat minimal container) */}

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Send className="w-3 h-3" />
                <span>Oferta dla skupu (gotowa treść):</span>
              </span>
              <a
                href={leadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-white inline-flex items-center gap-1"
              >
                <span>Karta ze zdjęciami ↗</span>
              </a>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 whitespace-pre-line leading-relaxed select-all">
              {pitchMessage}
            </div>

            {/* Przyciski wysyłki (Flat responsive grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Udostępnij (Messenger, WhatsApp, SMS)"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Udostępnij</span>
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="py-2 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={smsHref}
                onClick={(e) => e.stopPropagation()}
                className="py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>SMS</span>
              </a>

              <button
                type="button"
                onClick={handleCopyPitch}
                className="py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Skopiowano</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kopiuj</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
