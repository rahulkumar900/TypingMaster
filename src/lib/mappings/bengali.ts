/**
 * Bengali INSCRIPT Keyboard Map
 * ==============================
 * Standard BIS IS 1988 INSCRIPT layout for Bengali, used on all Indian
 * government computers and in official typing examinations.
 *
 * This is a direct single-key lookup map (no pre-pass reordering needed —
 * unlike Probhat/Remington-family layouts, INSCRIPT places matras AFTER
 * the consonant in typing order, matching Unicode logical order).
 *
 * BUGS FIXED vs original:
 *  1. z -> ৅ (U+09C5) was UNASSIGNED in Unicode. Fixed to ৄ (U+09C4,
 *     BENGALI VOWEL SIGN VOCALIC RR).
 *  2. > -> ৤ (U+09E4) was UNASSIGNED in Unicode. Fixed to ৷ (U+09F7,
 *     BENGALI CURRENCY NUMERATOR FOUR / used as section daari).
 *
 * ADDITIONS vs original:
 *  3. "|" -> ॥  double daari (was missing; standard INSCRIPT Row-2 shift).
 *  4. "V" -> ৷  single daari alternate (Shift+V in standard INSCRIPT).
 *  5. ড় (U+09DC) added via "$" key (Shift+4) — very common in Bengali
 *     (ড+়), was previously only composable via "[" + "]".
 *  6. ঢ় (U+09DD) added via "%" key (Shift+5) — similarly common.
 *  7. "~" -> ঁ  chandrabindu (Shift+`) — was missing, now explicit.
 *  8. "b" -> ঵ (U+09B5, BENGALI LETTER VA) retained — this is a valid
 *     Unicode character used in Sanskrit loanwords. The more common ব (ba)
 *     is on "y". If your use-case never needs VA, remap b -> ব.
 *
 * NOTE on Z -> ঍ (U+098D, BENGALI LETTER SHORT E):
 *  This codepoint IS assigned in Unicode but is extremely rare (Vedic use).
 *  Standard INSCRIPT uses Shift+Z for this position. Retained as-is.
 *
 * ── MULTI-KEY COMBINATION REFERENCE ────────────────────────────────────────
 *
 * CONJUNCTS  (consonant + d + consonant, chain for 3+ clusters)
 *  kd<     ক্ষ   ksha         (k + ্ + <)
 *  pd}     জ্ঞ   gya/jña      (p + ্ + })
 *  ldj     ত্র   tra          (l + ্ + j)
 *  Mdj     শ্র   shra         (M + ্ + j)
 *  kdj     ক্র   kra          (k + ্ + j)
 *  jdk     র্ক   rka (reph)   (j + ্ + k)
 *  vdl     ন্ত   nta          (v + ্ + l)
 *  vdo     ন্দ   nda          (v + ্ + o)
 *  vdldj   ন্ত্র ntra         (v + ্ + l + ্ + j)
 *  kd<dc   ক্ষ্ম kshma        (k + ্ + < + ্ + c)
 *  mdyemdLd/  স্বাস্থ্য  (complex 3-conjunct word)
 *
 * NUKTA FORMS  (two ways to type ড়, ঢ়, য়)
 *  $       ড়   dda+nukta     (single key — precomposed)
 *  %       ঢ়   ddha+nukta    (single key — precomposed)
 *  ?       য়   ya+nukta      (single key — precomposed)
 *  []      ড়   ড + ়         (compose via nukta key ])
 *  {]      ঢ়   ঢ + ়
 *  /]      য়   য + ়
 *  p]      জ়   জ + ় (za — Perso-Arabic loanwords)
 *  H]      ফ়   ফ + ় (fa)
 *
 * DIACRITICS
 *  <any>x   + ং  anusvara    e.g. yexne = বাংলা
 *  <any>X   + ঁ  chandrabindu
 *  <any>~   + ঁ  chandrabindu (alternate)
 *  <any>_   + ঃ  visarga
 *
 * HASANTA (visible half-consonant, word-final)
 *  kd      ক্   half-ka (consonant + d with nothing after)
 *
 * SAMPLE WORDS
 *  yexne        বাংলা       (Bangla)
 *  yexneosM     বাংলাদেশ   (Bangladesh)
 *  Ecf          আমি         (I/me)
 *  knkele       কলকাতা     (Kolkata)
 *  pd}ev        জ্ঞান       (knowledge)
 *  kd<ce        ক্ষমা       (forgiveness)
 *  Mdjs<d"      শ্রেষ্ঠ    (greatest)
 *  mdyeOrvle    স্বাধীনতা  (independence)
 */

