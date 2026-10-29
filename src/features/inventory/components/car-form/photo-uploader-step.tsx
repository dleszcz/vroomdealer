"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, X, Plus, Link as LinkIcon } from "lucide-react";

interface PhotoUploaderStepProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  errors?: Record<string, string>;
}

export function PhotoUploaderStep({
  photos,
  onChange,
  errors = {},
}: PhotoUploaderStepProps) {
  const [urlInput, setUrlInput] = useState("");
  const [showUrlField, setShowUrlField] = useState(false);

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed || !trimmed.startsWith("http")) return;
    onChange([...photos, trimmed]);
    setUrlInput("");
    setShowUrlField(false);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    onChange(photos.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Galeria zdjęć ({photos.length})</h4>
          <p className="text-xs text-slate-400">Pierwsze zdjęcie będzie zdjęciem głównym w ofercie i na Autoplac.pl.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <LinkIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          {showUrlField ? "Ukryj URL" : "Dodaj link URL"}
        </button>
      </div>

      {showUrlField && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Wklej bezpośredni adres URL zdjęcia (https://...)"
            className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors"
          >
            Dodaj
          </button>
        </div>
      )}

      {/* Siatka zdjęć */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-video rounded-lg overflow-hidden bg-slate-800 border border-slate-700/80"
            >
              <Image
                src={url}
                alt={`Zdjęcie pojazdu ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
                unoptimized
              />
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Główne
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                aria-label={`Usuń zdjęcie ${index + 1}`}
                className="absolute top-1.5 right-1.5 rounded-full bg-black/75 p-1 text-slate-300 opacity-90 hover:text-white hover:bg-rose-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
          <Upload className="h-8 w-8 text-slate-500 mb-2" strokeWidth={1.75} />
          <p className="text-xs text-slate-400 mb-1">Brak dodanych zdjęć</p>
          <p className="text-[11px] text-slate-500">Wklej linki do zdjęć za pomocą przycisku „Dodaj link URL” powyżej.</p>
        </div>
      )}

      {errors.images && <p className="text-xs text-rose-400">{errors.images}</p>}
    </div>
  );
}
