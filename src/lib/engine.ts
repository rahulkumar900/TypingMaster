import { TransliteratorEngine } from './transliterate';

// ---------------------------------------------------------------------------
// 1. MACRO REPLACEMENT ENGINE (For Remington GAIL and Krutidev 010)
// ---------------------------------------------------------------------------
export class MacroEngine implements TransliteratorEngine {
  private rawBuffer: string[] = [];
  private lookupMap: Map<string, string>;
  private matchRegex: RegExp;
  private backspaceAllowed: boolean;
  private isLegacy: boolean;

  constructor(keymap: Record<string, string>, backspaceAllowed: boolean = true, isLegacy: boolean = false) {
    this.backspaceAllowed = backspaceAllowed;
    this.isLegacy = isLegacy;

    // Sort string pairs length descending to solve the greedy match problem
    const sortedPairs = Object.entries(keymap)
      .map(([source, target]) => ({ source, target }))
      .sort((a, b) => b.source.length - a.source.length);

    // Escape special regex characters safely and compile a single-pass matcher
    const pattern = sortedPairs
      .map(p => p.source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('|');

    // Handle empty map edge case
    if (!pattern) {
      this.matchRegex = new RegExp('^$', 'g');
      this.lookupMap = new Map();
    } else {
      this.matchRegex = new RegExp(pattern, 'g');
      this.lookupMap = new Map(sortedPairs.map(p => [p.source, p.target]));
    }
  }

  reset(): void {
    this.rawBuffer = [];
  }

  getOutput(): string {
    const rawText = this.rawBuffer.join('');
    // Continuous O(N) regex evaluation pipeline
    let mappedText = rawText.replace(this.matchRegex, (matched) => this.lookupMap.get(matched) ?? matched);
    
    if (this.isLegacy) {
      // Post-processing for Hindi Legacy Layouts (Remington GAIL / KrutiDev -> Unicode)
      // 1. Remove halant + aa matra (् + ा) -> completes the half character
      mappedText = mappedText.replace(/\u094D\u093E/g, '');
      
      // 2. Fix short 'i' matra (ि) position: move it after the consonant cluster
      // Consonant cluster: (consonant + halant)* + consonant
      mappedText = mappedText.replace(/\u093F((?:[\u0915-\u0939\u0958-\u095F]\u094D)*[\u0915-\u0939\u0958-\u095F])/g, '$1\u093F');
      
      // 3. Fix Reph (र्) position: KrutiDev types it after the consonant, Unicode expects it before
      mappedText = mappedText.replace(/([\u0915-\u0939\u0958-\u095F])\u0930\u094D/g, '\u0930\u094D$1');
    }

    return mappedText;
  }

  processKey(key: string): string {
    if (key === 'Backspace') {
      if (this.backspaceAllowed) {
        this.rawBuffer.pop();
      }
    } else if (key.length === 1 || key.startsWith('Alt-')) {
      this.rawBuffer.push(key);
    }
    return this.getOutput();
  }
}

// ---------------------------------------------------------------------------
// 2. PASS-THROUGH ENGINE (For Native Windows/Mac/Linux Mangal InScript)
// ---------------------------------------------------------------------------
export class PassThroughEngine implements TransliteratorEngine {
  private buffer: string[] = [];
  private backspaceAllowed: boolean;

  constructor(backspaceAllowed: boolean = true) {
    this.backspaceAllowed = backspaceAllowed;
  }

  reset(): void {
    this.buffer = [];
  }

  getOutput(): string {
    return this.buffer.join('');
  }

  processKey(key: string): string {
    if (key === 'Backspace') {
      if (this.backspaceAllowed) {
        this.buffer.pop();
      }
    } else if (key.length === 1) {
      // Direct native entry pass-through
      this.buffer.push(key);
    }
    return this.getOutput();
  }
}
