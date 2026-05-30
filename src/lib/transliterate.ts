'use client';

/**
 * Krutidev / Remington Hindi Keyboard Layout and Transliteration Engine
 * ====================================================================
 * This module converts legacy Remington typewriter keyboard inputs (as typed 
 * on a standard US QWERTY keyboard) into proper Unicode Devanagari (Hindi).
 * 
 * It keeps a buffer of raw ASCII keystrokes typed by the user, and converts 
 * the entire buffer to Devanagari Unicode on every keypress. This handles 
 * visual-to-phonetic reordering (like chhoti-i matra 'ि' typed before the 
 * consonant, and reph 'Z' typed after the consonant) perfectly.
 */

// Krutidev ASCII character patterns to be replaced
const ARRAY_ONE = [
  "ñ", "Q+Z", "sas", "aa", ")Z", "ZZ", "‘", "’", "“", "”",
  "å", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹",
  "¶+", "d+", "[+k", "[+", "x+", "T+", "t+", "M+", "<+", "Q+", ";+", "j+", "u+",
  "Ùk", "Ù", "Dr", "–", "—", "é", "™", "=kk", "f=k",
  "à", "á", "â", "ã", "ºz", "º", "í", "{k", "{", "=", "«",
  "Nî", "Vî", "Bî", "Mî", "<î", "|", "K", "}",
  "J", "Vª", "Mª", "<ªª", "Nª", "Ø", "Ý", "nzZ", "æ", "ç", "Á", "xz", "#", ":",
  "v‚", "vks", "vkS", "vk", "v", "b±", "Ã", "bZ", "b", "m", "Å", ",s", ",", "_",
  "ô", "d", "Dk", "D", "[k", "[", "x", "Xk", "X", "Ä", "?k", "?", "³",
  "pkS", "p", "Pk", "P", "N", "t", "Tk", "T", ">", "÷", "¥",
  "ê", "ë", "V", "B", "ì", "ï", "M+", "<+", "M", "<", ".k", ".",
  "r", "Rk", "R", "Fk", "F", ")", "n", "/k", "èk", "/", "Ë", "è", "u", "Uk", "U",
  "i", "Ik", "I", "Q", "¶", "c", "Ck", "C", "Hk", "H", "e", "Ek", "E",
  ";", "¸", "j", "y", "Yk", "Y", "G", "o", "Ok", "O",
  "'k", "'", "\"k", "\"", "l", "Lk", "L", "g",
  "È", "z",
  "Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó", "Ô", "Ö", "Ø", "Ù", "Ük", "Ü",
  "‚", "ks", "kS", "k", "h", "q", "w", "`", "s", "S",
  "a", "¡", "%", "W", "•", "·", "∙", "·", "~j", "~", "\\", "+", " ः",
  "^", "*", "Þ", "ß", "(", "¼", "½", "¿", "À", "¾", "A", "-", "&", "&", "Œ", "]", "~ ", "@"
];

// Corresponding Unicode Devanagari characters
const ARRAY_TWO = [
  "॰", "QZ+", "sa", "a", "र्द्ध", "Z", "\"", "\"", "'", "'",
  "०", "१", "२", "३", "४", "५", "६", "७", "८", "९",
  "फ़्", "क़", "ख़", "ख़्", "ग़", "ज्", "ज़", "ड़", "ढ़", "फ़", "य़", "ऱ", "ऩ",
  "त्त", "त्त्", "क्त", "दृ", "कृ", "न्न", "न्न्", "=k", "f=",
  "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष", "क्ष्", "त्र", "त्र्",
  "छ्य", "ट्य", "ठ्य", "ड्य", "ढ्य", "द्य", "ज्ञ", "द्व",
  "श्र", "ट्र", "ड्र", "ढ्र", "छ्र", "क्र", "फ्र", "र्द्र", "द्र", "प्र", "प्र", "ग्र", "रु", "रू",
  "ऑ", "ओ", "औ", "आ", "अ", "ईं", "ई", "ई", "इ", "उ", "ऊ", "ऐ", "ए", "ऋ",
  "क्क", "क", "क", "क्", "ख", "ख्", "ग", "ग", "ग्", "घ", "घ", "घ्", "ङ",
  "चै", "च", "च", "च्", "छ", "ज", "ज", "ज्", "झ", "झ", "ञ",
  "ट्ट", "ट्ठ", "ट", "ठ", "ड्ड", "ड्ढ", "ड़", "ढ़", "ड", "ढ", "ण", "ण्",
  "त", "त", "त्", "थ", "थ्", "द्ध", "द", "ध", "ध", "ध्", "ध्", "ध्", "न", "न", "न्",
  "प", "प", "प्", "फ", "फ्", "ब", "ब", "ब्", "भ", "भ्", "म", "म", "म्",
  "य", "य्", "र", "ल", "ल", "ल्", "ळ", "व", "व", "व्",
  "श", "श्", "ष", "ष्", "स", "स", "स्", "ह",
  "ीं", "्र",
  "द्द", "ट्ट", "ट्ठ", "ड्ड", "कृ", "भ", "्य", "ड्ढ", "झ", "क्र", "त्त्", "श", "श्",
  "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै",
  "ं", "ँ", "ः", "ॅ", "ऽ", "ऽ", "ऽ", "ऽ", "्र", "्", "?", "़", ":",
  "‘", "’", "“", "”", ";", "(", ")", "{", "}", "=", "।", ".", "-", "µ", "॰", ",", "् ", "/"
];

