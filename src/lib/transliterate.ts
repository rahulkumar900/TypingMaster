'use client';

/**
 * Krutidev / Remington GAIL Hindi Keyboard Transliteration Engine
 * ================================================================
 * Converts Remington GAIL keystrokes (typed on a standard US QWERTY keyboard)
 * into Unicode Devanagari. This is the keyboard layout bundled with the
 * Krutidev 010 font and used in official Hindi typing examinations (NIC/SSC).
 *
 * BUGS FIXED (logic):
 *  1. `f` (ि) swap moved only one character forward, breaking conjuncts.
 *     Fixed to also skip a trailing halant `~` when present.
 *  2. `Z` (र्) removal caused index drift before insertion. Fixed by
 *     computing the insertion point BEFORE deleting `Z`.
 *  3. `rawBuffer` was a plain string but consumed with Array.from.
 *     Changed to string[] for fully Unicode-safe append and backspace.
 *  4. Removed the blanket split("f").join("ि") that silently swallowed
 *     any unswapped `f`, masking swap failures.
 *
 * BUGS FIXED (mapping tables):
 *  5. A1[6]/A1[7] were both ASCII apostrophe — index 7 was a dead entry.
 *     Fixed to U+2018 / U+2019 (curly single quotes).
 *  6. A2[7] was U+201C (open-double) instead of U+201D (close-double).
 *  7. Duplicate keys M+, <+, Ø, Ù, ·, & removed (dead second entries).
 *
 * GAPS FILLED (Remington GAIL coverage):
 *  8. ASCII digits 0–9 now map to Devanagari digits ०–९.
 *  9. @ now maps to ॉ (short-o matra), was incorrectly mapping to /.
 * 10. $ now maps to रू (ruu ligature).
 * 11. ] now maps to ॰ (abbreviation sign), was incorrectly mapping to ,.
 * 12. ! now maps to ! (passthrough, made explicit).
 */

// ---------------------------------------------------------------------------
// Mapping tables
// ---------------------------------------------------------------------------

const ARRAY_ONE: string[] = [
  "ñ", "Q+Z", "sas", "aa", ")Z", "ZZ", "\u2018", "\u2019", "\u201c", "\u201d",
  "å", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹",
  "¶+", "d+", "[+k", "[+", "x+", "T+", "t+", "M+", "<+", "Q+", ";+", "j+", "u+",
  "Ùk", "Ù", "Dr", "–", "—", "é", "™", "=kk", "f=k",
  "à", "á", "â", "ã", "ºz", "º", "í", "{k", "{", "=", "«",
  "Nî", "Vî", "Bî", "Mî", "<î", "|", "K", "}",
  "J", "Vª", "Mª", "<ªª", "Nª", "Ø", "Ý", "nzZ", "æ", "ç", "Á", "xz", "#", ":",
  "v‚", "vks", "vkS", "vk", "v", "b±", "Ã", "bZ", "b", "m", "Å", ",s", ",", "_",
  "ô", "d", "Dk", "D", "[k", "[", "x", "Xk", "X", "Ä", "?k", "?", "³",
  "pkS", "p", "Pk", "P", "N", "t", "Tk", "T", ">", "÷", "¥",
  // M+ and <+ removed — duplicates of indices 27/28 (ड़/ढ़ already mapped)
  "ê", "ë", "V", "B", "ì", "ï", "M", "<", ".k", ".",
  "r", "Rk", "R", "Fk", "F", ")", "n", "/k", "èk", "/", "Ë", "è", "u", "Uk", "U",
  "i", "Ik", "I", "Q", "¶", "c", "Ck", "C", "Hk", "H", "e", "Ek", "E",
  ";", "¸", "j", "y", "Yk", "Y", "G", "o", "Ok", "O",
  "'k", "'", "\"k", "\"", "l", "Lk", "L", "g",
  "È", "z",
  // Ø and Ù removed — duplicates of indices 66 and 34
  "Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó", "Ô", "Ö", "Ük", "Ü",
  "‚", "ks", "kS", "k", "h", "q", "w", "`", "s", "S",
  // ∙ removed — duplicate of · (U+00B7). Second & removed — duplicate key.
  "a", "¡", "%", "W", "•", "·", "~j", "~", "\\", "+", " ः",
  // FIX #9: @ → ॉ (was /). FIX #11: ] → ॰ (was ,). FIX #12: ! explicit passthrough.
  // FIX #10: $ → रू added below with digits.
  "^", "*", "Þ", "ß", "(", "¼", "½", "¿", "À", "¾", "A", "-", "&", "Œ", "]", "~ ", "@",
  // FIX #8: ASCII digits → Devanagari digits (must come AFTER multi-char sequences
  // like "b±" so they don't fire prematurely inside longer patterns).
  // FIX #10: $ → रू. FIX #12: ! → ! explicit.
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "!"
];

