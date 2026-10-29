import React from "react";

export function CarsTableSkeleton() {
  return (
    <div className="w-full space-y-3">
      {/* Pasek narzędzi skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="h-10 w-full sm:w-64 rounded-lg bg-slate-800/60 animate-pulse border border-slate-700/50" />
        <div className="h-10 w-full sm:w-36 rounded-lg bg-slate-800/60 animate-pulse border border-slate-700/50" />
      </div>

      {/* Tabela skeleton */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 px-4 py-3 bg-slate-900/80">
          <div className="h-4 w-40 rounded bg-slate-800 animate-pulse" />
        </div>
        <div className="divide-y divide-slate-800/60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5">
              <div className="h-14 w-20 flex-shrink-0 rounded-md bg-slate-800 animate-pulse" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-slate-800 animate-pulse" />
                <div className="h-3 w-1/4 rounded bg-slate-800/60 animate-pulse" />
              </div>
              <div className="h-6 w-20 rounded bg-slate-800/80 animate-pulse" />
              <div className="h-5 w-24 rounded bg-slate-800 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded bg-slate-800 animate-pulse" />
                <div className="h-8 w-8 rounded bg-slate-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
