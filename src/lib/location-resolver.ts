/**
 * Mapowanie i resolwowanie polskich kodów pocztowych na czytelne nazwy miejscowości i powiatów.
 * Obsługuje zarówno kody wpisane solo (np. "99-300"), jak i połączone (np. "62-600 Koło").
 */

// Słownik dokładnych kodów miast i gmin
const EXACT_POSTAL_CODES: Record<string, string> = {
  // Oś Włocławek - Płock - Kujawy - Mazowsze zachodnie
  '99-300': 'Kutno',
  '99-301': 'Kutno',
  '99-320': 'Żychlin',
  '99-340': 'Krośniewice',
  '99-100': 'Łęczyca',
  '99-200': 'Poddębice',
  '99-400': 'Łowicz',
  '87-800': 'Włocławek',
  '87-801': 'Włocławek',
  '87-810': 'Choceń',
  '87-820': 'Kowal',
  '87-840': 'Lubień Kujawski',
  '87-850': 'Choceń',
  '87-860': 'Chodecz',
  '87-865': 'Izbica Kujawska',
  '87-880': 'Brześć Kujawski',
  '87-890': 'Lubraniec',
  '87-500': 'Rypin',
  '87-600': 'Lipno',
  '87-610': 'Dobrzyń nad Wisłą',
  '87-640': 'Czernikowo',
  '87-700': 'Aleksandrów Kujawski',
  '87-720': 'Ciechocinek',
  '87-100': 'Toruń',
  '87-101': 'Toruń',
  '87-102': 'Toruń',
  '87-300': 'Brodnica',
  '87-400': 'Golub-Dobrzyń',
  '09-400': 'Płock',
  '09-402': 'Płock',
  '09-410': 'Płock',
  '09-411': 'Płock',
  '09-500': 'Gostynin',
  '09-530': 'Gąbin',
  '09-200': 'Sierpc',
  '09-100': 'Płońsk',
  '09-300': 'Żuromin',
  '06-400': 'Ciechanów',
  '06-500': 'Mława',
  '96-500': 'Sochaczew',
  '96-100': 'Skierniewice',
  '96-300': 'Żyrardów',

  // Wielkopolska wschodnia
  '62-600': 'Koło',
  '62-610': 'Sompolno',
  '62-650': 'Kłodawa',
  '62-660': 'Dąbie',
  '62-500': 'Konin',
  '62-510': 'Konin',
  '62-700': 'Turek',
  '62-400': 'Słupca',
  '62-300': 'Września',
  '62-200': 'Gniezno',
  '62-237': 'Kłecko (pow. gnieźnieński)',
  '62-020': 'Swarzędz',
  '62-030': 'Luboń',
  '62-050': 'Mosina',
  '63-000': 'Środa Wielkopolska',
  '63-100': 'Śrem',
  '63-200': 'Jarocin',
  '62-800': 'Kalisz',
  '63-400': 'Ostrów Wielkopolski',

  // Pałuki / Kujawy północne / Bydgoszcz
  '85-001': 'Bydgoszcz',
  '85-800': 'Bydgoszcz',
  '86-022': 'Kozielec (k. Bydgoszczy)',
  '86-010': 'Koronowo',
  '86-050': 'Solec Kujawski',
  '86-100': 'Świecie',
  '86-200': 'Chełmno',
  '86-300': 'Grudziądz',
  '88-100': 'Inowrocław',
  '88-300': 'Mogilno',
  '88-400': 'Żnin',
  '88-200': 'Radziejów',
  '88-230': 'Piotrków Kujawski',
  '89-500': 'Tuchola',
  '89-600': 'Chojnice',
  '89-400': 'Sępólno Krajeńskie',
  '89-100': 'Nakło nad Notecią',
  '89-200': 'Szubin',

  // Inne zgłoszone w weekend
  '43-200': 'Pszczyna',
  '76-200': 'Słupsk',
  '14-100': 'Ostróda',
  '14-105': 'Samborowo (pow. ostródzki)',
};

