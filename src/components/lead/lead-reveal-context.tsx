'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatDisplayPhone } from '@/lib/lead-reveal';

export interface BuyerProfile {
  buyerName: string;
  buyerPhone: string;
}

interface LeadRevealContextType {
  token: string;
  isRevealed: boolean;
  phone: string; // Wyświetlany numer (zamaskowany lub pełny sformatowany)
  cleanPhone: string; // Tylko cyfry (do linków tel: i sms:)
  customerName: string;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  revealLead: (buyerName: string, buyerPhone: string, offerPrice?: string) => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
  buyerProfile: BuyerProfile;
  lastOfferPrice?: string;
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastOfferPrice, setLastOfferPrice] = useState<string>('');
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>({ buyerName: '', buyerPhone: '' });

  // 1. Sprawdź zapisany profil skupu i status odblokowania w localStorage
  useEffect(() => {
    try {
      // Czy ten konkretny lead był już odblokowany na tym urządzeniu?
      const cachedPhone = localStorage.getItem(`vroom_revealed_${token}`);
      if (cachedPhone) {
        setUnmaskedPhone(cachedPhone);
        setIsRevealed(true);
      }

      // Zapamiętany profil skupu / dealera
      const savedProfile = localStorage.getItem('vroom_buyer_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.buyerName || parsed.buyerPhone) {
          setBuyerProfile({
            buyerName: parsed.buyerName || '',
            buyerPhone: parsed.buyerPhone || '',
          });
        }
      }
    } catch {
      // ignore localStorage errors (e.g. private mode)
    }
  }, [token]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const revealLead = useCallback(async (
    buyerName: string,
    buyerPhone: string,
    offerPrice?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!buyerName.trim() || !buyerPhone.trim()) {
      return { success: false, error: 'Wpisz nazwę swojej firmy/skupu oraz numer telefonu.' };
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/lead/reveal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          offerPrice: offerPrice ? offerPrice.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.phone) {
        return {
          success: false,
          error: data.error || 'Nie udało się pobrać kontaktu. Spróbuj ponownie za chwilę.',
        };
      }

      const realPhone = String(data.phone);
      setUnmaskedPhone(realPhone);
      setIsRevealed(true);
      if (offerPrice) {
        setLastOfferPrice(offerPrice.trim());
      }

      // Zapisz w pamięci przeglądarki
      try {
        localStorage.setItem(`vroom_revealed_${token}`, realPhone);
        localStorage.setItem(
          'vroom_buyer_profile',
          JSON.stringify({ buyerName: buyerName.trim(), buyerPhone: buyerPhone.trim() })
        );
        setBuyerProfile({ buyerName: buyerName.trim(), buyerPhone: buyerPhone.trim() });
      } catch {
        // ignore
      }

      setIsModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Błąd połączenia z serwerem.',
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [token]);

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
        isModalOpen,
        openModal,
        closeModal,
        revealLead,
        isSubmitting,
        buyerProfile,
        lastOfferPrice,
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