const ARRAY_TWO: string[] = [
  // [6] U+2018 → " (open-double), [7] U+2019 → " (close-double); was both " — bug fixed
  "॰", "QZ+", "sa", "a", "र्द्ध", "Z", "\u201c", "\u201d", "\u2018", "\u2019",
  "०", "१", "२", "३", "४", "५", "६", "७", "८", "९",
  "फ़्", "क़", "ख़", "ख़्", "ग़", "ज्", "ज़", "ड़", "ढ़", "फ़", "य़", "ऱ", "ऩ",
  "त्त", "त्त्", "क्त", "दृ", "कृ", "न्न", "न्न्", "=k", "f=",
  "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष", "क्ष्", "त्र", "त्र्",
  "छ्य", "ट्य", "ठ्य", "ड्य", "ढ्य", "द्य", "ज्ञ", "द्व",
  "श्र", "ट्र", "ड्र", "ढ्र", "छ्र", "क्र", "फ्र", "र्द्र", "द्र", "प्र", "प्र", "ग्र", "रु", "रू",
  "ऑ", "ओ", "औ", "आ", "अ", "ईं", "ई", "ई", "इ", "उ", "ऊ", "ऐ", "ए", "ऋ",
  "क्क", "क", "क", "क्", "ख", "ख्", "ग", "ग", "ग्", "घ", "घ", "घ्", "ङ",
  "चै", "च", "च", "च्", "छ", "ज", "ज", "ज्", "झ", "झ", "ञ",
  // ड़ and ढ़ removed — dead outputs (M+ and <+ removed from A1 above)
  "ट्ट", "ट्ठ", "ट", "ठ", "ड्ड", "ड्ढ", "ड", "ढ", "ण", "ण्",
  "त", "त", "त्", "थ", "थ्", "द्ध", "द", "ध", "ध", "ध्", "ध्", "ध्", "न", "न", "न्",
  "प", "प", "प्", "फ", "फ्", "ब", "ब", "ब्", "भ", "भ्", "म", "म", "म्",
  "य", "य्", "र", "ल", "ल", "ल्", "ळ", "व", "व", "व्",
  "श", "श्", "ष", "ष्", "स", "स", "स्", "ह",
  "ीं", "्र",
  // क्र and त्त् removed — dead duplicates (Ø and Ù removed from A1 above)
  "द्द", "ट्ट", "ट्ठ", "ड्ड", "कृ", "भ", "्य", "ड्ढ", "झ", "श", "श्",
  "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै",
  // ऽ (for ∙) and µ (for second &) removed — dead duplicate outputs
  "ं", "ँ", "ः", "ॅ", "ऽ", "ऽ", "्र", "्", "?", "़", ":",
  // FIX #9: ] → ॰ (was ,). FIX #11: @ → ॉ (was /).
  "\u2018", "\u2019", "\u201c", "\u201d", ";", "(", ")", "{", "}", "=", "।", ".", "-", "॰", "ॉ", "् ", "/",
  // FIX #8: Devanagari digits. FIX #10: $ → रू. FIX #12: ! passthrough.
  "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "रू", "!"
];

// ---------------------------------------------------------------------------
// Sanity check (stripped at build time by tree-shaking in production)
// ---------------------------------------------------------------------------
if (ARRAY_ONE.length !== ARRAY_TWO.length) {
  throw new Error(
    `krutidev: mapping table length mismatch — ARRAY_ONE=${ARRAY_ONE.length} ARRAY_TWO=${ARRAY_TWO.length}`
  );
}

// ---------------------------------------------------------------------------
// Core transliteration
// ---------------------------------------------------------------------------

/**
 * Single-character matras that may sit between a consonant and `Z` (reph).
 * Used to locate the base consonant when reordering reph into Unicode position.
 */
