'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatDisplayPhone } from '@/lib/lead-reveal';

interface LeadRevealContextType {
  token: string;
  isRevealed: boolean;
  phone: string; // Wyświetlany numer (zamaskowany lub pełny sformatowany)
  cleanPhone: string; // Tylko cyfry (do linków tel: i sms:)
  customerName: string;
  revealLead: () => Promise<{ success: boolean; phone?: string; error?: string }>;
  isRevealing: boolean;
}

const LeadRevealContext = createContext<LeadRevealContextType | null>(null);

interface LeadRevealProviderProps {
  token: string;
  initialMaskedPhone: string;
  customerName: string;
  children: React.ReactNode;
}

export const LeadRevealProvider: React.FC<LeadRevealProviderProps> = ({
  token,
  initialMaskedPhone,
  customerName,
  children,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [unmaskedPhone, setUnmaskedPhone] = useState<string>('');
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  // 1. Sprawdź, czy lead był już wcześniej odkryty na tym urządzeniu
  useEffect(() => {
    try {
      const cachedPhone = localStorage.getItem(`vroom_revealed_${token}`);
      if (cachedPhone) {
        setUnmaskedPhone(cachedPhone);
        setIsRevealed(true);
      }
    } catch {
      // ignore localStorage errors (np. tryb incognito)
    }
  }, [token]);

  // 2. 1-kliknięcie: bezpośrednie odkrycie numeru i zarejestrowanie w bazie
  const revealLead = useCallback(async (): Promise<{ success: boolean; phone?: string; error?: string }> => {
    // Jeśli już odkryty, nic nie rób
    if (isRevealed && unmaskedPhone) {
      return { success: true, phone: unmaskedPhone };
    }

    setIsRevealing(true);
    try {
      const res = await fetch('/api/lead/reveal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.phone) {
        return {
          success: false,
          error: data.error || 'Nie udało się odkryć numeru. Spróbuj ponownie.',
        };
      }

      const realPhone = String(data.phone);
      setUnmaskedPhone(realPhone);
      setIsRevealed(true);

      try {
        localStorage.setItem(`vroom_revealed_${token}`, realPhone);
      } catch {
        // ignore
      }

      return { success: true, phone: realPhone };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Błąd połączenia z serwerem.',
      };
    } finally {
      setIsRevealing(false);
    }
  }, [token, isRevealed, unmaskedPhone]);

  const displayPhone = isRevealed && unmaskedPhone
    ? formatDisplayPhone(unmaskedPhone)
    : initialMaskedPhone;

  const cleanPhone = (isRevealed && unmaskedPhone ? unmaskedPhone : '').replace(/\D/g, '');

  return (
    <LeadRevealContext.Provider
      value={{
        token,
        isRevealed,
        phone: displayPhone,
        cleanPhone,
        customerName,
        revealLead,
        isRevealing,
      }}
    >
      {children}
    </LeadRevealContext.Provider>
  );
};

export function useLeadReveal() {
  const ctx = useContext(LeadRevealContext);
  if (!ctx) {
    throw new Error('useLeadReveal must be used within a LeadRevealProvider');
  }
  return ctx;
}
