'use client';

/**
 * Hindi Phonetic Transliteration Engine
 * Converts Latin phonetic input to Devanagari Unicode in real-time.
 *
 * Scheme: ITRANS-inspired (commonly used in Indian typing tools)
 * Examples:
 *   "bharat" → "भारत"
 *   "namaste" → "नमस्ते"
 *   "hindi" → "हिंदी"
 */

// -----------------------------------------------------------------------
// Mapping tables — longer sequences MUST come before shorter ones
// -----------------------------------------------------------------------

type ConsonantEntry = { latin: string; dev: string };
type VowelEntry = { latin: string; standalone: string; matra: string };

const CONSONANTS: ConsonantEntry[] = [
  // Clusters
  { latin: 'ksh', dev: 'क्ष' }, { latin: 'gya', dev: 'ज्ञ' },
  { latin: 'dny', dev: 'ज्ञ' }, { latin: 'tr', dev: 'त्र' },
  // Aspirated + others (2-char)
  { latin: 'kh', dev: 'ख' }, { latin: 'gh', dev: 'घ' }, { latin: 'ng', dev: 'ङ' },
  { latin: 'Ch', dev: 'छ' }, { latin: 'ch', dev: 'च' }, { latin: 'jh', dev: 'झ' }, { latin: 'ny', dev: 'ञ' },
  { latin: 'Th', dev: 'ठ' }, { latin: 'Dh', dev: 'ढ' },
  { latin: 'th', dev: 'थ' }, { latin: 'dh', dev: 'ध' },
  { latin: 'ph', dev: 'फ' }, { latin: 'bh', dev: 'भ' },
  { latin: 'sh', dev: 'श' }, { latin: 'Sh', dev: 'ष' },
  // Simple consonants
  { latin: 'k', dev: 'क' }, { latin: 'g', dev: 'ग' },
  { latin: 'c', dev: 'च' }, { latin: 'j', dev: 'ज' },
  { latin: 'T', dev: 'ट' }, { latin: 'D', dev: 'ड' }, { latin: 'N', dev: 'ण' },
  { latin: 't', dev: 'त' }, { latin: 'd', dev: 'द' }, { latin: 'n', dev: 'न' },
  { latin: 'p', dev: 'प' }, { latin: 'f', dev: 'फ' }, { latin: 'b', dev: 'ब' }, { latin: 'm', dev: 'म' },
  { latin: 'y', dev: 'य' }, { latin: 'r', dev: 'र' }, { latin: 'l', dev: 'ल' },
  { latin: 'v', dev: 'व' }, { latin: 'w', dev: 'व' },
  { latin: 's', dev: 'स' }, { latin: 'h', dev: 'ह' },
];

const VOWELS: VowelEntry[] = [
  // Multi-char vowels first
  { latin: 'aa', standalone: 'आ', matra: 'ा' },
  { latin: 'ii', standalone: 'ई', matra: 'ी' },
  { latin: 'uu', standalone: 'ऊ', matra: 'ू' },
  { latin: 'ai', standalone: 'ऐ', matra: 'ै' },
  { latin: 'au', standalone: 'औ', matra: 'ौ' },
  // Single-char vowels
  { latin: 'a',  standalone: 'अ', matra: '' },   // inherent — no matra
  { latin: 'i',  standalone: 'इ', matra: 'ि' },
  { latin: 'u',  standalone: 'उ', matra: 'ु' },
  { latin: 'e',  standalone: 'ए', matra: 'े' },
  { latin: 'o',  standalone: 'ओ', matra: 'ो' },
];

// Special characters
const HALANT = '्';           // Virama — kills inherent vowel between consonants
const ANUSVARA = 'ं';        // Nasalisation (M or ~)
const VISARGA = 'ः';         // Aspiration (H)
const NUKTA = '़';            // Nukta dot

// Devanagari code point ranges
const DEV_CONSONANT_RE = /[\u0915-\u0939\u0958-\u095F]/; // क–ह + nukta forms
const DEV_ANY_RE = /[\u0900-\u097F]/;

// Check if a character is a Devanagari consonant (ends with inherent 'a')
function isDevConsonant(ch: string): boolean {
  return DEV_CONSONANT_RE.test(ch);
}

// -----------------------------------------------------------------------
// Core transliteration engine
// -----------------------------------------------------------------------

export class HindiTransliterator {
  private buffer = '';       // Unconverted Latin buffer
  private result = '';       // Fully converted Devanagari output

  reset() {
    this.buffer = '';
    this.result = '';
  }

  getOutput(): string {
    return this.result + this.bufferToDevanagari(this.buffer);
  }

  /**
   * Process a single input character.
   * Returns the updated full output string.
   */
  processKey(key: string): string {
    // Handle backspace
    if (key === 'Backspace') {
      this.handleBackspace();
      return this.getOutput();
    }

    // Non-alphabetic / punctuation — flush buffer and append directly
    if (!/[a-zA-Z~]/.test(key)) {
      this.flush();
      this.result += key;
      return this.getOutput();
    }

    // Special: M = anusvara, H = visarga
    if (key === 'M') {
      this.flush();
      this.result += ANUSVARA;
      return this.getOutput();
    }
    if (key === 'H') {
      this.flush();
      this.result += VISARGA;
      return this.getOutput();
    }

    this.buffer += key;

    // Try to greedily convert the buffer
    this.tryConvertBuffer();

    return this.getOutput();
  }