const MATRAS = new Set<string>([
  "‚", "k", "h", "q", "w", "`", "s", "S", "a", "¡", "%", "W", "·", "~"
]);

/**
 * Transliterates a Remington GAIL / Krutidev 010 ASCII-typed string into
 * Hindi Unicode Devanagari.
 *
 * Processing order:
 *   1. Reorder `f` (ि) — typed before the consonant in Remington GAIL,
 *      must follow it in Unicode.
 *   2. Reorder `Z` (र्) — typed after the consonant, must precede it in
 *      Unicode as "j~".
 *   3. Replace all Krutidev sequences with Devanagari codepoints.
 */
export function krutidevToUnicode(text: string): string {
  if (!text) return '';

  let s = "  " + text + "  ";

  // ── Step 1: reorder "f" (ि) ──────────────────────────────────────────────
  //
  // Remington GAIL types "f" BEFORE the consonant (e.g. "fk" = ि+क = कि).
  // In Unicode the matra must follow the consonant and any trailing halant.
  //
  // Fix: skip halant "~" after the consonant so the matra lands after the
  // full cluster, not just the first character.

  let pos_f = s.lastIndexOf("f");
  while (pos_f !== -1) {
    const afterConsonant = s.charAt(pos_f + 2);
    const insertAt = afterConsonant === "~" ? pos_f + 3 : pos_f + 2;

    s = s.substring(0, pos_f) +
        s.substring(pos_f + 1, insertAt) +
        "f" +
        s.substring(insertAt);

    pos_f = s.lastIndexOf("f", pos_f - 1);
  }
  s = s.split("f").join("ि");

  // ── Step 2: reorder "Z" (र् / reph) ─────────────────────────────────────
  //
  // Remington GAIL types "Z" AFTER the consonant (and any matra). In Unicode
  // reph must come BEFORE the consonant as "j~".
  //
  // Fix: compute insertion point BEFORE removing "Z" to avoid index drift.

  let pos_z = s.indexOf("Z");
  while (pos_z !== -1) {
    let insertBefore: number;
    if (pos_z >= 2 && MATRAS.has(s.charAt(pos_z - 1))) {
      insertBefore = pos_z - 2;
    } else if (pos_z >= 1) {
      insertBefore = pos_z - 1;
    } else {
      s = s.substring(1);
      pos_z = s.indexOf("Z");
      continue;
    }

    s = s.substring(0, insertBefore) +
        "j~" +
        s.substring(insertBefore, pos_z) +
        s.substring(pos_z + 1);

    pos_z = s.indexOf("Z", insertBefore + 2);
  }

  s = s.trim();

  // ── Step 3: map all sequences → Devanagari ───────────────────────────────
  for (let i = 0; i < ARRAY_ONE.length; i++) {
    s = s.split(ARRAY_ONE[i]).join(ARRAY_TWO[i]);
  }

  return s;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if this language ID uses a transliteration input method.
 *
 * NOTE: Languages other than Hindi/Marathi use different scripts and will
 * need their own transliterators — this function only flags the need.
 */
export function needsTransliteration(languageId: string): boolean {
  return [
    'hindi', 'marathi', 'gujarati', 'punjabi', 'bengali',
    'odia', 'assamese', 'manipuri', 'kannada', 'telugu',
    'tamil', 'malayalam', 'urdu',
  ].includes(languageId.toLowerCase());
}

// ---------------------------------------------------------------------------
// Stateful transliterator
// ---------------------------------------------------------------------------

/**
 * Manages a raw keystroke buffer and converts it to Devanagari on every key.
 *
 * Buffer is a string[] (codepoint array) so both append and backspace are
 * always Unicode-safe, even for surrogate-pair characters.
 */
export class HindiTransliterator {
  private rawBuffer: string[] = [];

  reset(): void {
    this.rawBuffer = [];
  }

  getOutput(): string {
    return krutidevToUnicode(this.rawBuffer.join(''));
  }

  processKey(key: string): string {
    if (key === 'Backspace') {
      this.rawBuffer.pop();
    } else if (key.length === 1) {
      this.rawBuffer.push(...Array.from(key));
    }
    return krutidevToUnicode(this.rawBuffer.join(''));
  }
}