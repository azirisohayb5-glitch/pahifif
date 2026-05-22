// Math Island Sound Synthesizer using Web Audio API
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('math_island_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('math_island_muted', this.isMuted);
    return this.isMuted;
  }

  createOscillator(type, freq, duration, gainStart, gainEnd) {
    if (this.isMuted) return null;
    this.init();
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(gainEnd || 0.001, this.ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    return { osc, gainNode };
  }

  playClick() {
    const sound = this.createOscillator('sine', 600, 0.1, 0.2);
    if (!sound) return;
    sound.osc.start();
    sound.osc.stop(this.ctx.currentTime + 0.1);
  }

  playSuccess() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const duration = 0.12;

    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gainNode.gain.setValueAtTime(0.15, now + index * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + duration);
    });
  }

  playFailure() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    // Lower descending buzzy sound
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playBuy() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    // Coin register ding-ding
    const notes = [587.33, 880.00]; // D5, A5
    const times = [0, 0.08];
    const duration = 0.15;

    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + times[index]);
      
      gainNode.gain.setValueAtTime(0.2, now + times[index]);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + times[index] + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(now + times[index]);
      osc.stop(now + times[index] + duration);
    });
  }

  playLevelUp() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    // Triumphant ascending arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 -> C6
    const duration = 0.15;
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);
      
      gainNode.gain.setValueAtTime(0.2, now + index * 0.06);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + duration);
    });
  }

  playEvolve() {
    this.init();
    if (this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    // Frequency sweep going up rapidly to simulate magic portal
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.8);
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.8);
  }
}

// Export as a global singleton object
window.gameAudio = new AudioEngine();
