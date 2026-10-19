/**
 * Moduł wyceny i analizy leadów AI (Google Gemini Flash / Algorytmiczny fallback)
 * Gwarantuje 0 zł kosztów – w razie przekroczenia darmowego tieru API automatycznie
 * przełącza się na lokalny silnik algorytmiczny.
 */

import { parsePriceAmount } from './market-pricing';

export interface AiValuationResult {
  suggestedBuyPrice: string; // np. "28 000 - 31 000 zł"
  estimatedMarketPrice: string; // np. "35 000 - 38 000 zł"
  profitMargin: string; // np. "ok. 5 000 - 7 000 zł"
  rating: 'deal' | 'fair' | 'overpriced';
  ratingLabel: string;
  verdict: string;
  negotiationTips?: string[];
  targetAudience: string;
  source: 'gemini' | 'algorithmic_fallback' | 'quota_fallback';
  methodLabel: string;
  methodDescription: string;
}

interface LeadDataForAi {
  id: string;
  make_model: string;
  year: number;
  fuel?: string;
  price_bracket?: string | null;
  condition?: string | null;
  condition_notes?: string | null;
  city?: string | null;
  mileage?: string | null;
}

/**
 * Inteligentny lokalny silnik szacowania (darmowy, 0 zł kosztu)
 * Używany lokalnie, przy braku klucza lub w razie wyczerpania limitu Gemini.
 */