export const BENGALI_MAP: Record<string, string> = {
  // ── Digits ──────────────────────────────────────────────────────────────
  "0": "০",   // U+09E6
  "1": "১",   // U+09E7
  "2": "২",   // U+09E8
  "3": "৩",   // U+09E9
  "4": "৪",   // U+09EA
  "5": "৫",   // U+09EB
  "6": "৬",   // U+09EC
  "7": "৭",   // U+09ED
  "8": "৮",   // U+09EE
  "9": "৯",   // U+09EF

  // ── Diacritics & signs ──────────────────────────────────────────────────
  "X": "ঁ",   // U+0981  chandrabindu         (Shift+X)
  "~": "ঁ",   // U+0981  chandrabindu          (Shift+` alternate)
  "x": "ং",   // U+0982  anusvara
  "_": "ঃ",   // U+0983  visarga               (Shift+-)
  "]": "়",   // U+09BC  nukta                 (combines with ড, ঢ, য etc.)

  // ── Standalone vowels ───────────────────────────────────────────────────
  "D": "অ",   // U+0985  a
  "E": "আ",   // U+0986  aa
  "F": "ই",   // U+0987  i
  "R": "ঈ",   // U+0988  ii  (long)
  "G": "উ",   // U+0989  u
  "T": "ঊ",   // U+098A  uu  (long)
  "+": "ঋ",   // U+098B  vocalic R             (Shift+=)
  "Z": "঍",   // U+098D  short E (rare/Vedic)  (Shift+Z)
  "S": "এ",   // U+098F  e
  "W": "ঐ",   // U+0990  ai
  "A": "ও",   // U+0993  o
  "Q": "ঔ",   // U+0994  au

  // ── Consonants ──────────────────────────────────────────────────────────
  "k": "ক",   // U+0995  ka
  "K": "খ",   // U+0996  kha                   (Shift+k)
  "i": "গ",   // U+0997  ga
  "I": "ঘ",   // U+0998  gha                   (Shift+i)
  "U": "ঙ",   // U+0999  nga                   (Shift+u)
  ";": "চ",   // U+099A  ca
  ":": "ছ",   // U+099B  cha                   (Shift+;)
  "p": "জ",   // U+099C  ja
  "P": "ঝ",   // U+099D  jha                   (Shift+p)
  "}": "ঞ",   // U+099E  nya                   (Shift+])
  "'": "ট",   // U+099F  tta  (retroflex)
  "\"": "ঠ",   // U+09A0  ttha (retroflex)       (Shift+')
  "[": "ড",   // U+09A1  dda  (retroflex)
  "{": "ঢ",   // U+09A2  ddha (retroflex)       (Shift+[)
  "C": "ণ",   // U+09A3  nna  (retroflex)       (Shift+c)
  "l": "ত",   // U+09A4  ta
  "L": "থ",   // U+09A5  tha                   (Shift+l)
  "o": "দ",   // U+09A6  da
  "O": "ধ",   // U+09A7  dha                   (Shift+o)
  "v": "ন",   // U+09A8  na
  "h": "প",   // U+09AA  pa
  "H": "ফ",   // U+09AB  pha                   (Shift+h)
  "y": "ব",   // U+09AC  ba
  "Y": "ভ",   // U+09AD  bha                   (Shift+y)
  "c": "ম",   // U+09AE  ma
  "/": "য",   // U+09AF  ya
  "j": "র",   // U+09B0  ra
  "n": "ল",   // U+09B2  la
  "b": "঵",   // U+09B5  va (Bengali VA, Sanskrit loanwords — see note above)
  "M": "শ",   // U+09B6  sha  (palatal)         (Shift+m)
  "<": "ষ",   // U+09B7  ssa  (retroflex sha)   (Shift+,)
  "m": "স",   // U+09B8  sa
  "u": "হ",   // U+09B9  ha

  // ── Nukta-form consonants (precomposed) ─────────────────────────────────
  // FIX #5: Added ড় and ঢ় — extremely common in Bengali
  // (previously only reachable by composing [ + ] or { + ])
  "$": "ড়",  // U+09DC        dda+nukta  (rra)    (Shift+4)
  "%": "ঢ়",  // U+09DD        ddha+nukta (rha)   (Shift+5)
  "?": "য়",  // U+09AF+U+09BC ya+nukta   (yya)   (Shift+/)
  "J": "র়",  // U+09B0+U+09BC ra+nukta           (Shift+J) — standard INSCRIPT

  // ── Vowel signs (matras) ────────────────────────────────────────────────
  "e": "া",   // U+09BE  aa-matra
  "f": "ি",   // U+09BF  i-matra
  "r": "ী",   // U+09C0  ii-matra   (long)
  "g": "ু",   // U+09C1  u-matra
  "t": "ূ",   // U+09C2  uu-matra   (long)
  "=": "ৃ",   // U+09C3  vocalic-R matra
  // FIX #1: z was U+09C5 (UNASSIGNED). Corrected to U+09C4 (vocalic RR matra).
  "z": "ৄ",   // U+09C4  vocalic-RR matra  (rare but valid)
  "s": "ে",   // U+09C7  e-matra
  "w": "ৈ",   // U+09C8  ai-matra
  "a": "ো",   // U+09CB  o-matra
  "q": "ৌ",   // U+09CC  au-matra

  // ── Virama (hasanta) ────────────────────────────────────────────────────
  "d": "্",   // U+09CD  virama / hasanta — joins consonants into conjuncts

  // ── Punctuation ─────────────────────────────────────────────────────────
  // FIX #3: "|" added (was missing) — double daari, standard INSCRIPT Row-2 shift
  "|": "॥",   // U+0964+U+0964  double daari
  // FIX #4: "V" -> ৷ section daari (Shift+V in standard INSCRIPT)
  "V": "৷",   // U+09F7  Bengali currency numerator (used as section separator)
  // FIX #2: ">" was U+09E4 (UNASSIGNED). Corrected to U+09F7 Bengali daari.
  ">": "৷",   // U+09F7  same daari (Shift+. alternate)
  ".": "।",   // U+0964  Bengali daari (full stop)
  "-": "-",
  ",": ",",
  "!": "!",
  "@": "ঈ",   // U+0988  ii vowel (Shift+2 in standard INSCRIPT — alternate to R)
  "#": "ঋ",   // U+098B  vocalic-R (Shift+3 — alternate to +)
  "^": "\u2018", // left single quote   (Shift+6)
  "&": "\u2019", // right single quote  (Shift+7)
  "*": "\u201C", // left double quote   (Shift+8)
  "(": "(",      // open bracket        (Shift+9)
  ")": ")",      // close bracket       (Shift+0)};
}
/**
 * Applies a single INSCRIPT keystroke to the output buffer.
 * Unlike Remington/Probhat layouts, no pre-pass reordering is needed —
 * INSCRIPT types matras AFTER consonants in correct Unicode logical order.
 *
 * @param key  The keyboard event key value (e.g. "k", "Shift+k" already
 *             resolved to "K" by the caller).
 * @returns    The Unicode character(s) to append, or null if the key has
 *             no mapping (caller should pass it through unchanged).
 */



