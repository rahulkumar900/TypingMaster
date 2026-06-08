import { TransliteratorEngine } from '../transliterate';

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
  "ê", "ë", "V", "B", "ì", "ï", "M", "<", ".k", ".",
  "r", "Rk", "R", "Fk", "F", ")", "n", "/k", "èk", "/", "Ë", "è", "u", "Uk", "U",
  "i", "Ik", "I", "Q", "¶", "c", "Ck", "C", "Hk", "H", "e", "Ek", "E",
  ";", "¸", "j", "y", "Yk", "Y", "G", "o", "Ok", "O",
  "'k", "'", "\"k", "\"", "l", "Lk", "L", "g",
  "È", "z",
  "Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó", "Ô", "Ö", "Ük", "Ü",
  "‚", "ks", "kS", "k", "h", "q", "w", "`", "s", "S",
  "a", "¡", "%", "W", "•", "·", "~j", "~", "\\", "+", " ः",
  "^", "*", "Þ", "ß", "(", "¼", "½", "¿", "À", "¾", "A", "-", "&", "Œ", "]", "~ ", "@",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "!"
];

const ARRAY_TWO: string[] = [
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
  "ट्ट", "ट्ठ", "ट", "ठ", "ड्ड", "ड्ढ", "ड", "ढ", "ण", "ण्",
  "त", "त", "त्", "थ", "थ्", "द्ध", "द", "ध", "ध", "ध्", "ध्", "ध्", "न", "न", "न्",
  "प", "प", "प्", "फ", "फ्", "ब", "ब", "ब्", "भ", "भ्", "म", "म", "म्",
  "य", "य्", "र", "ल", "ल", "ल्", "ळ", "व", "व", "व्",
  "श", "श्", "ष", "ष्", "स", "स", "स्", "ह",
  "ीं", "्र",
  "द्द", "ट्ट", "ट्ठ", "ड्ड", "कृ", "भ", "्य", "ड्ढ", "झ", "श", "श्",
  "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै",
  "ं", "ँ", "ः", "ॅ", "ऽ", "ऽ", "्र", "्", "?", "़", ":",
  "\u2018", "\u2019", "\u201c", "\u201d", ";", "(", ")", "{", "}", "=", "।", ".", "-", "॰", "॰", "् ", "ॉ",
  "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "रू", "!"
];

const MATRAS = new Set<string>([
  "‚", "k", "h", "q", "w", "`", "s", "S", "a", "¡", "%", "W", "·", "~"
]);

export function krutidevToUnicode(text: string): string {
  if (!text) return '';

  let s = "\uFFFF\uFFFF" + text + "\uFFFF\uFFFF";

  let pos_f = s.lastIndexOf("f");
  while (pos_f !== -1) {
    const afterConsonant = s.charAt(pos_f + 2);
    const insertAt = afterConsonant === "~" ? pos_f + 3 : pos_f + 2;
    s = s.substring(0, pos_f) + s.substring(pos_f + 1, insertAt) + "f" + s.substring(insertAt);
    pos_f = s.lastIndexOf("f", pos_f - 1);
  }
  s = s.split("f").join("ि");

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

    s = s.substring(0, insertBefore) + "j~" + s.substring(insertBefore, pos_z) + s.substring(pos_z + 1);
    pos_z = s.indexOf("Z", insertBefore + 2);
  }

  s = s.split("\uFFFF").join("");

  for (let i = 0; i < ARRAY_ONE.length; i++) {
    s = s.split(ARRAY_ONE[i]).join(ARRAY_TWO[i]);
  }

  return s;
}

export class KrutidevTransliterator implements TransliteratorEngine {
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
