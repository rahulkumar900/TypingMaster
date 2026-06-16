'use client';

import { MacroEngine, PassThroughEngine } from './engine';

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

export interface TransliteratorEngine {
  reset(): void;
  getOutput(): string;
  processKey(key: string): string;
}

export async function createTypingEngine(config: LayoutConfig): Promise<TransliteratorEngine> {
  switch (config.id) {
    case 'KRUTIDEV_010': {
      const { KRUTIDEV_010_MAP } = await import('./maps');
      return new MacroEngine(KRUTIDEV_010_MAP, config.backspaceAllowed);
    }
    case 'MANGAL_GAIL': {
      const { REMINGTON_GAIL_MAP } = await import('./maps');
      const gailAlt = Object.entries(REMINGTON_GAIL_MAP.alt).reduce((acc, [k, v]) => { acc[`Alt-${k}`] = v; return acc; }, {} as Record<string, string>);
      const gailAltShift = Object.entries(REMINGTON_GAIL_MAP.altShift).reduce((acc, [k, v]) => { acc[`Alt-${k}`] = v; return acc; }, {} as Record<string, string>);
      return new MacroEngine({ 
        ...REMINGTON_GAIL_MAP.default, 
        ...REMINGTON_GAIL_MAP.shift,
        ...gailAlt,
        ...gailAltShift
      }, config.backspaceAllowed);
    }
    case 'ASSAMESE_INSCRIPT': { const { ASSAMESE_MAP } = await import('./mappings/assamese'); return new MacroEngine(ASSAMESE_MAP, config.backspaceAllowed); }
    case 'BENGALI_INSCRIPT': { const { BENGALI_MAP } = await import('./mappings/bengali'); return new MacroEngine(BENGALI_MAP, config.backspaceAllowed); }
    case 'BENGALI_BIJOY': { const { BENGALI_BIJOY_MAP } = await import('./mappings/bengali'); return new MacroEngine(BENGALI_BIJOY_MAP, config.backspaceAllowed); }
    case 'GUJARATI_INSCRIPT': { const { GUJARATI_MAP } = await import('./mappings/gujarati'); return new MacroEngine(GUJARATI_MAP, config.backspaceAllowed); }
    case 'KANNADA_INSCRIPT': { const { KANNADA_MAP } = await import('./mappings/kannada'); return new MacroEngine(KANNADA_MAP, config.backspaceAllowed); }
    case 'MALAYALAM_INSCRIPT': { const { MALAYALAM_MAP } = await import('./mappings/malayalam'); return new MacroEngine(MALAYALAM_MAP, config.backspaceAllowed); }
    case 'MANIPURI_INSCRIPT': { const { MANIPURI_MAP } = await import('./mappings/manipuri'); return new MacroEngine(MANIPURI_MAP, config.backspaceAllowed); }
    case 'ODIA_INSCRIPT': { const { ODIA_MAP } = await import('./mappings/odia'); return new MacroEngine(ODIA_MAP, config.backspaceAllowed); }
    case 'PUNJABI_INSCRIPT': { const { PUNJABI_MAP } = await import('./mappings/punjabi'); return new MacroEngine(PUNJABI_MAP, config.backspaceAllowed); }
    case 'TAMIL_INSCRIPT': { const { TAMIL_MAP } = await import('./mappings/tamil'); return new MacroEngine(TAMIL_MAP, config.backspaceAllowed); }
    case 'TELUGU_INSCRIPT': { const { TELUGU_MAP } = await import('./mappings/telugu'); return new MacroEngine(TELUGU_MAP, config.backspaceAllowed); }
    case 'URDU_PHONETIC': { const { URDU_MAP } = await import('./mappings/urdu'); return new MacroEngine(URDU_MAP, config.backspaceAllowed); }
    case 'MANGAL_INSCRIPT': { const { HINDI_INSCRIPT_MAP } = await import('./mappings/hindi'); return new MacroEngine(HINDI_INSCRIPT_MAP, config.backspaceAllowed); }
    case 'OS_DEFAULT':
    default:
      return new PassThroughEngine(config.backspaceAllowed);
  }
}

export function needsTransliteration(layoutId: LayoutId): boolean {
  return layoutId !== 'OS_DEFAULT';
}