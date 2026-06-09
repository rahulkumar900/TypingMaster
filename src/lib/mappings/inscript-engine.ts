import { TransliteratorEngine } from '../transliterate';

export class InscriptTransliterator implements TransliteratorEngine {
  private rawBuffer: string[] = [];
  private map: Record<string, string>;

  constructor(map: Record<string, string>) {
    this.map = map;
  }

  reset(): void {
    this.rawBuffer = [];
  }

  getOutput(): string {
    return this.rawBuffer.join('');
  }
  
  processKey(key: string): string {
    if (key === 'Backspace') {
      this.rawBuffer.pop();
    } else if (key.length === 1) {
      const mapped = this.map[key];
      if (mapped !== undefined) {
        // Explode strings (like "য়") into separate codepoint entries
        // This ensures uniform backspace execution across explicit & implicit keys
        this.rawBuffer.push(...Array.from(mapped));
      } else {
        this.rawBuffer.push(key);
      }
    }
    return this.getOutput();
  }
}
