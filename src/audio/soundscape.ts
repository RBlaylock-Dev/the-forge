import type { ZoneId } from '@/types';

// ── Audio file mapping ──────────────────────────────────────
const ZONE_SOUNDS: Record<ZoneId, string> = {
  hearth: '/audio/dragon-studio-fire-crackling-sounds-427410.mp3',
  'skill-tree': '/audio/crystal-hum.mp3',
  vault: '/audio/dragon-studio-ancient-mechanical-gears-487670.mp3',
  timeline: '/audio/trading_nation-etheral-drone-185559.mp3',
  'war-room': '/audio/freesound_community-dark-server-76461.mp3',
};

const WIND_SOUND = '/audio/freesound_community-outdoors_night_windy_01-17044.mp3';
const TRANSITION_SOUND = '/audio/fire-whoosh.mp3';

const CROSSFADE_MS = 2000;
const WIND_VOLUME = 0.25; // relative to master
const ZONE_VOLUME = 0.6; // relative to master

// ── Soundscape Engine ───────────────────────────────────────

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private activeZoneSource: AudioBufferSourceNode | null = null;
  private activeZoneGain: GainNode | null = null;
  private bufferCache = new Map<string, AudioBuffer>();
  private currentZone: ZoneId | null = null;
  private _volume = 0.5;
  private _enabled = false;

  /** Initialize or resume the AudioContext (must be called from user gesture) */
  async init() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  get enabled() { return this._enabled; }

  async enable() {
    await this.init();
    this._enabled = true;
    this.startWind();
    if (this.currentZone) {
      this.playZone(this.currentZone);
    }
  }

  disable() {
    this._enabled = false;
    this.stopWind();
    this.stopZone(0);
  }

  setVolume(v: number) {
    this._volume = v;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(v, this.ctx!.currentTime, 0.05);
    }
  }

  async setZone(zone: ZoneId | null) {
    if (zone === this.currentZone) return;
    this.currentZone = zone;
    if (!this._enabled || !this.ctx) return;

    // Play transition whoosh
    this.playOneShot(TRANSITION_SOUND, 0.3);

    // Crossfade zone audio
    if (zone) {
      this.playZone(zone);
    } else {
      this.stopZone(CROSSFADE_MS);
    }
  }

  /** Suspend audio when tab is hidden */
  suspend() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  /** Resume audio when tab becomes visible */
  resume() {
    if (this._enabled && this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ── Private ─────────────────────────────────────────────

  private async loadBuffer(url: string): Promise<AudioBuffer> {
    const cached = this.bufferCache.get(url);
    if (cached) return cached;

    const res = await fetch(url);
    const arrayBuf = await res.arrayBuffer();
    const audioBuf = await this.ctx!.decodeAudioData(arrayBuf);
    this.bufferCache.set(url, audioBuf);
    return audioBuf;
  }

  private async startWind() {
    if (!this.ctx || !this.masterGain) return;
    if (this.windSource) return; // already playing

    try {
      const buf = await this.loadBuffer(WIND_SOUND);
      const source = this.ctx.createBufferSource();
      source.buffer = buf;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(WIND_VOLUME, this.ctx.currentTime, 0.5);

      source.connect(gain);
      gain.connect(this.masterGain);
      source.start();

      this.windSource = source;
      this.windGain = gain;
    } catch { /* audio load failed — silently continue */ }
  }

  private stopWind() {
    if (this.windGain && this.ctx) {
      this.windGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    }
    setTimeout(() => {
      this.windSource?.stop();
      this.windSource = null;
      this.windGain = null;
    }, 500);
  }

  private async playZone(zone: ZoneId) {
    if (!this.ctx || !this.masterGain) return;

    // Fade out current zone audio
    this.stopZone(CROSSFADE_MS);

    try {
      const url = ZONE_SOUNDS[zone];
      const buf = await this.loadBuffer(url);

      const source = this.ctx.createBufferSource();
      source.buffer = buf;
      source.loop = true;

      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      // Fade in
      gain.gain.setTargetAtTime(ZONE_VOLUME, this.ctx.currentTime, CROSSFADE_MS / 3000);

      source.connect(gain);
      gain.connect(this.masterGain);
      source.start();

      this.activeZoneSource = source;
      this.activeZoneGain = gain;
    } catch { /* audio load failed — silently continue */ }
  }

  private stopZone(fadeMs: number) {
    const prevSource = this.activeZoneSource;
    const prevGain = this.activeZoneGain;
    if (prevGain && this.ctx) {
      prevGain.gain.setTargetAtTime(0, this.ctx.currentTime, fadeMs / 3000);
    }
    this.activeZoneSource = null;
    this.activeZoneGain = null;

    if (prevSource) {
      setTimeout(() => {
        try { prevSource.stop(); } catch { /* already stopped */ }
      }, fadeMs + 200);
    }
  }

  private async playOneShot(url: string, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const buf = await this.loadBuffer(url);
      const source = this.ctx.createBufferSource();
      source.buffer = buf;

      const gain = this.ctx.createGain();
      gain.gain.value = volume;

      source.connect(gain);
      gain.connect(this.masterGain);
      source.start();
    } catch { /* silently fail */ }
  }
}

export const soundscape = new SoundscapeEngine();