  private tryConvertBuffer() {
    let buf = this.buffer;
    let converted = '';
    let prevWasConsonant = this.resultEndsWithConsonant();

    while (buf.length > 0) {
      // 1. Try vowel match
      const vowelMatch = this.matchVowel(buf);
      if (vowelMatch) {
        if (prevWasConsonant) {
          // Remove implicit halant from previous result if present
          if (converted === '' && this.result.endsWith(HALANT)) {
            this.result = this.result.slice(0, -HALANT.length);
          } else if (converted.endsWith(HALANT)) {
            converted = converted.slice(0, -HALANT.length);
          }
          converted += vowelMatch.matra; // matra after consonant
        } else {
          converted += vowelMatch.standalone; // standalone vowel
        }
        buf = buf.slice(vowelMatch.latin.length);
        prevWasConsonant = false;
        continue;
      }

      // 2. Try consonant match
      const consMatch = this.matchConsonant(buf);
      if (consMatch) {
        if (prevWasConsonant) {
          // Add halant to join consonants (conjunct)
          converted += HALANT;
        }
        converted += consMatch.dev;
        buf = buf.slice(consMatch.latin.length);
        prevWasConsonant = true;
        continue;
      }

      // 3. No match yet — could be a partial sequence; keep remaining in buffer
      break;
    }

    if (converted) {
      this.result += converted;
      this.buffer = buf;
    }
  }

  private flush() {
    // Force-convert remaining buffer
    const remaining = this.bufferToDevanagari(this.buffer);
    this.result += remaining;
    this.buffer = '';
  }

  private bufferToDevanagari(buf: string): string {
    if (!buf) return '';
    let out = '';
    let prevWasConsonant = this.resultEndsWithConsonant();

    while (buf.length > 0) {
      const vowelMatch = this.matchVowel(buf);
      if (vowelMatch) {
        if (prevWasConsonant) {
          if (out.endsWith(HALANT)) out = out.slice(0, -HALANT.length);
          out += vowelMatch.matra;
        } else {
          out += vowelMatch.standalone;
        }
        buf = buf.slice(vowelMatch.latin.length);
        prevWasConsonant = false;
        continue;
      }

      const consMatch = this.matchConsonant(buf);
      if (consMatch) {
        if (prevWasConsonant) out += HALANT;
        out += consMatch.dev;
        buf = buf.slice(consMatch.latin.length);
        prevWasConsonant = true;
        continue;
      }

      // Unrecognized character — pass through
      out += buf[0];
      buf = buf.slice(1);
      prevWasConsonant = false;
    }

    return out;
  }

  private resultEndsWithConsonant(): boolean {
    const fullResult = this.result;
    if (!fullResult) return false;
    const lastChar = fullResult[fullResult.length - 1];
    return isDevConsonant(lastChar);
  }

  private matchVowel(buf: string): VowelEntry | null {
    for (const v of VOWELS) {
      if (buf.startsWith(v.latin)) {
        // Ensure it's not actually the start of a longer vowel
        const nextIdx = v.latin.length;
        const nextChar = buf[nextIdx] || '';
        // e.g. 'a' should not match if 'aa' is coming
        if (v.latin === 'a' && nextChar === 'a') continue;
        if (v.latin === 'a' && nextChar === 'i') continue; // 'ai'
        if (v.latin === 'a' && nextChar === 'u') continue; // 'au'
        if (v.latin === 'i' && nextChar === 'i') continue; // 'ii'
        if (v.latin === 'u' && nextChar === 'u') continue; // 'uu'
        if (v.latin === 'a' && nextChar === 'a') continue;
        return v;
      }
    }
    return null;
  }

  private matchConsonant(buf: string): ConsonantEntry | null {
    for (const c of CONSONANTS) {
      if (buf.startsWith(c.latin)) return c;
    }
    return null;
  }

  private handleBackspace() {
    if (this.buffer.length > 0) {
      this.buffer = this.buffer.slice(0, -1);
    } else if (this.result.length > 0) {
      // Remove last Unicode character (handles multi-byte Devanagari)
      this.result = Array.from(this.result).slice(0, -1).join('');
    }
  }
}

/**
 * Convert a full Latin phonetic string to Devanagari.
 * Useful for one-shot conversion (not interactive).
 */
export function transliterateHindi(latin: string): string {
  const engine = new HindiTransliterator();
  for (const char of latin) {
    engine.processKey(char);
  }
  return engine.getOutput();
}

/**
 * Returns true if the language requires phonetic transliteration in the browser.
 * (i.e. does not use a standard Latin keyboard natively)
 */
export function needsTransliteration(languageId: string): boolean {
  return [
    'hindi', 'marathi', 'gujarati', 'punjabi', 'bengali',
    'odia', 'assamese', 'manipuri', 'kannada', 'telugu', 'tamil', 'malayalam'
  ].includes(languageId);
}
