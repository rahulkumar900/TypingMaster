import { TransliteratorEngine } from './transliterate';

// ---------------------------------------------------------------------------
// 1. MACRO REPLACEMENT ENGINE (For Remington GAIL and Krutidev 010)
// ---------------------------------------------------------------------------
export class MacroEngine implements TransliteratorEngine {
  private rawBuffer: string[] = [];
  private lookupMap: Map<string, string>;
  private matchRegex: RegExp;
  private backspaceAllowed: boolean;

  constructor(keymap: Record<string, string>, backspaceAllowed: boolean = true) {
    this.backspaceAllowed = backspaceAllowed;

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
    return rawText.replace(this.matchRegex, (matched) => this.lookupMap.get(matched) ?? matched);
  }

  processKey(key: string): string {
    if (key === 'Backspace') {
      if (this.backspaceAllowed) {
        this.rawBuffer.pop();
      }
    } else if (key.length === 1) {
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
