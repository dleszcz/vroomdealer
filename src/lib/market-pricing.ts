/**
 * Moduł wyceny rynkowej pojazdów oraz generowania bezpośrednich linków do Otomoto i OLX
 */

export interface MarketAssessment {
  status: 'deal' | 'fair' | 'overpriced' | 'unpriced';
  badgeLabel: string;
  badgeClass: string;
  description: string;
  estimatedMarketPrice?: number;
  percentageDiff?: number;
}

/**
 * Wyciąga czystą liczbę kwoty oczekiwanej przez klienta ze stringa (np. "35 000 zł (do negocjacji)" -> 35000).
 * Zwraca `null`, gdy klient nie podał kwoty (np. "Czeka na propozycję wyceny", "Do uzgodnienia", brak ceny).
 * NIGDY nie wyciąga liczb z przebiegu (km), mocy (KM) ani innych notatek technicznych.
 */
export function parsePriceAmount(priceStr?: string | null, notes?: string | null): number | null {
  // 1. Sprawdź, czy lead jest jednoznacznie oznaczony jako bez podanej kwoty
  const isExplicitlyUnpriced = (str?: string | null): boolean => {
    if (!str) return false;
    return /czeka|propozycj|uzgodnien|wycen|brak\s*ceny|brak\s*kwoty/i.test(str);
  };

  if (isExplicitlyUnpriced(priceStr)) {
    return null;
  }

  // 2. Jeśli mamy pole priceStr (np. "72000 zł (do negocjacji)" lub "55 000 PLN")
  if (priceStr && priceStr.trim().length > 0) {
    const match = priceStr.match(/(\d[\d\s]{2,8}\d|\d{4,7})/);
    if (match) {
      const cleanNum = parseInt(match[0].replace(/\s+/g, ''), 10);
      if (!isNaN(cleanNum) && cleanNum >= 1000 && cleanNum <= 2000000) {
        return cleanNum;
      }
    }
  }

  // 3. Jeśli priceStr nie zawiera ceny, sprawdzamy condition_notes WYŁĄCZNIE pod kątem wyraźnego znacznika kwoty klienta
  // (np. "Oczekiwana kwota: 55000 zł" lub "Cena klienta: 45 000 PLN")
  // Pod żadnym pozorem NIE dopasowujemy przebiegu (km) ani innych parametrów.
  if (notes && notes.trim().length > 0) {
    const notesMatch = notes.match(/(?:oczekiwana\s*kwota|cena(?:\s*klienta)?|kwota\s*odkupu)[\s:]*([0-9\s]{4,8})\s*(?:zł|pln)/i);
    if (notesMatch && notesMatch[1]) {
      const cleanNum = parseInt(notesMatch[1].replace(/\s+/g, ''), 10);
      if (!isNaN(cleanNum) && cleanNum >= 1000 && cleanNum <= 2000000) {
        return cleanNum;
      }
    }
  }

  return null;
}

/**
 * Generuje bezpośredni link do wyników wyszukiwania Otomoto z filtrami na dany model i rocznik
 */
export function getOtomotoSearchUrl(makeAndModel: string, year: number, fuel?: string): string {
  const parts = (makeAndModel || '').trim().toLowerCase().split(/\s+/);
  const make = parts[0] || '';
  const model = parts.slice(1).join('-') || '';

  const fuelMap: Record<string, string> = {
    diesel: 'diesel',
    benzyna: 'petrol',
    petrol: 'petrol',
    lpg: 'lpg',
    hybryda: 'hybrid',
    hybrid: 'hybrid',
    elektryczny: 'electric',
  };

  const fuelParam = fuel && fuelMap[fuel.toLowerCase()] ? `&search%5Bfilter_enum_fuel_type%5D=${fuelMap[fuel.toLowerCase()]}` : '';

  if (make && model) {
    return `https://www.otomoto.pl/osobowe/${encodeURIComponent(make)}/${encodeURIComponent(model)}/od-${year}?search%5Bfilter_float_year%3Ato%5D=${year}${fuelParam}`;
  }

  return `https://www.otomoto.pl/osobowe?search%5Bfilter_float_year%3Afrom%5D=${year}&search%5Bfilter_float_year%3Ato%5D=${year}&q=${encodeURIComponent(makeAndModel)}`;
}

/**
 * Generuje bezpośredni link do wyników wyszukiwania OLX
 */