export function inscriptKeyToUnicode(key: string): string | null {
  return BENGALI_MAP[key] ?? null;
}
/**
 * Stateful INSCRIPT transliterator.
 * Because INSCRIPT maps directly to Unicode logical order, the only
 * "intelligence" needed is backspace handling (pop one codepoint, not
 * one byte, from the buffer).
 */
export class BengaliInscriptTransliterator {
  /** Unicode codepoint array — safe for surrogate pairs and multi-char matras. */
  private buffer: string[] = [];

  reset(): void {
    this.buffer = [];
  }

  getOutput(): string {
    return this.buffer.join("");
  }

  processKey(key: string): string {
    if (key === "Backspace") {
      // Pop one logical codepoint. Note: য় is two codepoints (য + ়) — both
      // are inserted together by the "?" mapping, so we pop only the last one.
      // For full grapheme-cluster backspace (e.g. nukta-composed chars),
      // use Intl.Segmenter in browsers that support it.
      this.buffer.pop();
    } else {
      const mapped = inscriptKeyToUnicode(key);
      if (mapped !== null) {
        // Push each codepoint individually (handles multi-codepoint outputs like য়)
        this.buffer.push(...Array.from(mapped));
      } else if (key.length === 1) {
        // Unmapped printable key — pass through as-is
        this.buffer.push(key);
      }
    }
    return this.getOutput();
  }
}