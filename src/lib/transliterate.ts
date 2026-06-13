'use client';

import { MacroEngine, PassThroughEngine } from './engine';
import { KRUTIDEV_010_MAP, REMINGTON_GAIL_MAP } from './maps';
import { ASSAMESE_MAP } from './mappings/assamese';
import { BENGALI_MAP, BENGALI_BIJOY_MAP } from './mappings/bengali';
import { GUJARATI_MAP } from './mappings/gujarati';
import { KANNADA_MAP } from './mappings/kannada';
import { MALAYALAM_MAP } from './mappings/malayalam';
import { MANIPURI_MAP } from './mappings/manipuri';
import { ODIA_MAP } from './mappings/odia';
import { PUNJABI_MAP } from './mappings/punjabi';
import { TAMIL_MAP } from './mappings/tamil';
import { TELUGU_MAP } from './mappings/telugu';
import { URDU_MAP } from './mappings/urdu';
import { HINDI_INSCRIPT_MAP } from './mappings/hindi';
export type LayoutId = 
  | 'MANGAL_INSCRIPT' | 'MANGAL_GAIL' | 'KRUTIDEV_010' 
  | 'ASSAMESE_INSCRIPT' | 'BENGALI_INSCRIPT' | 'BENGALI_BIJOY' 
  | 'GUJARATI_INSCRIPT' | 'KANNADA_INSCRIPT' | 'MALAYALAM_INSCRIPT'
  | 'MANIPURI_INSCRIPT' | 'ODIA_INSCRIPT' | 'PUNJABI_INSCRIPT'
  | 'TAMIL_INSCRIPT' | 'TELUGU_INSCRIPT' | 'URDU_PHONETIC'
  | 'OS_DEFAULT';

export interface LayoutConfig {
  id: LayoutId;
  name?: string;
  engineMode?: 'DIRECT' | 'REMAP_REGEX';
  backspaceAllowed: boolean;
}

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
export function createTypingEngine(config: LayoutConfig): TransliteratorEngine {
  switch (config.id) {
    case 'KRUTIDEV_010': return new MacroEngine(KRUTIDEV_010_MAP, config.backspaceAllowed);
    case 'MANGAL_GAIL': {
      const gailAlt = Object.entries(REMINGTON_GAIL_MAP.alt).reduce((acc, [k, v]) => {
        acc[`Alt-${k}`] = v;
        return acc;
      }, {} as Record<string, string>);
      const gailAltShift = Object.entries(REMINGTON_GAIL_MAP.altShift).reduce((acc, [k, v]) => {
        acc[`Alt-${k}`] = v;
        return acc;
      }, {} as Record<string, string>);
      return new MacroEngine({ 
        ...REMINGTON_GAIL_MAP.default, 
        ...REMINGTON_GAIL_MAP.shift,
        ...gailAlt,
        ...gailAltShift
      }, config.backspaceAllowed);
    }
    case 'ASSAMESE_INSCRIPT': return new MacroEngine(ASSAMESE_MAP, config.backspaceAllowed);
    case 'BENGALI_INSCRIPT': return new MacroEngine(BENGALI_MAP, config.backspaceAllowed);
    case 'BENGALI_BIJOY': return new MacroEngine(BENGALI_BIJOY_MAP, config.backspaceAllowed);
    case 'GUJARATI_INSCRIPT': return new MacroEngine(GUJARATI_MAP, config.backspaceAllowed);
    case 'KANNADA_INSCRIPT': return new MacroEngine(KANNADA_MAP, config.backspaceAllowed);
    case 'MALAYALAM_INSCRIPT': return new MacroEngine(MALAYALAM_MAP, config.backspaceAllowed);
    case 'MANIPURI_INSCRIPT': return new MacroEngine(MANIPURI_MAP, config.backspaceAllowed);
    case 'ODIA_INSCRIPT': return new MacroEngine(ODIA_MAP, config.backspaceAllowed);
    case 'PUNJABI_INSCRIPT': return new MacroEngine(PUNJABI_MAP, config.backspaceAllowed);
    case 'TAMIL_INSCRIPT': return new MacroEngine(TAMIL_MAP, config.backspaceAllowed);
    case 'TELUGU_INSCRIPT': return new MacroEngine(TELUGU_MAP, config.backspaceAllowed);
    case 'URDU_PHONETIC': return new MacroEngine(URDU_MAP, config.backspaceAllowed);

    case 'MANGAL_INSCRIPT': return new MacroEngine(HINDI_INSCRIPT_MAP, config.backspaceAllowed);
    case 'OS_DEFAULT':
      return new PassThroughEngine(config.backspaceAllowed);

    default:
      // Fallback
      return new PassThroughEngine(config.backspaceAllowed);
  }
}

export function needsTransliteration(layoutId: LayoutId): boolean {
  return layoutId !== 'OS_DEFAULT';
}