export function getOlxSearchUrl(makeAndModel: string, year: number): string {
  return `https://www.olx.pl/motoryzacja/samochody/?q=${encodeURIComponent(makeAndModel)}&search%5Bfilter_float_year%3Afrom%5D=${year}&search%5Bfilter_float_year%3Ato%5D=${year}`;
}

/**
 * Szacuje pozycję ceny względem rynku na bazie rocznika i segmentu
 */
export function assessMarketPrice(
  makeAndModel: string,
  year: number,
  clientPrice: number | null
): MarketAssessment {
  if (!clientPrice || clientPrice <= 0) {
    return {
      status: 'unpriced',
      badgeLabel: 'Czeka na wycenę',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      description: 'Klient nie podał kwoty – czeka na propozycję odkupu.',
    };
  }


  // Szacunkowa siatka wartości w zależności od rocznika i prestiżu marki
  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - year);

  const titleLower = makeAndModel.toLowerCase();
  const isPremium = /mercedes|bmw|audi|porsche|lexus|volvo|jaguar|land rover/i.test(titleLower);
  const isSuv = /kuga|qashqai|tiguan|rav4|sportage|tucson|cr-v|x3|x5|q5|glc/i.test(titleLower);
  const isBudget = /dacia|fiat|punto|corsa|clio|fabia|yaris|seicento|matiz|polo|aygo/i.test(titleLower);

  // Bazowa wartość rynkowa (mediana)
  let baseNewPrice = 135000;
  if (isPremium) baseNewPrice = 220000;
  if (isSuv) baseNewPrice = 160000;
  if (isBudget) baseNewPrice = 75000;

  // Uproszczona krzywa amortyzacji detalicznej
  const residualPercentage = Math.max(0.08, Math.pow(0.85, age));
  const estimatedMarket = Math.round((baseNewPrice * residualPercentage) / 1000) * 1000;

  // Progi skupowe w zależności od wieku (ryzyko awarii i czas rotacji kapitału)
  let buyoutRatio = 0.74;
  if (age >= 16) buyoutRatio = 0.50;
  else if (age >= 11) buyoutRatio = 0.58;
  else if (age >= 6) buyoutRatio = 0.68;

  if (isPremium && age >= 11) {
    buyoutRatio = Math.max(0.42, buyoutRatio - 0.05);
  }

  const safeBuyoutCeiling = Math.round((estimatedMarket * buyoutRatio) / 1000) * 1000;

  const diffRatio = (clientPrice - estimatedMarket) / estimatedMarket;
  const percentage = Math.round(Math.abs(diffRatio) * 100);

  // 1. Okazja dla skupu: cena klienta mieści się w bezpiecznym odkupie skupowym (+/- 5%)
  if (clientPrice <= safeBuyoutCeiling * 1.05) {
    return {
      status: 'deal',
      badgeLabel: `🔥 Okazja pod skup (~${percentage}% poniżej rynku)`,
      badgeClass: 'bg-emerald-500 text-white border-emerald-600 shadow-xs',
      description: `Średnia rynkowa: ~${estimatedMarket.toLocaleString('pl-PL')} zł. Cena klienta daje wysoki margines zysku dla skupu.`,
      estimatedMarketPrice: estimatedMarket,
      percentageDiff: -percentage,
    };
  }

  // 2. Cena w granicach detalicznych (wymaga negocjacji pod skup)
  if (clientPrice <= estimatedMarket * 0.90) {
    return {
      status: 'fair',
      badgeLabel: '⚖️ Baza do negocjacji pod skup',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      description: `Cena klienta (${clientPrice.toLocaleString('pl-PL')} zł) blisko średniej rynkowej (~${estimatedMarket.toLocaleString('pl-PL')} zł). Wymaga zbicia ceny do poziomu skupu (~${safeBuyoutCeiling.toLocaleString('pl-PL')} zł).`,
      estimatedMarketPrice: estimatedMarket,
      percentageDiff: percentage,
    };
  }

  // 3. Cena zawyżona (pełny detal lub powyżej rynku)
  return {
    status: 'overpriced',
    badgeLabel: `⚠️ Zawyżona pod skup (~${percentage}% powyżej)`,
    badgeClass: 'bg-red-100 text-red-900 border-red-300',
    description: `Klient oczekuje ceny detalicznej z ogłoszeń (~${estimatedMarket.toLocaleString('pl-PL')} zł). Bezpieczny odkup dla skupu to max ~${safeBuyoutCeiling.toLocaleString('pl-PL')} zł.`,
    estimatedMarketPrice: estimatedMarket,
    percentageDiff: percentage,
  };
}
