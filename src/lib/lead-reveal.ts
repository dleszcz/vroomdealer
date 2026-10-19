export interface ContactRevealEvent {
  timestamp: string;
  buyerName?: string;
  buyerPhone?: string;
  offerPrice?: string;
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
 * Tworzy znacznik kliknięcia / odkrycia kontaktu przez skup
 */
export function formatClickRevealTag(timestamp?: string): string {
  const ts = timestamp || new Date().toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Warsaw',
  });
  return `[ODKRYCIE KONTAKTU: ${ts}]`;
}

/**
 * Tworzy ustandaryzowany znacznik pobrania kontaktu (wsteczna kompatybilność)
 */
export function formatRevealTag(info: { buyerName?: string; buyerPhone?: string; offerPrice?: string; timestamp?: string }): string {
  if (!info.buyerName && !info.buyerPhone) {
    return formatClickRevealTag(info.timestamp);
  }
  const parts = [
    `POBRANIE KONTAKTU: ${(info.buyerName || 'Skup aut').trim()}`,
    `tel: ${(info.buyerPhone || '').trim()}`,
  ];
  if (info.offerPrice && info.offerPrice.trim()) {
    parts.push(`deklaracja: ${info.offerPrice.trim()} zł`);
  }
  parts.push(info.timestamp || new Date().toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' }));
  return `[${parts.join(' | ')}]`;
}

/**
 * Wyciąga ze stringa condition_notes wszystkie zarejestrowane odkrycia kontaktu (zarówno 1-klik, jak i formularz)
 */
export function parseBuyerReveals(notes?: string | null): ContactRevealEvent[] {
  if (!notes) return [];
  const reveals: ContactRevealEvent[] = [];

  // 1. Dopasowanie 1-klik: [ODKRYCIE KONTAKTU: 19.10 12:45]
  const clickRegex = /\[ODKRYCIE KONTAKTU:\s*([^\]]+)\]/gi;
  let clickMatch;
  while ((clickMatch = clickRegex.exec(notes)) !== null) {
    reveals.push({
      timestamp: clickMatch[1]?.trim() || '',
    });
  }

  // 2. Dopasowanie formularza (wsteczna kompatybilność): [POBRANIE KONTAKTU: Skup | tel: 123 | ...]
  const formRegex = /\[POBRANIE KONTAKTU:\s*([^|]+)\|\s*tel:\s*([^|]+)(?:\|\s*deklaracja:\s*([^|]+))?\|\s*([^\]]+)\]/gi;
  let formMatch;
  while ((formMatch = formRegex.exec(notes)) !== null) {
    reveals.push({
      buyerName: formMatch[1]?.trim() || 'Skup aut',
      buyerPhone: formMatch[2]?.trim() || '',
      offerPrice: formMatch[3]?.trim(),
      timestamp: formMatch[4]?.trim() || '',
    });
  }

  return reveals;
}

/**
 * Usuwa znaczniki pobrania/odkrycia kontaktu z tekstu notatek
 */
export function stripRevealTags(notes?: string | null): string {
  if (!notes) return '';
  return notes
    .replace(/\[ODKRYCIE KONTAKTU:[^\]]+\]/gi, '')
    .replace(/\[POBRANIE KONTAKTU:[^\]]+\]/gi, '')
    .trim();
}
