import React from 'react';
import bibleData from '../data/ro_cornilescu.json';

// Tipul structurii JSON-ului Biblic
interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][]; // Array de capitole, fiecare capitol e un array de versete (strings)
}

// Dicționar complet de mapare română → abbrev din JSON
const BIBLE_BOOKS_RO_TO_ABBREV: Record<string, string> = {
  // Vechiul Testament
  'geneza': 'gn',
  'gen': 'gn',
  'exodul': 'ex',
  'exod': 'ex',
  'ex': 'ex',
  'levitic': 'lv',
  'leviticul': 'lv',
  'lev': 'lv',
  'numeri': 'nm',
  'num': 'nm',
  'deuteronom': 'dt',
  'deuteronomul': 'dt',
  'deut': 'dt',
  'iosua': 'js',
  'ios': 'js',
  'judecatori': 'jz',
  'judecători': 'jz',
  'judecatorii': 'jz',
  'jud': 'jz',
  'rut': 'rt',
  '1 samuel': '1sm',
  '1 sam': '1sm',
  '2 samuel': '2sm',
  '2 sam': '2sm',
  '1 regi': '1rs',
  '1 imparatilor': '1rs',
  '2 regi': '2rs',
  '2 imparatilor': '2rs',
  '1 cronici': '1cr',
  '2 cronici': '2cr',
  'ezra': 'ed',
  'neemia': 'ne',
  'estera': 'et',
  'iov': 'jó',
  'job': 'jó',
  'psalmul': 'sl',
  'psalm': 'sl',
  'psalmi': 'sl',
  'ps': 'sl',
  'proverbe': 'pv',
  'proverbele': 'pv',
  'prov': 'pv',
  'ecclesiast': 'ec',
  'eclesiastul': 'ec',
  'ecl': 'ec',
  'cantarea cantarilor': 'ct',
  'cantarea': 'ct',
  'isaia': 'is',
  'is': 'is',
  'ieremia': 'jr',
  'ier': 'jr',
  'plangerile lui ieremia': 'lm',
  'plangerile': 'lm',
  'plangeri': 'lm',
  'ezechiel': 'ez',
  'daniel': 'dn',
  'dan': 'dn',
  'osea': 'os',
  'ioel': 'jl',
  'amos': 'am',
  'obadia': 'ob',
  'iona': 'jn',
  'mica': 'mq',
  'naum': 'na',
  'habacuc': 'hc',
  'tefania': 'sf',
  'țefania': 'sf',
  'hagai': 'ag',
  'zaharia': 'zc',
  'maleahi': 'ml',
  
  // Noul Testament
  'matei': 'mt',
  'mat': 'mt',
  'marcu': 'mc',
  'marc': 'mc',
  'luca': 'lc',
  'luc': 'lc',
  'ioan': 'jo',
  'in': 'jo',
  'faptele apostolilor': 'atos',
  'fapte': 'atos',
  'fapt': 'atos',
  'romani': 'rm',
  'rom': 'rm',
  '1 corinteni': '1co',
  '1 cor': '1co',
  '2 corinteni': '2co',
  '2 cor': '2co',
  'galateni': 'gl',
  'gal': 'gl',
  'efeseni': 'ef',
  'ef': 'ef',
  'filipeni': 'fp',
  'fil': 'fp',
  'coloseni': 'cl',
  'col': 'cl',
  '1 tesaloniceni': '1ts',
  '1 tes': '1ts',
  '2 tesaloniceni': '2ts',
  '2 tes': '2ts',
  '1 timotei': '1tm',
  '1 tim': '1tm',
  '2 timotei': '2tm',
  '2 tim': '2tm',
  'tit': 'tt',
  'filimon': 'fm',
  'evrei': 'hb',
  'evr': 'hb',
  'iacov': 'tg',
  'iac': 'tg',
  'iacob': 'tg',
  '1 petru': '1pe',
  '1 pet': '1pe',
  '2 petru': '2pe',
  '2 pet': '2pe',
  '1 ioan': '1jo',
  '1 in': '1jo',
  '2 ioan': '2jo',
  '2 in': '2jo',
  '3 ioan': '3jo',
  '3 in': '3jo',
  'iuda': 'jd',
  'apocalipsa': 'ap',
  'apoc': 'ap',
  'apocalips': 'ap',
};

// Cache pentru JSON parsat
const bibleBooks = bibleData as BibleBook[];