/**
 * Transliterates a legacy Krutidev (Remington GAIL) ASCII typed string into Hindi Unicode.
 */
export function krutidevToUnicode(text: string): string {
  if (!text) return '';

  let modified = "  " + text + "  ";

  // 1. Matra "f" (ि) positioning correction
  // In Krutidev, "f" is typed before the consonant. We must swap it to the right of the consonant.
  let pos_f = modified.lastIndexOf("f");
  while (pos_f !== -1) {
    if (pos_f < modified.length - 1) {
      modified = modified.substring(0, pos_f) +
                 modified.charAt(pos_f + 1) +
                 modified.charAt(pos_f) +
                 modified.substring(pos_f + 2);
    }
    pos_f = modified.lastIndexOf("f", pos_f - 1);
  }
  modified = modified.split("f").join("ि");

  // 2. Reph "Z" (र्) positioning correction
  // In Krutidev, "Z" is typed after the consonant and matras. In Unicode it goes before the consonant.
  let pos_r = modified.indexOf("Z");
  const matras = new Set(["‚", "k", "h", "q", "w", "`", "s", "S", "a", "¡", "%", "W", "·", "~"]);
  
  while (pos_r !== -1) {
    modified = modified.substring(0, pos_r) + modified.substring(pos_r + 1);
    
    // pos_r - 1 is the character before the removed Z.
    // If it's a matra, the consonant is at pos_r - 2.
    if (pos_r >= 2 && matras.has(modified.charAt(pos_r - 1))) {
      modified = modified.substring(0, pos_r - 2) + "j~" + modified.substring(pos_r - 2);
    } else if (pos_r >= 1) {
      modified = modified.substring(0, pos_r - 1) + "j~" + modified.substring(pos_r - 1);
    }
    
    // Scan for next Z in the modified string
    pos_r = modified.indexOf("Z");
  }

  modified = modified.trim();

  // 3. Map all Krutidev ASCII pattern sequences to Unicode Devanagari in priority order
  for (let i = 0; i < ARRAY_ONE.length; i++) {
    modified = modified.split(ARRAY_ONE[i]).join(ARRAY_TWO[i]);
  }

  return modified;
}

/**
 * Returns true if this language should use the transliteration layout mode.
 */
export function needsTransliteration(languageId: string): boolean {
  return [
    'hindi', 'marathi', 'gujarati', 'punjabi', 'bengali',
    'odia', 'assamese', 'manipuri', 'kannada', 'telugu',
    'tamil', 'malayalam', 'urdu',
  ].includes(languageId.toLowerCase());
}

/**
 * Transliteration state manager instantiated by TypingArena.
 */
export class HindiTransliterator {
  private rawBuffer = '';

  reset() {
    this.rawBuffer = '';
  }

  getOutput() {
    return krutidevToUnicode(this.rawBuffer);
  }

  processKey(key: string): string {
    if (key === 'Backspace') {
      this.rawBuffer = Array.from(this.rawBuffer).slice(0, -1).join('');
    } else if (key.length === 1) {
      this.rawBuffer += key;
    }
    return krutidevToUnicode(this.rawBuffer);
  }
}