// Słownik okręgów pocztowych (dwucyfrowe prefiksy)
const PREFIX_REGIONS: Record<string, string> = {
  '00': 'Warszawa',
  '01': 'Warszawa',
  '02': 'Warszawa',
  '03': 'Warszawa',
  '04': 'Warszawa',
  '05': 'Okolice Warszawy (Pruszków/Piaseczno/Wołomin)',
  '06': 'Rejon Ciechanów / Mława',
  '07': 'Rejon Ostrołęka / Siedlce',
  '08': 'Rejon Siedlce / Łuków',
  '09': 'Rejon Płock / Gostynin / Sierpc',
  '10': 'Olsztyn',
  '11': 'Rejon Olsztyn / Kętrzyn',
  '12': 'Rejon Szczytno / Pisz',
  '13': 'Rejon Działdowo / Iława',
  '14': 'Rejon Ostróda / Morąg',
  '15': 'Białystok',
  '16': 'Rejon Suwałki / Augustów',
  '17': 'Rejon Bielsk Podlaski / Hajnówka',
  '18': 'Rejon Łomża / Zambrów',
  '19': 'Rejon Ełk / Grajewo',
  '20': 'Lublin',
  '21': 'Rejon Biała Podlaska / Radzyń',
  '22': 'Rejon Zamość / Chełm',
  '23': 'Rejon Kraśnik / Biłgoraj',
  '24': 'Rejon Puławy / Opole Lubelskie',
  '25': 'Kielce',
  '26': 'Rejon Radom / Starachowice',
  '27': 'Rejon Ostrowiec Św. / Sandomierz',
  '28': 'Rejon Busko-Zdrój / Jędrzejów',
  '30': 'Kraków',
  '31': 'Kraków',
  '32': 'Rejon Wieliczka / Chrzanów / Bochnia',
  '33': 'Rejon Tarnów / Nowy Sącz',
  '34': 'Rejon Nowy Targ / Zakopane / Żywiec',
  '35': 'Rzeszów',
  '36': 'Rejon Kolbuszowa / Łańcut',
  '37': 'Rejon Przemyśl / Stalowa Wola',
  '38': 'Rejon Krosno / Sanok',
  '39': 'Rejon Dębica / Mielec',
  '40': 'Katowice',
  '41': 'Rejon Sosnowiec / Bytom / Gliwice',
  '42': 'Rejon Częstochowa / Zawiercie',
  '43': 'Rejon Bielsko-Biała / Cieszyn / Pszczyna',
  '44': 'Rejon Rybnik / Gliwice / Jastrzębie',
  '45': 'Opole',
  '46': 'Rejon Kluczbork / Krapkowice',
  '47': 'Rejon Kędzierzyn-Koźle / Prudnik',
  '48': 'Rejon Nysa / Prudnik',
  '50': 'Wrocław',
  '51': 'Wrocław',
  '52': 'Wrocław',
  '53': 'Wrocław',
  '54': 'Wrocław',
  '55': 'Rejon Oleśnica / Oława / Trzebnica',
  '56': 'Rejon Milicz / Wołów',
  '57': 'Rejon Kłodzko / Ząbkowice',
  '58': 'Rejon Wałbrzych / Świdnica / Jelenia Góra',
  '59': 'Rejon Legnica / Lubin / Głogów',
  '60': 'Poznań',
  '61': 'Poznań / Luboń / Swarzędz',
  '62': 'Wielkopolska Wsch. (Gniezno/Konin/Koło)',
  '63': 'Wielkopolska Płd. (Kalisz/Ostrów/Jarocin)',
  '64': 'Rejon Leszno / Piła / Nowy Tomyśl',
  '65': 'Zielona Góra',
  '66': 'Rejon Gorzów Wlkp. / Nowa Sól',
  '67': 'Rejon Głogów / Żagań',
  '68': 'Rejon Żary / Lubsko',
  '70': 'Szczecin',
  '71': 'Szczecin',
  '72': 'Rejon Goleniów / Świnoujście / Gryfice',
  '73': 'Rejon Stargard / Choszczno',
  '74': 'Rejon Gryfino / Dębno',
  '75': 'Koszalin',
  '76': 'Rejon Słupsk / Lębork / Bytów',
  '77': 'Rejon Szczecinek / Chojnice / Człuchów',
  '78': 'Rejon Kołobrzeg / Białogard / Wałcz',
  '80': 'Gdańsk',
  '81': 'Gdynia / Sopot',
  '82': 'Rejon Elbląg / Malbork / Kwidzyn',
  '83': 'Rejon Tczew / Starogard Gd. / Kartuzy',
  '84': 'Rejon Wejherowo / Puck',
  '85': 'Bydgoszcz',
  '86': 'Rejon Bydgoszcz / Świecie / Chełmno',
  '87': 'Kujawy (Toruń/Włocławek/Lipno/Rypin)',
  '88': 'Rejon Inowrocław / Żnin / Mogilno',
  '89': 'Bory Tucholskie (Tuchola/Chojnice/Nakło)',
  '90': 'Łódź',
  '91': 'Łódź',
  '92': 'Łódź',
  '93': 'Łódź',
  '94': 'Łódź',
  '95': 'Okolice Łodzi (Pabianice/Zgierz/Ozorków)',
  '96': 'Rejon Skierniewice / Sochaczew / Żyrardów',
  '97': 'Rejon Piotrków Tryb. / Bełchatów / Tomaszów',
  '98': 'Rejon Sieradz / Zduńska Wola / Wieluń',
  '99': 'Rejon Kutno / Łęczyca / Łowicz',
};

/**
 * Zamienia surową lokalizację (kod pocztowy lub kod + miasto) na czytelną dla człowieka i skupu.
 * Przykłady:
 * "99-300" -> "Kutno (99-300)"
 * "62-237" -> "Kłecko (pow. gnieźnieński, 62-237)"
 * "09-400 Płock" -> "Płock (09-400)"
 * "Gdańsk" -> "Gdańsk"
 */
export function formatLocation(rawLocation?: string | null): string {
  if (!rawLocation || !rawLocation.trim()) return 'Polska';

  const trimmed = rawLocation.trim();
  const postalCodeMatch = trimmed.match(/\b\d{2}-\d{3}\b/);

  if (!postalCodeMatch) {
    // Brak kodu pocztowego, czysta nazwa miasta (np. "Gdańsk")
    return trimmed;
  }

  const code = postalCodeMatch[0];
  const exactCity = EXACT_POSTAL_CODES[code];
  const prefix = code.slice(0, 2);
  const prefixRegion = PREFIX_REGIONS[prefix];

  // Jeśli użytkownik wpisał sam kod pocztowy (np. "99-300")
  if (trimmed === code) {
    if (exactCity) {
      return `${exactCity} (${code})`;
    }
    if (prefixRegion) {
      return `${prefixRegion} (${code})`;
    }
    return `kod ${code}`;
  }

  // Jeśli użytkownik wpisał kod pocztowy i miasto (np. "62-600 Koło" lub "Płock 09-400")
  const textWithoutCode = trimmed.replace(code, '').replace(/[,]/g, '').trim();
  if (textWithoutCode.length >= 2) {
    // Mamy już nazwę miasta od klienta
    return `${textWithoutCode} (${code})`;
  }

  // Jeśli po wycięciu kodu nic sensownego nie zostało
  if (exactCity) {
    return `${exactCity} (${code})`;
  }
  if (prefixRegion) {
    return `${prefixRegion} (${code})`;
  }

  return trimmed;
}