export function generateAlgorithmicValuation(
  lead: LeadDataForAi,
  isQuotaExceeded: boolean = false
): AiValuationResult {
  const numericPrice = parsePriceAmount(lead.price_bracket, lead.condition_notes);

  // Gdy cena nie jest podana przez klienta, NIE robimy wyliczeń, aby nie generować fikcyjnych liczb
  if (!numericPrice || numericPrice <= 0) {
    return {
      suggestedBuyPrice: 'Brak ceny klienta',
      estimatedMarketPrice: 'Czeka na propozycję',
      profitMargin: 'Brak danych',
      rating: 'fair',
      ratingLabel: '❓ Czeka na wycenę (brak kwoty)',
      verdict: 'Klient nie podał oczekiwanej ceny. Wyliczenia marży i zysku są wyłączone, aby nie tworzyć nierealistycznych szacunków. Skontaktuj się ze sprzedającym (użyj szablonu SMS „Zainteresowanie”), aby poznać jego oczekiwania cenowe.',
      negotiationTips: [
        'Wyślij SMS z pytaniem: „Jaka ostateczna kwota gotówką wchodzi w grę?”',
        'Poproś o wyjściową propozycję sprzedawcy przed składaniem własnej kontroferty.',
        'Zbadaj motywację sprzedaży auta przed podaniem wyceny odkupu.'
      ],
      targetAudience: 'Wymaga kontaktu ws. ceny',
      source: isQuotaExceeded ? 'quota_fallback' : 'algorithmic_fallback',
      methodLabel: 'Wyliczenia wstrzymane (brak ceny)',
      methodDescription: 'Gdy klient nie podał oczekiwanej kwoty, wyliczenia marży i kwot odkupu są wyłączone, aby nie podawać nierealistycznych liczb.',
    };
  }

  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - lead.year);
  const titleLower = (lead.make_model || '').toLowerCase();

  const isPremium = /mercedes|bmw|audi|porsche|lexus|volvo|jaguar|land rover/i.test(titleLower);
  const isSuv = /kuga|qashqai|tiguan|rav4|sportage|tucson|cr-v|x3|x5|q5|glc/i.test(titleLower);
  const isBudget = /dacia|fiat|punto|corsa|clio|fabia|yaris|seicento|matiz|polo|aygo/i.test(titleLower);

  const segmentName = isPremium ? 'Premium' : isSuv ? 'SUV' : isBudget ? 'Miejski / Budżetowy' : 'Standardowy';

  let baseNewPrice = 135000;
  if (isPremium) baseNewPrice = 220000;
  if (isSuv) baseNewPrice = 160000;
  if (isBudget) baseNewPrice = 75000;

  // Szacunek średniej ceny detalicznej na Otomoto/OLX
  const residualPercentage = Math.max(0.08, Math.pow(0.85, age));
  const estimatedRetailMedian = Math.round((baseNewPrice * residualPercentage) / 1000) * 1000;

  const retailMin = Math.round((estimatedRetailMedian * 0.93) / 1000) * 1000;
  const retailMax = Math.round((estimatedRetailMedian * 1.07) / 1000) * 1000;

  // 1. Krzywa marży skupowej wg wieku pojazdu (ryzyko awarii i czas rotacji kapitału)
  let buyRatioMin = 0.74;
  let buyRatioMax = 0.80;

  if (age >= 16) {
    // Auta 16+ lat (np. 2008 = 18 lat): skup płaci max 46-54% detalu z powodu ogromnego ryzyka
    buyRatioMin = 0.46;
    buyRatioMax = 0.54;
  } else if (age >= 11) {
    buyRatioMin = 0.54;
    buyRatioMax = 0.62;
  } else if (age >= 6) {
    buyRatioMin = 0.64;
    buyRatioMax = 0.72;
  }

  // 2. Pułapka Starego Niemieckiego Premium (BMW, Audi, Mercedes 11+ lat)
  // Koszty regeneracji skrzyń automatycznych, turbin, wtrysków i elektroniki to 30-50% wartości auta
  if (isPremium && age >= 11) {
    buyRatioMin = Math.max(0.38, buyRatioMin - 0.05);
    buyRatioMax = Math.max(0.46, buyRatioMax - 0.05);
  }

  // 3. Stan techniczny
  let conditionFactor = 1.0;
  const cond = (lead.condition || '').toLowerCase();
  if (cond.includes('drobne') || cond.includes('poprawk')) {
    conditionFactor = 0.88;
  } else if (cond.includes('wymaga') || cond.includes('napraw') || cond.includes('uszkodz')) {
    conditionFactor = 0.70;
  } else if (cond.includes('niesprawn') || cond.includes('powypadk')) {
    conditionFactor = 0.45;
  } else if (cond.includes('dobry')) {
    conditionFactor = 0.95;
  }

  // 4. Potrącenia formalne (OC i badanie techniczne)
  let formalDeduction = 0;
  const notes = (lead.condition_notes || '').toUpperCase();
  if (notes.includes('BRAK WAŻNEGO OC') || notes.includes('BRAK OC')) {
    formalDeduction += 600; // Koszt autolawety
  }
  if (notes.includes('BRAK WAŻNEGO PRZEGLĄDU') || notes.includes('BRAK PRZEGLĄDU')) {
    formalDeduction += 1000; // Ścieżka diagnostyczna i pakiet startowy
  }

  // 5. Kalkulacja kwot odkupu
  let rawBuyMin = estimatedRetailMedian * buyRatioMin * conditionFactor - formalDeduction;
  let rawBuyMax = estimatedRetailMedian * buyRatioMax * conditionFactor - formalDeduction;

  // Minimalna marża kwotowa skupu ("podłoga" opłacalności wyjazdu kierowcy i zamrożenia kapitału)
  let minProfitFloor = 3000;
  if (estimatedRetailMedian >= 100000) minProfitFloor = 8000;
  else if (estimatedRetailMedian >= 40000) minProfitFloor = 5000;
  else if (estimatedRetailMedian >= 20000) minProfitFloor = 4000;

  rawBuyMax = Math.min(rawBuyMax, estimatedRetailMedian - minProfitFloor);
  rawBuyMin = Math.min(rawBuyMin, rawBuyMax - 1000);

  const buyTargetMin = Math.max(1000, Math.round(rawBuyMin / 500) * 500);
  const buyTargetMax = Math.max(buyTargetMin + 1000, Math.round(rawBuyMax / 500) * 500);
  const expectedProfit = Math.round((estimatedRetailMedian - buyTargetMax) / 500) * 500;

  let rating: 'deal' | 'fair' | 'overpriced' = 'fair';
  let ratingLabel = '⚖️ Standardowa baza do negocjacji';
  let verdict = `Płynny model na polskim rynku wtórnym (${lead.make_model}, ${lead.year}). Bezpieczna kwota odkupu dla skupu to ${buyTargetMin.toLocaleString('pl-PL')} – ${buyTargetMax.toLocaleString('pl-PL')} zł, co pozwoli na sprawny obrót z bezpiecznym buforem na przygotowanie auta.`;

  if (numericPrice) {
    if (numericPrice <= buyTargetMax * 1.05) {
      rating = 'deal';
      ratingLabel = '🔥 Bardzo dobra okazja dla skupu';
      verdict = `Cena oczekiwana przez klienta (${numericPrice.toLocaleString('pl-PL')} zł) wpisuje się w bezpieczne widełki odkupu skupowego (${buyTargetMin.toLocaleString('pl-PL')} – ${buyTargetMax.toLocaleString('pl-PL')} zł). Auto ma bardzo wysoki potencjał na natychmiastowy odkup i satysfakcjonujący zysk.`;
    } else if (numericPrice <= estimatedRetailMedian * 0.90) {
      rating = 'fair';
      ratingLabel = '⚖️ Do twardej negocjacji pod skup';
      verdict = `Klient oczekuje kwoty ${numericPrice.toLocaleString('pl-PL')} zł, co jest blisko cen prywatnych ogłoszeń (~${estimatedRetailMedian.toLocaleString('pl-PL')} zł). Dla skupu bezpieczny odkup gotówką od ręki to ${buyTargetMin.toLocaleString('pl-PL')} – ${buyTargetMax.toLocaleString('pl-PL')} zł.`;
    } else {
      rating = 'overpriced';
      ratingLabel = '⚠️ Zawyżona pod skup (cena detaliczna)';
      verdict = `Klient wycenił pojazd na ${numericPrice.toLocaleString('pl-PL')} zł, co odpowiada górnym cenom detalicznym z portali. Skup powinien złożyć twardą kontrofertę w granicach ${buyTargetMax.toLocaleString('pl-PL')} zł gotówką od ręki.`;
    }
  }

  const tips: string[] = [];
  if (notes.includes('BRAK WAŻNEGO OC') || notes.includes('BRAK OC')) {
    tips.push('Brak OC oznacza konieczność transportu autolawetą – użyj tego jako twardego argumentu do zbicia ceny o min. 600 zł.');
  }
  if (notes.includes('BRAK WAŻNEGO PRZEGLĄDU') || notes.includes('BRAK PRZEGLĄDU')) {
    tips.push('Brak badania technicznego sugeruje ryzyko ukrytych usterek – zbij cenę o min. 1 000 zł na ścieżkę diagnostyczną.');
  }
  if (tips.length < 2) {
    tips.push('Zaproponuj natychmiastową wypłatę gotówki lub szybki przelew ekspresowy w zamian za rabat od ceny wyjściowej.');
    tips.push('Podkreśl formalne przejęcie pełnej odpowiedzialności za auto na umowie kupna-sprzedaży (brak roszczeń z tytułu rękojmi).');
  }

  return {
    suggestedBuyPrice: `${buyTargetMin.toLocaleString('pl-PL')} – ${buyTargetMax.toLocaleString('pl-PL')} zł`,
    estimatedMarketPrice: `${retailMin.toLocaleString('pl-PL')} – ${retailMax.toLocaleString('pl-PL')} zł`,
    profitMargin: `ok. ${expectedProfit.toLocaleString('pl-PL')} zł`,
    rating,
    ratingLabel,
    verdict,
    negotiationTips: tips.slice(0, 3),
    targetAudience: isPremium 
      ? (age >= 12 ? 'Lokalne skupy aut starszych / handel częściami' : 'Skupy aut premium / komisy') 
      : isBudget 
      ? 'Lokalne skupy aut miejskich, handel do 20 tys. zł' 
      : 'Uniwersalne skupy aut, szybki flip detaliczny',
    source: isQuotaExceeded ? 'quota_fallback' : 'algorithmic_fallback',
    methodLabel: isQuotaExceeded 
      ? '⚠️ Limit Gemini wyczerpany • Algorytm Vroom (0 zł)' 
      : '📐 Skalibrowany Algorytm Skupowy (0 zł)',
    methodDescription: isQuotaExceeded
      ? `Przekroczono limit Gemini – automatycznie użyto bezpiecznego algorytmu skupowego segmentu ${segmentName} (${age} lat, bufor ryzyka i marża minimalna). Koszt: 0 zł.`
      : `Wycena skupowa oparta o wiek (${age} lat), segment ${segmentName}, krzywą ryzyka amortyzacyjnego, stan techniczny i minimalną marżę handlową. Koszt: 0 zł.`,
  };
}

