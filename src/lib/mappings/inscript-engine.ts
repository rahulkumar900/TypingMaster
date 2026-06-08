import { TransliteratorEngine } from '../transliterate';

export class InscriptTransliterator implements TransliteratorEngine {
  private rawBuffer: string[] = [];
  private map: Record<string, string>;

  constructor(map: Record<string, string>) {
    this.map = map;
  }

  reset(): void { this.rawBuffer = []; }
  getOutput(): string { return this.rawBuffer.join(''); }
  
  processKey(key: string): string {
    if (key === 'Backspace') {
      this.rawBuffer.pop();
    } else if (key.length === 1) {
      if (this.map[key] !== undefined) {
        this.rawBuffer.push(this.map[key]);
      } else {
        this.rawBuffer.push(key);
      }
    }
    return this.rawBuffer.join('');
  }
}
