// ── Web Audio API Synthesizer (no audio files needed) ─────────
class AudioManager {
  constructor() {
    this.ctx         = null;
    this.masterGain  = null;
    this.ambiOscs    = null;
    this.ambiGain    = null;
    this.enabled     = false;
  }

  // Lazy-initialize AudioContext on first user interaction
  _boot() {
    if (this.ctx) return true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      return true;
    } catch (e) {
      console.warn('[Audio] AudioContext unavailable');
      return false;
    }
  }

  _resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setEnabled(val) {
    this.enabled = val;
    if (!val) {
      this._fadeOutAmbi();
    } else {
      this._resume();
      this.startAmbience();
    }
  }

  // ── Ambience ──────────────────────────────────────────────
  startAmbience() {
    if (!this.enabled || !this._boot()) return;
    this._resume();
    if (this.ambiOscs) return; // already running

    const now = this.ctx.currentTime;
    this.ambiGain = this.ctx.createGain();
    this.ambiGain.gain.setValueAtTime(0, now);
    this.ambiGain.gain.linearRampToValueAtTime(0.25, now + 4);
    this.ambiGain.connect(this.masterGain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.connect(this.ambiGain);

    this.ambiOscs = [55, 55.6, 82.3].map(freq => {
      const o = this.ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, now);
      o.connect(filter);
      o.start(now);
      return o;
    });
  }

  _fadeOutAmbi() {
    if (!this.ambiGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.ambiGain.gain.linearRampToValueAtTime(0, now + 1.5);
    setTimeout(() => {
      try {
        this.ambiOscs?.forEach(o => o.stop());
        this.ambiOscs = null;
      } catch (_) {}
    }, 1700);
  }

  // ── One-shot helpers ──────────────────────────────────────
  _osc(type, freq) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, this.ctx.currentTime);
    return o;
  }

  _gain(val = 0) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(val, this.ctx.currentTime);
    return g;
  }

  _tone(freq, type, dur, vol) {
    if (!this.enabled || !this._boot()) return;
    this._resume();
    const osc  = this._osc(type, freq);
    const gain = this._gain(0);
    osc.connect(gain);
    gain.connect(this.masterGain);
    const now = this.ctx.currentTime;
    gain.gain.linearRampToValueAtTime(vol, now + 0.015);
    gain.gain.linearRampToValueAtTime(0,   now + dur);
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  playClick()      { this._tone(880, 'sine', 0.08, 0.18); }
  playWarning()    {
    this._tone(110, 'sawtooth', 0.4, 0.18);
    setTimeout(() => this._tone(103, 'sawtooth', 0.6, 0.12), 300);
  }
  playTransition() {
    if (!this.enabled || !this._boot()) return;
    this._resume();
    // Filtered noise whoosh
    try {
      const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.5), this.ctx.sampleRate);
      const d   = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src  = this.ctx.createBufferSource();
      src.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass'; filter.Q.value = 4;
      filter.frequency.setValueAtTime(80, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.5);
      const gain = this._gain(0);
      src.connect(filter); filter.connect(gain); gain.connect(this.masterGain);
      const now = this.ctx.currentTime;
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      src.start(now);
    } catch (_) {}
  }
  playLevelComplete() {
    [220, 261.63, 311.13, 370].forEach((f, i) => {
      setTimeout(() => this._tone(f, 'sine', 0.5, 0.14), i * 180);
    });
  }
  playSeal() {
    this._tone(440, 'sine', 0.5, 0.22);
    setTimeout(() => this._tone(550, 'sine', 0.4, 0.18), 180);
    setTimeout(() => this._tone(660, 'sine', 0.8, 0.20), 380);
  }
  playSurvivor() {
    [110, 138.6, 164.8, 220, 261.6].forEach((f, i) => {
      setTimeout(() => this._tone(f, 'sine', 2.5, 0.14 - i * 0.01), i * 260);
    });
  }
  playSpider() {
    this._tone(60, 'sawtooth', 0.2, 0.08);
  }
}

export const audioManager = new AudioManager();