/**
 * Główna funkcja wyceny AI – odpytuje Google Gemini Flash w darmowym tierze,
 * a w przypadku braku klucza, błędu lub błędu 429 (quota exceeded)
 * natychmiast wraca do darmowego algorytmu Vroom bez żadnych kosztów.
 */
export async function getAiValuationForLead(lead: LeadDataForAi): Promise<AiValuationResult> {
  const numericPrice = parsePriceAmount(lead.price_bracket, lead.condition_notes);

  // Gdy cena nie jest podana, nie robimy wyliczeń ani nie odpytujemy AI o fikcyjne kwoty
  if (!numericPrice || numericPrice <= 0) {
    return generateAlgorithmicValuation(lead);
  }

  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  // Lokalnie oszczędzamy tokeny i zawsze używamy darmowego silnika algorytmicznego.
  if (!isProduction || !apiKey) {
    return generateAlgorithmicValuation(lead);
  }

  try {
    const prompt = `Jesteś bezwzględnie doświadczonym ekspertem wyceny samochodów używanych w Polsce oraz doradcą dla skupów aut i handlarzy (flipowanie aut).
Przeanalizuj poniższe zgłoszenie sprzedawcy z serwisu skupu aut i przygotuj wycenę handlową.

DANE POJAZDU:
- Model: ${lead.make_model}
- Rocznik: ${lead.year}
- Paliwo: ${lead.fuel || 'Nie podano'}
- Deklarowany stan: ${lead.condition || 'Sprawny'}
- Oczekiwana cena klienta: ${lead.price_bracket || 'Do uzgodnienia'}
- Lokalizacja: ${lead.city || 'Polska'}
- Uwagi i stan techniczny klienta: ${lead.condition_notes || 'Brak dodatkowych uwag'}

ZASADY REALNEJ WYCENY SKUPOWEJ W POLSCE (BARDZO WAŻNE):
Skup samochodów NIE płaci cen z ogłoszeń Otomoto/OLX minus 10%. Skup płaci gotówką od ręki, ponosi koszty dojazdu lawetą, badania technicznego, serwisu startowego i ryzyka awarii:
1. Realne widełki odkupu gotówkowego względem średniej rynkowej (detalicznej):
   - Auta 1–5 lat: 75%–82% ceny rynkowej.
   - Auta 6–10 lat: 64%–72% ceny rynkowej.
   - Auta 11–15 lat: 54%–62% ceny rynkowej.
   - Auta 16+ lat (roczniki 2010 i starsze): 46%–54% ceny rynkowej! (duże ryzyko usterek silnika/skrzyni i korozji).
2. Auta marek Premium (BMW, Mercedes, Audi, Volvo, Porsche) powyżej 11 lat:
   - Skupy potrącają dodatkowy bufor ryzyka (ok. 5-8% w dół), bo awarie skrzyń 6HP/8HP, zawieszenia czy elektroniki pochłaniają tysiące złotych. Np. BMW 5 z 2008 r. przy rynku 17-19k zł skup odkupi za ok. 9 000 – 10 500 zł gotówką od ręki!
3. Braki formalne:
   - Brak OC: potrącenie min. 600 zł (obowiązkowa autolaweta).
   - Brak przeglądu technicznego (PT): potrącenie min. 1 000 zł (ścieżka diagnostyczna i naprawy).
4. Stan techniczny:
   - Drobne poprawki: potrącenie 10-15%.
   - Wymaga naprawy / uszkodzony: potrącenie 25-35%.
   - Niesprawny / powypadkowy: wycena na poziomie 40-50% wartości.
5. Minimalny zysk skupu ("podłoga"):
   - Skup nie wyjeżdża po auto za mniej niż 3 000 – 4 000 zł zysku na czysto (na autach droższych min. 6 000 – 10 000 zł).

Przygotuj wycenę z perspektywy skupu samochodów, który chce kupić to auto gotówką od ręki i odsprzedać je z zyskiem lub puścić w obrót.
Odpowiedz wyłącznie w formacie JSON zgodnym z poniższym schematem TypeScript:
{
  "suggestedBuyPrice": "np. 9 000 – 10 500 zł (realna kwota odkupu gotówkowego dla skupu)",
  "estimatedMarketPrice": "np. 17 000 – 19 000 zł (średnia detaliczna z ogłoszeń Otomoto/OLX)",
  "profitMargin": "np. ok. 4 000 – 5 500 zł (po kosztach przygotowania)",
  "rating": "deal" | "fair" | "overpriced",
  "ratingLabel": "zwięzła etykieta z emoji np. 🔥 Okazja na szybki flip LUB ⚖️ Standardowa baza do negocjacji LUB ⚠️ Zawyżona cena",
  "verdict": "2-3 konkretne zdania: co to za auto, jak wygląda popyt w Polsce, dlaczego taka cena odkupu i ocena propozycji klienta",
  "targetAudience": "jaki typ skupu / kupca to najchętniej weźmie"
}`;

    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    clearTimeout(timeoutId);

    // Jeśli przekroczono limit (HTTP 429) lub inny błąd API -> automatyczny darmowy fallback!
    if (!response.ok) {
      const isQuota = response.status === 429;
      console.warn(`[Gemini API Error ${response.status} (quota: ${isQuota})]: switching to free fallback.`);
      return generateAlgorithmicValuation(lead, isQuota);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return generateAlgorithmicValuation(lead);
    }

    const parsed = JSON.parse(textContent);

    return {
      suggestedBuyPrice: parsed.suggestedBuyPrice || 'Do uzgodnienia',
      estimatedMarketPrice: parsed.estimatedMarketPrice || 'Według rynku',
      profitMargin: parsed.profitMargin || 'Do ustalenia',
      rating: ['deal', 'fair', 'overpriced'].includes(parsed.rating) ? parsed.rating : 'fair',
      ratingLabel: parsed.ratingLabel || '⚖️ Analiza AI',
      verdict: parsed.verdict || 'Brak opisu.',
      negotiationTips: Array.isArray(parsed.negotiationTips) ? parsed.negotiationTips : [],
      targetAudience: parsed.targetAudience || 'Skupy aut używanych',
      source: 'gemini',
      methodLabel: '⚡ Gemini 1.5 Flash (Darmowy tier)',
      methodDescription: 'Analiza w czasie rzeczywistym przez model Google Gemini 1.5 Flash w darmowym limicie Google AI Studio (1500 req/dzień, 0 zł).',
    };
  } catch (error: any) {
    console.warn('[Gemini AI Valuation Error / Abort]: switching to free fallback.', error.message);
    return generateAlgorithmicValuation(lead);
  }
}
