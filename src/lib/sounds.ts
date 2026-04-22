
class SoundManager {
  private context: AudioContext | null = null;
  private unlocked = false;

  private initContext() {
    if (!this.context && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.context = new AudioContextClass();
      }
    }
  }

  public async unlock() {
    if (this.unlocked || !this.context) return;
    
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    this.unlocked = true;
    console.log('Audio Context Unlocked');
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine', duration = 0.1, volume = 0.1) {
    this.initContext();
    if (!this.context) return;

    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.context.currentTime);

    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + duration);
  }

  play(key: 'click' | 'select' | 'match' | 'win') {
    this.initContext();
    if (!this.unlocked) {
      this.unlock();
    }

    switch (key) {
      case 'click':
        this.createOscillator(600, 'sine', 0.1, 0.05);
        break;
      case 'select':
        // A "pop" sound
        this.createOscillator(400, 'sine', 0.15, 0.1);
        setTimeout(() => this.createOscillator(800, 'sine', 0.1, 0.05), 50);
        break;
      case 'match':
        // A high "ding"
        this.createOscillator(880, 'sine', 0.4, 0.1);
        setTimeout(() => this.createOscillator(1320, 'sine', 0.3, 0.05), 100);
        break;
      case 'win':
        // A little fanfare sequence
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          setTimeout(() => {
            this.createOscillator(freq, 'triangle', 0.5, 0.1);
          }, i * 150);
        });
        break;
    }
  }
}

export const soundManager = new SoundManager();
