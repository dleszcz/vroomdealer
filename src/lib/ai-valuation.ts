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
  negotiationTips: string[];
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


  const isPremium = /mercedes|bmw|audi|porsche|lexus|volvo|jaguar/i.test(titleLower);
  const isSuv = /kuga|qashqai|tiguan|rav4|sportage|tucson|cr-v|x3|x5|q5|glc/i.test(titleLower);
  const isBudget = /dacia|fiat|punto|corsa|clio|fabia|yaris|seicento|matiz/i.test(titleLower);

  const segmentName = isPremium ? 'Premium' : isSuv ? 'SUV' : isBudget ? 'Miejski / Budżetowy' : 'Standardowy';

  let baseNewPrice = 135000;
  if (isPremium) baseNewPrice = 220000;
  if (isSuv) baseNewPrice = 160000;
  if (isBudget) baseNewPrice = 75000;

  const residualPercentage = Math.max(0.08, Math.pow(0.85, age));
  const estimatedRetailMedian = Math.round((baseNewPrice * residualPercentage) / 1000) * 1000;

  const retailMin = Math.round((estimatedRetailMedian * 0.93) / 1000) * 1000;
  const retailMax = Math.round((estimatedRetailMedian * 1.07) / 1000) * 1000;

  // Sugerowana cena odkupu dla skupu (z marżą 15-25% dla handlarza)
  const buyTargetMin = Math.round((estimatedRetailMedian * 0.75) / 1000) * 1000;
  const buyTargetMax = Math.round((estimatedRetailMedian * 0.83) / 1000) * 1000;
  const expectedProfit = Math.round((estimatedRetailMedian - buyTargetMax) / 1000) * 1000;

  let rating: 'deal' | 'fair' | 'overpriced' = 'fair';
  let ratingLabel = '⚖️ Standardowa baza do negocjacji';
  let verdict = `Płynny model na polskim rynku wtórnym (${lead.make_model}, ${lead.year}). Bezpieczna kwota odkupu dla skupu to ${buyTargetMin.toLocaleString('pl-PL')} – ${buyTargetMax.toLocaleString('pl-PL')} zł, co pozwoli na szybki obrót z godziwą marżą.`;

  if (numericPrice) {
    const diff = (numericPrice - estimatedRetailMedian) / estimatedRetailMedian;
    if (diff <= -0.15) {
      rating = 'deal';
      ratingLabel = '🔥 Bardzo dobra okazja na szybki zysk';
      verdict = `Cena oczekiwana przez klienta (${numericPrice.toLocaleString('pl-PL')} zł) jest wyraźnie poniżej średniej rynkowej (~${estimatedRetailMedian.toLocaleString('pl-PL')} zł). Auto ma bardzo wysoki potencjał na natychmiastowy odkup i szybki zysk po minimalnym przygotowaniu.`;
    } else if (diff > 0.12) {
      rating = 'overpriced';
      ratingLabel = '⚠️ Klient oczekuje powyżej rynku';
      verdict = `Klient wycenił pojazd na ${numericPrice.toLocaleString('pl-PL')} zł, co przekracza średnią dla tego rocznika. Skup powinien złożyć twardą kontrofertę w granicach ${buyTargetMax.toLocaleString('pl-PL')} zł gotówką od ręki.`;
    }
  }

  const tips: string[] = [];
  const notes = (lead.condition_notes || '').toUpperCase();

  if (notes.includes('BRAK WAŻNEGO OC') || notes.includes('BRAK OC')) {
    tips.push('Brak OC oznacza konieczność transportu autolawetą – użyj tego jako twardego argumentu do zbicia ceny o 500-800 zł.');
  }
  if (notes.includes('BRAK WAŻNEGO PRZEGLĄDU') || notes.includes('BRAK PRZEGLĄDU')) {
    tips.push('Brak badania technicznego sugeruje ryzyko ukrytych usterek zawieszenia lub emisji – zbij cenę o min. 1 000 zł na pakiet startowy.');
  }
  if (notes.includes('OPONY')) {
    tips.push('Sprzedający deklaruje dobre/nowe opony – to oszczędność dla skupu, podkreśl to przy prezentacji oferty partnerskiej.');
  }
  if (tips.length < 2) {
    tips.push('Zaproponuj natychmiastową wypłatę gotówki lub szybki przelew ekspresowy w zamian za rabat 10-15% od ceny wyjściowej.');
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
      ? 'Skupy aut premium / komisy z gwarancją' 
      : isBudget 
      ? 'Lokalne skupy aut miejskich, handel do 20 tys. zł' 
      : 'Uniwersalne skupy aut, szybki flip detaliczny',
    source: isQuotaExceeded ? 'quota_fallback' : 'algorithmic_fallback',
    methodLabel: isQuotaExceeded 
      ? '⚠️ Limit Gemini wyczerpany • Algorytm Vroom (0 zł)' 
      : '📐 Algorytm Vroom (Darmowy 0 zł)',
    methodDescription: isQuotaExceeded
      ? `Przekroczono limit darmowych zapytań Gemini – automatycznie użyto bezpiecznego algorytmu deprecjacji segmentu ${segmentName} (${age} lat) z marżą 15–25%. Koszt: 0 zł.`
      : `Wycena na bazie segmentu ${segmentName}, wieku auta (${age} lat), krzywej deprecjacji i marży skupu (~15–25%). Koszt: 0 zł.`,
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

Przygotuj wycenę z perspektywy skupu samochodów, który chce kupić to auto gotówką od ręki i odsprzedać je z zyskiem lub puścić w obrót.
Odpowiedz wyłącznie w formacie JSON zgodnym z poniższym schematem TypeScript:
{
  "suggestedBuyPrice": "np. 28 000 – 31 000 zł (kwota odkupu dla skupu)",
  "estimatedMarketPrice": "np. 36 000 – 39 000 zł (średnia detaliczna na Otomoto/OLX)",
  "profitMargin": "np. ok. 6 000 – 8 000 zł",
  "rating": "deal" | "fair" | "overpriced",
  "ratingLabel": "zwięzła etykieta z emoji np. 🔥 Okazja na szybki flip LUB ⚖️ Standardowa baza do negocjacji LUB ⚠️ Zawyżona cena",
  "verdict": "2-3 konkretne zdania: co to za auto, jak wygląda popyt w Polsce, dlaczego taka cena odkupu",
  "negotiationTips": ["argument 1 do zbicia ceny od klienta", "argument 2 do zbicia ceny", "argument 3"],
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
