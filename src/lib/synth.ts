// Mechanical Keyboard click sound synthesizer using Web Audio API (SSR safe)
// Supports three different switch profiles: Blue (Clicky), Brown (Tactile), and Red (Linear Thock)

export class TypingAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public switchProfile: 'blue' | 'brown' | 'red' = 'blue';

  constructor() {
    // Context is initialized on first user interaction to satisfy browser security policies
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick(type: 'char' | 'space' | 'backspace' | 'error') {
    if (!this.enabled || typeof window === 'undefined') return;
    
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Master Volume Gain
    const masterGain = this.ctx.createGain();
    masterGain.connect(this.ctx.destination);
    
    // Filter to shape mechanical sound
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.connect(masterGain);

    if (type === 'error') {
      // Error: low frequency warning buzz
      bandpass.frequency.setValueAtTime(180, now);
      bandpass.Q.setValueAtTime(2.0, now);
      masterGain.gain.setValueAtTime(0.12, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, now);
      osc.connect(bandpass);
      osc.start(now);
      osc.stop(now + 0.12);
      return;
    }

    // Configure oscillators according to active Switch Profile
    if (this.switchProfile === 'red') {
      // Cherry MX Red (Linear Thock): deep, thocky, cushioned sound
      if (type === 'space') {
        bandpass.frequency.setValueAtTime(280, now);
        bandpass.Q.setValueAtTime(2.0, now);
        masterGain.gain.setValueAtTime(0.10, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'backspace') {
        bandpass.frequency.setValueAtTime(450, now);
        bandpass.Q.setValueAtTime(3.0, now);
        masterGain.gain.setValueAtTime(0.07, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.06);
      } else {
        // Red Key clack
        bandpass.frequency.setValueAtTime(500, now);
        bandpass.Q.setValueAtTime(3.0, now);
        masterGain.gain.setValueAtTime(0.08, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } else if (this.switchProfile === 'brown') {
      // Cherry MX Brown (Tactile Clack): crisp tactile clack, medium frequency
      if (type === 'space') {
        bandpass.frequency.setValueAtTime(420, now);
        bandpass.Q.setValueAtTime(4.0, now);
        masterGain.gain.setValueAtTime(0.08, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'backspace') {
        bandpass.frequency.setValueAtTime(680, now);
        bandpass.Q.setValueAtTime(4.0, now);
        masterGain.gain.setValueAtTime(0.07, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        // Brown Key clack
        bandpass.frequency.setValueAtTime(950, now);
        bandpass.Q.setValueAtTime(5.0, now);
        masterGain.gain.setValueAtTime(0.07, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.045);
      }
    } else {
      // Cherry MX Blue (Clicky): distinct double-click (tactile bump + high actuation click)
      if (type === 'space') {
        // Spacebar is usually heavier and lower click
        bandpass.frequency.setValueAtTime(550, now);
        bandpass.Q.setValueAtTime(3.5, now);
        masterGain.gain.setValueAtTime(0.09, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'backspace') {
        bandpass.frequency.setValueAtTime(980, now);
        bandpass.Q.setValueAtTime(6.0, now);
        masterGain.gain.setValueAtTime(0.06, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.connect(bandpass);
        osc.start(now);
        osc.stop(now + 0.04);
      } else {
        // Blue Clicky keyclack: Tactile bump (lower pitch) followed closely by sharp metallic click
        
        // 1. Tactile Bump Click
        bandpass.frequency.setValueAtTime(600, now);
        bandpass.Q.setValueAtTime(4.0, now);
        masterGain.gain.setValueAtTime(0.04, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, now);
        osc1.connect(bandpass);
        osc1.start(now);
        osc1.stop(now + 0.02);

        // 2. High frequency actuation click (offset by 4ms)
        setTimeout(() => {
          if (!this.ctx || !this.enabled) return;
          const clickNow = this.ctx.currentTime;
          
          const clickGain = this.ctx.createGain();
          clickGain.connect(this.ctx.destination);
          clickGain.gain.setValueAtTime(0.08, clickNow);
          clickGain.gain.exponentialRampToValueAtTime(0.001, clickNow + 0.015);

          const clickFilter = this.ctx.createBiquadFilter();
          clickFilter.type = 'bandpass';
          clickFilter.frequency.setValueAtTime(1800, clickNow);
          clickFilter.Q.setValueAtTime(8.0, clickNow);
          clickFilter.connect(clickGain);

          const osc2 = this.ctx.createOscillator();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, clickNow);
          osc2.connect(clickFilter);
          osc2.start(clickNow);
          osc2.stop(clickNow + 0.015);
        }, 4);
      }
    }
  }
}
