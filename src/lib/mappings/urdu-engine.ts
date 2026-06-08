import { TransliteratorEngine } from '../transliterate';
import { URDU_MAP } from './urdu';

export class UrduTransliterator implements TransliteratorEngine {
  private rawBuffer: string[] = [];
  reset(): void { this.rawBuffer = []; }
  getOutput(): string { return this.rawBuffer.join(''); }
  
  processKey(key: string): string {
    if (key === 'Backspace') {
      this.rawBuffer.pop();
    } else if (key.length === 1) {
      this.rawBuffer.push(URDU_MAP[key] || key);
    }
    return this.rawBuffer.join('');
  }
}
