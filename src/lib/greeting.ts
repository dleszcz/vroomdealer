/**
 * Generates a natural, polite Polish greeting with proper grammatical gender and vocative form (wołacz).
 * E.g.:
 *  - "Waldek" -> "Dzień dobry Panie Waldku"
 *  - "Marek" -> "Dzień dobry Panie Marku"
 *  - "Piotr" -> "Dzień dobry Panie Piotrze"
 *  - "Daniel" -> "Dzień dobry Panie Danielu"
 *  - "Anna" -> "Dzień dobry Pani Anno"
 *  - "Kasia" -> "Dzień dobry Pani Kasiu"
 *  - "" / "Klient" -> "Dzień dobry"
 */
export function formatPolishGreeting(fullName?: string | null): string {
  const clean = (fullName || '').trim();
  if (
    !clean ||
    ['klient', 'brak', 'anonim', 'nieznany', 'osoba'].includes(clean.toLowerCase())
  ) {
    return 'Dzień dobry';
  }

  // Extract first name (e.g. from "Waldek Kowalski" -> "Waldek")
  const rawFirstName = clean.split(/[\s,]+/)[0];
  const name = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);
  const lower = name.toLowerCase();

  // Irregular male vocative mappings
  const irregularMale: Record<string, string> = {
    piotr: 'Piotrze',
    paweł: 'Pawle',
    pawel: 'Pawle',
    michał: 'Michale',
    michal: 'Michale',
    krzysztof: 'Krzysztofie',
    tomasz: 'Tomaszu',
    mateusz: 'Mateuszu',
    łukasz: 'Łukaszu',
    lukasz: 'Łukaszu',
    marcin: 'Marcinie',
    kamil: 'Kamilu',
    patryk: 'Patryku',
    artur: 'Arturze',
    rafał: 'Rafale',
    rafal: 'Rafale',
    robert: 'Robercie',
    adam: 'Adamie',
    mikołaj: 'Mikołaju',
    mikolaj: 'Mikołaju',
    kuba: 'Kubo',
    jakub: 'Jakubie',
    jan: 'Janie',
    andrzej: 'Andrzeju',
    grzegorz: 'Grzegorzu',
    mariusz: 'Mariuszu',
    dariusz: 'Dariuszu',
    jacek: 'Jacku',
    przemysław: 'Przemysławie',
    przemyslaw: 'Przemysławie',
    stanisław: 'Stanisławie',
    stanislaw: 'Stanisławie',
    wiesław: 'Wiesławie',
    wieslaw: 'Wiesławie',
    wojciech: 'Wojciechu',
    maciej: 'Macieju',
    hubert: 'Hubercie',
    dawid: 'Dawidzie',
    adrian: 'Adrianie',
    sebastian: 'Sebastianie',
    dominik: 'Dominiku',
    aleksander: 'Aleksandrze',
    bartosz: 'Bartoszu',
    bartłomiej: 'Bartłomieju',
    bartlomiej: 'Bartłomieju',
    jarosław: 'Jarosławie',
    jaroslaw: 'Jarosławie',
    mirosław: 'Mirosławie',
    miroslaw: 'Mirosławie',
    sławomir: 'Sławomirze',
    slawomir: 'Sławomirze',
    bogdan: 'Bogdanie',
    zbigniew: 'Zbigniewie',
    leszek: 'Leszku',
    marek: 'Marku',
  };

  if (irregularMale[lower]) {
    return `Dzień dobry Panie ${irregularMale[lower]}`;
  }

  // Male diminutives ending in -ek (Waldek -> Waldku, Bartek -> Bartku, Wojtek -> Wojtku, Tomek -> Tomku, Radek -> Radku)
  if (lower.endsWith('ek')) {
    const stem = name.slice(0, -2);
    return `Dzień dobry Panie ${stem}ku`;
  }

  // Male names ending in -ik / -yk (Eryk -> Eryku, Henryk -> Henryku)
  if (lower.endsWith('ik') || lower.endsWith('yk')) {
    return `Dzień dobry Panie ${name}u`;
  }

  // Male names ending in -el (Daniel -> Danielu, Marcel -> Marcelu, Gabriel -> Gabrielu)
  if (lower.endsWith('el')) {
    return `Dzień dobry Panie ${name}u`;
  }

  // Male names ending in -sz (Janusz -> Januszu, Arkadiusz -> Arkadiuszu)
  if (lower.endsWith('sz')) {
    return `Dzień dobry Panie ${name}u`;
  }

  // Male names ending in -an (Roman -> Romanie, Damian -> Damianie)
  if (lower.endsWith('an')) {
    return `Dzień dobry Panie ${name}ie`;
  }

  // Check if female (in Polish, virtually all female first names end with 'a')
  const maleExceptionEndingWithA = ['kuba', 'kosma', 'barnaba', 'bonawentura'];
  const isFemale = lower.endsWith('a') && !maleExceptionEndingWithA.includes(lower);

  if (isFemale) {
    // Diminutives ending in -ia, -la, -ka (Kasia -> Kasiu, Basia -> Basiu, Ania -> Aniu)
    if (lower.endsWith('sia') || lower.endsWith('zia') || lower.endsWith('cia') || lower.endsWith('nia')) {
      const stem = name.slice(0, -1);
      return `Dzień dobry Pani ${stem}u`;
    }
    const stem = name.slice(0, -1);
    return `Dzień dobry Pani ${stem}o`;
  }

  // Male names ending with consonant (Filip -> Filipie, Konrad -> Konradzie)
  if (lower.endsWith('p') || lower.endsWith('b') || lower.endsWith('t')) {
    return `Dzień dobry Panie ${name}ie`;
  }
  if (lower.endsWith('d')) {
    const stem = name.slice(0, -1);
    return `Dzień dobry Panie ${stem}dzie`;
  }

  return `Dzień dobry Panie ${name}`;
}

/**
 * Returns just the vocative part (e.g. "Panie Waldku", "Pani Anno") or empty string.
 */
export function formatPolishVocative(fullName?: string | null): string {
  const greeting = formatPolishGreeting(fullName);
  const vocative = greeting.replace(/^Dzień dobry\s*,?\s*/i, '').trim();
  return vocative;
}
