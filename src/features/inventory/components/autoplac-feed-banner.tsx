"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface AutoplacFeedBannerProps {
  feedUrl: string;
}

export function AutoplacFeedBanner({ feedUrl }: AutoplacFeedBannerProps) {
  const [copiedFeed, setCopiedFeed] = useState(false);

  const handleCopyFeed = async () => {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopiedFeed(true);
      setTimeout(() => setCopiedFeed(false), 2000);
    } catch {
      // Fallback w przypadku braku uprawnień schowka
    }
  };

  if (!feedUrl) return null;

  return (
    <div className="rounded-xl border border-sky-900/60 bg-sky-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-xs font-semibold text-sky-200 uppercase tracking-wider mb-0.5">
          Oficjalny Feed XML do portalu Autoplac.pl
        </h3>
        <p className="text-xs text-slate-400 truncate max-w-xl font-mono">{feedUrl}</p>
      </div>
      <button
        type="button"
        onClick={handleCopyFeed}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700 transition-colors shrink-0"
      >
        {copiedFeed ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
            Skopiowano
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
            Kopiuj link do Autoplac
          </>
        )}
      </button>
    </div>
  );
}
