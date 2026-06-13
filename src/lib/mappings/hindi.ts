export const HINDI_INSCRIPT_MAP: Record<string, string> = {
  // Digits
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",

  // Shift + Digits (Special Characters)
  // Usually same as US keyboard, but standard Inscript has some mappings
  // We'll leave them to passthrough or map them explicitly if needed.
  // Standard Inscript maps:
  "~": "ञ", // Actually, shift+` is normally ~ or sometimes ॠ. Let's do common ones.
  "`": "ृ", // or ़ ? Actually ] is nukta.

  // Top Row (QWERTY)
  "q": "ौ",
  "Q": "औ",
  "w": "ै",
  "W": "ऐ",
  "e": "ा",
  "E": "आ",
  "r": "ी",
  "R": "ई",
  "t": "ू",
  "T": "ऊ",
  "y": "ब",
  "Y": "भ",
  "u": "ह",
  "U": "ङ",
  "i": "ग",
  "I": "घ",
  "o": "द",
  "O": "ध",
  "p": "ज",
  "P": "झ",
  "[": "ड",
  "{": "ढ",
  "]": "़",
  "}": "ञ",

  // Home Row (ASDFG)
  "a": "ो",
  "A": "ओ",
  "s": "े",
  "S": "ए",
  "d": "्",
  "D": "अ",
  "f": "ि",
  "F": "इ",
  "g": "ु",
  "G": "उ",
  "h": "प",
  "H": "फ",
  "j": "र",
  "J": "ऱ",
  "k": "क",
  "K": "ख",
  "l": "त",
  "L": "थ",
  ";": "च",
  ":": "छ",
  "'": "ट",
  "\"": "ठ",
  "\\": "ॉ",
  "|": "ऑ",

  // Bottom Row (ZXCVB)
  "z": "े", // short e ॆ
  "Z": "ऎ",
  "x": "ं",
  "X": "ँ",
  "c": "म",
  "C": "ण",
  "v": "न",
  "V": "ऩ",
  "b": "व",
  "B": "ळ",
  "n": "ल",
  "N": "ऴ",
  "m": "स",
  "M": "श",
  ",": ",",
  "<": "ष",
  ".": ".",
  ">": "।",
  "/": "य",
  "?": "य़"
};
