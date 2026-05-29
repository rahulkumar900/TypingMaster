// Basic audio synthesizer for mechanical keyboard sounds

export class TypingAudioSynthesizer {
  enabled: boolean = true;
  switchProfile: 'blue' | 'brown' | 'red' = 'blue';
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioCtx = new window.AudioContext();
    }
  }

  playClick(type: 'space' | 'error' | 'backspace' | 'char') {
    if (!this.enabled || !this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    const now = this.audioCtx.currentTime;

    // Different profiles have different base frequencies
    let baseFreq = 300;
    if (this.switchProfile === 'blue') baseFreq = 400; // Clicky
    if (this.switchProfile === 'brown') baseFreq = 200; // Tactile (lower thock)
    if (this.switchProfile === 'red') baseFreq = 150; // Linear (soft thock)

    if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      return;
    }

    // Default char
    osc.type = 'sine';
    
    if (type === 'space') {
      osc.frequency.setValueAtTime(baseFreq - 50, now);
      gainNode.gain.setValueAtTime(0.08, now);
    } else if (type === 'backspace') {
      osc.frequency.setValueAtTime(baseFreq + 50, now);
      gainNode.gain.setValueAtTime(0.05, now);
    } else {
      // Normal char
      osc.frequency.setValueAtTime(baseFreq + (Math.random() * 20 - 10), now);
      gainNode.gain.setValueAtTime(0.05, now);
    }

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}