interface ParsedReference {
  bookAbbrev: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

/**
 * Validează și parsează o referință biblică
 * @param reference Referință în format "Cartea Capitol:Verset" sau "Cartea Capitol:Verset-Verset"
 * @returns Obiect cu bookAbbrev, chapter, verseStart, verseEnd sau null dacă nu e validă
 */
function parseReference(reference: string): ParsedReference | null {
  // Regex pentru format complet: "Cartea 4:5" sau "Cartea 4:5-6"
  const regex = /^([1-3]?\s*[a-zA-ZăâîșțĂÂÎȘȚ\s]+)\s+(\d+):(\d+)(?:-(\d+))?$/;
  const match = reference.trim().match(regex);
  
  if (!match) {
    return null;
  }
  
  const bookPart = match[1].trim().toLowerCase();
  const chapter = parseInt(match[2], 10);
  const verseStart = parseInt(match[3], 10);
  const verseEnd = match[4] ? parseInt(match[4], 10) : undefined;
  
  // Caută cartea în dicționar
  const bookAbbrev = BIBLE_BOOKS_RO_TO_ABBREV[bookPart];
  
  if (!bookAbbrev) {
    return null;
  }
  
  return {
    bookAbbrev,
    chapter,
    verseStart,
    verseEnd
  };
}

/**
 * Curăță textul de caractere nedorite
 */
function cleanVerseText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Normalizează spațiile
    .trim();
}

/**
 * Caută un verset biblic din fișierul JSON local (traducerea Cornilescu)
 * @param reference Referință biblică în română (ex: "Proverbe 3:5", "Proverbe 3:5-6")
 * @returns Textul versetului în română sau null dacă nu a fost găsit
 */
export async function fetchBibleVerse(reference: string): Promise<{
  text: string;
  reference: string;
} | null> {
  try {
    // Parsează referința
    const parsed = parseReference(reference);
    
    if (!parsed) {
      return null;
    }
    
    const { bookAbbrev, chapter, verseStart, verseEnd } = parsed;
    
    // Găsește cartea în JSON
    const book = bibleBooks.find(b => b.abbrev === bookAbbrev);
    
    if (!book) {
      return null;
    }
    
    // Verifică dacă capitolul există (indexul = capitol - 1)
    if (chapter < 1 || chapter > book.chapters.length) {
      return null;
    }
    
    const chapterVerses = book.chapters[chapter - 1];
    
    // Dacă e un interval de versete (ex: 3:5-6)
    if (verseEnd && verseEnd > verseStart) {
      const verses: string[] = [];
      
      for (let verse = verseStart; verse <= verseEnd; verse++) {
        // Verifică dacă versetul există (indexul = verset - 1)
        if (verse >= 1 && verse <= chapterVerses.length) {
          verses.push(cleanVerseText(chapterVerses[verse - 1]));
        }
      }
      
      if (verses.length === 0) {
        return null;
      }
      
      return {
        text: verses.join(' '),
        reference
      };
    } else {
      // Un singur verset
      if (verseStart < 1 || verseStart > chapterVerses.length) {
        return null;
      }
      
      return {
        text: cleanVerseText(chapterVerses[verseStart - 1]),
        reference
      };
    }
  } catch (error) {
    console.error('Eroare la căutarea versetului:', error);
    return null;
  }
}

/**
 * Verifică dacă o referință biblică are format valid complet
 * @param reference Referință de verificat
 * @returns true dacă are format complet valid (ex: "Proverbe 3:5")
 */
export function isValidReference(reference: string): boolean {
  const parsed = parseReference(reference);
  return parsed !== null;
}

/**
 * Hook React pentru căutarea automată a versetelor cu debounce
 */
export function useBibleLookup(
  reference: string,
  onVerseFound: (text: string) => void,
  debounceMs: number = 800
) {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Curăță timeout-ul anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Resetează starea
    setError(null);
    
    // Verifică dacă referința e validă
    if (!isValidReference(reference)) {
      setIsLoading(false);
      return;
    }
    
    // Setează loading
    setIsLoading(true);
    
    // Programează căutarea după debounce
    timeoutRef.current = setTimeout(async () => {
      const result = await fetchBibleVerse(reference);
      
      if (result) {
        onVerseFound(result.text);
        setError(null);
      } else {
        setError('Referință negăsită — poți scrie textul manual');
      }
      
      setIsLoading(false);
    }, debounceMs);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [reference, debounceMs, onVerseFound]);
  
  return { isLoading, error };
}
