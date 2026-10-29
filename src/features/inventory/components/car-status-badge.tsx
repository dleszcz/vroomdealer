import React from "react";
import { CheckCircle2, AlertCircle, Clock, Send } from "lucide-react";
import { AutoplacStatus } from "../types";

interface CarStatusBadgeProps {
  isSold: boolean;
  isFeatured: boolean;
  exportToAutoplac?: boolean;
  autoplacStatus?: AutoplacStatus;
}

export function CarStatusBadge({
  isSold,
  isFeatured,
  exportToAutoplac,
  autoplacStatus = "draft",
}: CarStatusBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {isSold ? (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
          Sprzedane
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/70 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-800/50">
          <CheckCircle2 className="h-3 w-3" strokeWidth={1.75} />
          W ofercie
        </span>
      )}

      {isFeatured && !isSold && (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/60 px-2 py-0.5 text-xs font-medium text-amber-300 border border-amber-800/50">
          Wyróżnione
        </span>
      )}

      {exportToAutoplac && (
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border ${
            autoplacStatus === "synced"
              ? "bg-sky-950/60 text-sky-300 border-sky-800/50"
              : autoplacStatus === "ready"
              ? "bg-indigo-950/60 text-indigo-300 border-indigo-800/50"
              : autoplacStatus === "error"
              ? "bg-rose-950/60 text-rose-300 border-rose-800/50"
              : "bg-slate-800/80 text-slate-400 border-slate-700"
          }`}
          title={`Status Autoplac: ${autoplacStatus}`}
        >
          {autoplacStatus === "synced" ? (
            <CheckCircle2 className="h-3 w-3" strokeWidth={1.75} />
          ) : autoplacStatus === "ready" ? (
            <Send className="h-3 w-3" strokeWidth={1.75} />
          ) : autoplacStatus === "error" ? (
            <AlertCircle className="h-3 w-3" strokeWidth={1.75} />
          ) : (
            <Clock className="h-3 w-3" strokeWidth={1.75} />
          )}
          Autoplac
        </span>
      )}
    </div>
  );
}
