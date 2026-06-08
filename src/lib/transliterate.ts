'use client';

// Import engines
import { KrutidevTransliterator } from './mappings/krutidev-engine';
import { UrduTransliterator } from './mappings/urdu-engine';
import { InscriptTransliterator } from './mappings/inscript-engine';

// Import Maps
import { ASSAMESE_MAP } from './mappings/assamese';
import { BENGALI_MAP } from './mappings/bengali';
import { GUJARATI_MAP } from './mappings/gujarati';
import { KANNADA_MAP } from './mappings/kannada';
import { MALAYALAM_MAP } from './mappings/malayalam';
import { MANIPURI_MAP } from './mappings/manipuri';
import { ODIA_MAP } from './mappings/odia';
import { PUNJABI_MAP } from './mappings/punjabi';
import { TAMIL_MAP } from './mappings/tamil';
import { TELUGU_MAP } from './mappings/telugu';

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------
export interface TransliteratorEngine {
  reset(): void;
  getOutput(): string;
  processKey(key: string): string;
}

// ---------------------------------------------------------------------------
// Engine Factory
// ---------------------------------------------------------------------------
export function createTransliterator(languageId: string): TransliteratorEngine | null {
  const lang = languageId.toLowerCase();
  
  if (lang === 'hindi' || lang === 'marathi') {
    return new KrutidevTransliterator();
  }
  
  if (lang === 'urdu') {
    return new UrduTransliterator();
  }

  // Route to the appropriate map
  switch (lang) {
    case 'bengali': return new InscriptTransliterator(BENGALI_MAP);
    case 'assamese': return new InscriptTransliterator(ASSAMESE_MAP);
    case 'manipuri': return new InscriptTransliterator(MANIPURI_MAP);
    case 'punjabi': return new InscriptTransliterator(PUNJABI_MAP);
    case 'gujarati': return new InscriptTransliterator(GUJARATI_MAP);
    case 'odia': return new InscriptTransliterator(ODIA_MAP);
    case 'tamil': return new InscriptTransliterator(TAMIL_MAP);
    case 'telugu': return new InscriptTransliterator(TELUGU_MAP);
    case 'kannada': return new InscriptTransliterator(KANNADA_MAP);
    case 'malayalam': return new InscriptTransliterator(MALAYALAM_MAP);
    default:
      return null; // OS Keyboard natively
  }
}

export function needsTransliteration(languageId: string): boolean {
  return createTransliterator(languageId) !== null;
}