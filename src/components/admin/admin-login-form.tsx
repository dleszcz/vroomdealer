'use client';

import React, { useState, useTransition } from 'react';
import { loginWithPinAction } from '@/app/admin/actions';
import { KeyRound, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export const AdminLoginForm: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(val);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setError('Wprowadź pełny 6-cyfrowy kod PIN');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set('pin', pin);
      formData.set('email', 'danielxleszczynski@gmail.com');

      const result = await loginWithPinAction(null, formData);
      if (result && !result.success) {
        setError(result.error || 'Nieprawidłowy PIN');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* PIN Input */}
      <div className="space-y-1.5">
        <label htmlFor="admin-pin" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Twój 6-cyfrowy kod PIN
        </label>
        <div className="relative">
          <input
            id="admin-pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
            value={pin}
            onChange={handlePinChange}
            placeholder="••••••"
            className="w-full h-13 text-center text-2xl font-mono tracking-[0.5em] px-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
          <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pin.length !== 6 || isPending}
        className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
          pin.length === 6 && !isPending
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-98'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Weryfikacja...</span>
          </>
        ) : (
          <>
            <span>Zaloguj do dashboardu</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
