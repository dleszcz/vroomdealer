/**
 * Generator gotowych wiadomości zachęty do odkupu dla partnerskich skupów aut
 */

export interface PitchLeadData {
  make_model: string;
  year: number;
  fuel: string;
  city?: string | null;
  condition: string;
  condition_notes?: string | null;
  price_bracket?: string | null;
  access_token?: string | null;
}

const FUEL_LABELS: Record<string, string> = {
  diesel: 'Diesel',
  benzyna: 'Benzyna',
  petrol: 'Benzyna',
  lpg: 'Benzyna + LPG',
  hybryda: 'Hybryda',
  hybrid: 'Hybryda',
  elektryczny: 'Elektryczny',
  electric: 'Elektryczny',
};

const CONDITION_LABELS: Record<string, string> = {
  bardzo_dobry: 'Sprawny (wsiadać i jechać)',
  drobne_poprawki: 'Do drobnych poprawek',
  wymaga_naprawy: 'Wymaga napraw mechanicznych',
  niesprawny: 'Uszkodzony / Powypadkowy',
};

/**
 * Wyciąga z uwag klienta dodatkowe informacje (np. nowe opony, wymieniony rozrząd itp.)
 */
export function extractExtras(notes?: string | null): string {
  if (!notes) return '';
  return notes
    .split('|')
    .map((s) => s.trim())
    .filter((s) => {
      if (!s) return false;
      if (s.includes('BRAK WAŻNEGO OC')) return false;
      if (s.includes('BRAK WAŻNEGO PRZEGLĄDU')) return false;
      if (s.includes('Wystawione na portalach')) return false;
      if (s.includes('Tylko w VroomScout')) return false;
      if (s.includes('Off-market')) return false;
      if (s.startsWith('Oczekiwana kwota:')) return false;
      if (s.startsWith('Przebieg:')) return false;
      if (s.startsWith('Moc:')) return false;
      if (s.includes('POBRANIE KONTAKTU')) return false;
      return true;
    })
    .join(', ');
}

export function generateBuyerPitch(lead: PitchLeadData, leadUrl?: string): string {
  const fuel = FUEL_LABELS[lead.fuel?.toLowerCase()] || lead.fuel || 'Benzyna';
  const conditionBase = CONDITION_LABELS[lead.condition?.toLowerCase()] || 'Sprawny';

  // Badanie statusu OC i PT
  const hasNoInsurance = lead.condition_notes?.includes('BRAK WAŻNEGO OC');
  const hasNoMot = lead.condition_notes?.includes('BRAK WAŻNEGO PRZEGLĄDU');

  let formalStatus = 'ważne OC i przegląd';
  if (hasNoInsurance && hasNoMot) formalStatus = 'brak OC i PT';
  else if (hasNoInsurance) formalStatus = 'brak OC, przegląd ważny';
  else if (hasNoMot) formalStatus = 'ważne OC, brak badania tech.';

  const extras = extractExtras(lead.condition_notes);
  
  let stanFull = `${conditionBase} (${formalStatus})`;
  if (extras) {
    stanFull += `, ${extras}`;
  }

  const isUnpriced = !lead.price_bracket || /czeka|propozycj|uzgodnien|wycen|brak/i.test(lead.price_bracket);
  const priceDisplay = isUnpriced
    ? 'Cena: Klient nie podał kwoty (czeka na propozycję odkupu)'
    : `Oczekiwana cena klienta: ${lead.price_bracket}`;
  const city = lead.city || 'Polska';

  return `Dzień dobry, 
Czy jesteście zainteresowani takim autem?

${lead.make_model} (${lead.year}) – ${fuel}
Lokalizacja: ${city}
Stan: ${stanFull}
${priceDisplay}

Auto pochodzi z mojego systemu do pozyskiwania aut od prywatnych właścicieli do skupów.
Proszę dać znać czy podesłać zdjęcia i kontakt do sprzedawcy.${leadUrl ? `\n\nPodgląd zgłoszenia: ${leadUrl}` : ''}

Pozdrawiam,
Daniel`;
}
