export interface BuyerRevealInfo {
  buyerName: string;
  buyerPhone: string;
  offerPrice?: string;
  timestamp: string;
}

/**
 * Maskuje numer telefonu klienta (np. "665163268" -> "+48 66• ••• •68")
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '•••••••••';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 9) {
    return '•••••••••';
  }
  const main9 = clean.slice(-9);
  const prefix = clean.length > 9 ? `+${clean.slice(0, clean.length - 9)} ` : '+48 ';
  return `${prefix}${main9.slice(0, 2)}• ••• •${main9.slice(-2)}`;
}

/**
 * Formatuje czysty numer telefonu do eleganckiego widoku (np. "665163268" -> "+48 665 163 268")
 */
export function formatDisplayPhone(phone?: string | null): string {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 9) return phone;
  const main9 = clean.slice(-9);
  const prefix = clean.length > 9 ? `+${clean.slice(0, clean.length - 9)} ` : '+48 ';
  return `${prefix}${main9.slice(0, 3)} ${main9.slice(3, 6)} ${main9.slice(6)}`;
}

/**
 * Tworzy ustandaryzowany znacznik pobrania kontaktu do zapisu w condition_notes
 */
export function formatRevealTag(info: BuyerRevealInfo): string {
  const parts = [
    `POBRANIE KONTAKTU: ${info.buyerName.trim()}`,
    `tel: ${info.buyerPhone.trim()}`,
  ];
  if (info.offerPrice && info.offerPrice.trim()) {
    parts.push(`deklaracja: ${info.offerPrice.trim()} zł`);
  }
  parts.push(info.timestamp || new Date().toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }));
  return `[${parts.join(' | ')}]`;
}

/**
 * Wyciąga ze stringa condition_notes wszystkie zarejestrowane pobrania kontaktu przez skupy
 */
export function parseBuyerReveals(notes?: string | null): BuyerRevealInfo[] {
  if (!notes) return [];
  const regex = /\[POBRANIE KONTAKTU:\s*([^|]+)\|\s*tel:\s*([^|]+)(?:\|\s*deklaracja:\s*([^|]+))?\|\s*([^\]]+)\]/gi;
  const reveals: BuyerRevealInfo[] = [];
  let match;
  while ((match = regex.exec(notes)) !== null) {
    reveals.push({
      buyerName: match[1]?.trim() || 'Skup aut',
      buyerPhone: match[2]?.trim() || '',
      offerPrice: match[3]?.trim(),
      timestamp: match[4]?.trim() || '',
    });
  }
  return reveals;
}

/**
 * Usuwa znaczniki pobrania kontaktu z tekstu notatek
 */
export function stripRevealTags(notes?: string | null): string {
  if (!notes) return '';
  return notes.replace(/\[POBRANIE KONTAKTU:[^\]]+\]/gi, '').trim();
}
