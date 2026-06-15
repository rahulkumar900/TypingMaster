const fs = require('fs');

const KrutidevMap = {
  "e":  "म",
  "s":  "े",
  "a":  "ं"
};

const InscriptMap = {
  "c": "म",
  "s": "े",
  "x": "ं"
};

console.log("Krutidev 'esa':", "esa".split('').map(c => KrutidevMap[c]).join(''));
console.log("Inscript 'csx':", "csx".split('').map(c => InscriptMap[c]).join(''));

const target = "में";
const targetChars = Array.from(target);
console.log("Target:", targetChars);
