'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface LeadGalleryProps {
  photoUrls: string[];
  vehicleTitle: string;
  cleanPhone?: string;
  brandLabel: string;
}

export const LeadGallery: React.FC<LeadGalleryProps> = ({
  photoUrls,
  vehicleTitle,
  cleanPhone,
  brandLabel,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const hasPhotos = Array.isArray(photoUrls) && photoUrls.length > 0;

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % photoUrls.length);
  }, [selectedIndex, photoUrls.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + photoUrls.length) % photoUrls.length);
  }, [selectedIndex, photoUrls.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex, handleClose, handleNext, handlePrev]);

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const whatsappPhotosPrompt = encodeURIComponent(
    `Dzień dobry, kontaktuję się z ${brandLabel} w sprawie wyceny i odkupu ${vehicleTitle}. Czy mógłby Pan/Pani podesłać tutaj 3-4 zdjęcia auta (przód, boki, wnętrze)? Pozdrawiam!`
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Camera className="w-4 h-4 text-slate-500" />
          <span>Zdjęcia pojazdu {hasPhotos ? `(${photoUrls.length})` : '(Brak)'}</span>
        </h2>
      </div>

      {hasPhotos ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {photoUrls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-4/3 block shadow-xs hover:border-slate-400 hover:shadow-md transition-all bg-slate-100 text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Zdjęcie pojazdu #${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-2xs">
                <span>Powiększ</span>
              </div>
              <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                #{i + 1}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Klient nie załączył zdjęć w formularzu
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Większość sprzedających posiada zdjęcia w telefonie. Poproś o podesłanie kilku fotek na WhatsApp lub MMS.
            </p>
          </div>
          {cleanPhone && (
            <a
              href={`https://wa.me/48${cleanPhone}?text=${whatsappPhotosPrompt}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Poproś o zdjęcia na WhatsApp</span>
            </a>
          )}
        </div>
      )}

      {/* LIGHTBOX / FULLSCREEN MODAL */}
      {selectedIndex !== null && hasPhotos && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in"
          onClick={handleClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-semibold">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-bold">
                {selectedIndex + 1} / {photoUrls.length}
              </span>
              <span className="hidden sm:inline text-white/70 truncate max-w-md">
                {vehicleTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={photoUrls[selectedIndex]}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Otwórz oryginalne zdjęcie w pełnym rozmiarze"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
                title="Zamknij galerię (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {photoUrls.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                aria-label="Poprzednie zdjęcie"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Current Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrls[selectedIndex]}
              alt={`Zdjęcie pojazdu #${selectedIndex + 1}`}
              className="max-h-[80vh] max-w-[95vw] sm:max-w-[85vw] object-contain rounded-xl shadow-2xl transition-all"
            />

            {/* Next Button */}
            {photoUrls.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                aria-label="Następne zdjęcie"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {photoUrls.length > 1 && (
            <div
              className="px-4 py-3 bg-black/40 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {photoUrls.map((thumbUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedIndex === idx
                      ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-500/20'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
