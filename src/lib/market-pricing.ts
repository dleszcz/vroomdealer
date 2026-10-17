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
 * Wyciąga czystą liczbę kwoty ze stringa np. "35 000 zł (do negocjacji)" -> 35000
 */
export function parsePriceAmount(priceStr?: string | null, notes?: string | null): number | null {
  const sources = [priceStr, notes].filter(Boolean) as string[];
  for (const text of sources) {
    const match = text.match(/(?:kwota|cena|oczekiwana)?[:\s]*([0-9\s]{4,7})\s*(?:zł|pln)?/i);
    if (match && match[1]) {
      const cleanNum = parseInt(match[1].replace(/\s+/g, ''), 10);
      if (!isNaN(cleanNum) && cleanNum >= 1000 && cleanNum <= 1000000) {
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
      description: 'Klient nie podał kwoty lub oczekuje propozycji od skupu.',
    };
  }

  // Szacunkowa siatka wartości w zależności od rocznika i prestiżu marki
  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - year);

  const titleLower = makeAndModel.toLowerCase();
  const isPremium = /mercedes|bmw|audi|porsche|lexus|volvo/i.test(titleLower);
  const isSuv = /kuga|qashqai|tiguan|rav4|sportage|tucson|cr-v|x3|x5|q5|glc/i.test(titleLower);
  const isBudget = /dacia|fiat|punto|corsa|clio|fabia|yaris|seicento/i.test(titleLower);

  // Bazowa wartość rynkowa (mediana)
  let baseNewPrice = 135000;
  if (isPremium) baseNewPrice = 220000;
  if (isSuv) baseNewPrice = 160000;
  if (isBudget) baseNewPrice = 75000;

  // Uproszczona krzywa amortyzacji
  const residualPercentage = Math.max(0.08, Math.pow(0.85, age));
  const estimatedMarket = Math.round((baseNewPrice * residualPercentage) / 1000) * 1000;

  const diffRatio = (clientPrice - estimatedMarket) / estimatedMarket;
  const percentage = Math.round(Math.abs(diffRatio) * 100);

  if (diffRatio <= -0.15) {
    return {
      status: 'deal',
      badgeLabel: `🔥 Okazja (~${percentage}% poniżej rynku)`,
      badgeClass: 'bg-emerald-500 text-white border-emerald-600 shadow-xs',
      description: `Szacowana rynkowa: ~${estimatedMarket.toLocaleString('pl-PL')} zł. Cena klienta daje duży margines zysku.`,
      estimatedMarketPrice: estimatedMarket,
      percentageDiff: -percentage,
    };
  }

  if (diffRatio > -0.15 && diffRatio <= 0.12) {
    return {
      status: 'fair',
      badgeLabel: '⚖️ Cena rynkowa (średnia)',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      description: `W granicach średniej (~${estimatedMarket.toLocaleString('pl-PL')} zł). Standardowa baza do negocjacji.`,
      estimatedMarketPrice: estimatedMarket,
      percentageDiff: percentage,
    };
  }

  return {
    status: 'overpriced',
    badgeLabel: `⚠️ Zawyżona (~${percentage}% powyżej rynku)`,
    badgeClass: 'bg-red-100 text-red-900 border-red-300',
    description: `Klient oczekuje powyżej średniej rynkowej (~${estimatedMarket.toLocaleString('pl-PL')} zł). Wymaga zbicia ceny.`,
    estimatedMarketPrice: estimatedMarket,
    percentageDiff: percentage,
  };
}
