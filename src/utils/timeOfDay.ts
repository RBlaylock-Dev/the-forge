import * as THREE from 'three';

// ── Time-of-day presets ──────────────────────────────────────
// Each preset defines the global lighting mood for a time period.
// Zone-specific lights (teal, bronze, purple, cyan) are NOT affected.

interface LightPreset {
  ambientColor: number;
  ambientIntensity: number;
  fogColor: number;
  fillAColor: number;
  fillAIntensity: number;
  fillBColor: number;
  fillBIntensity: number;
  groundEmissive: number;
  groundEmissiveIntensity: number;
}

const MORNING: LightPreset = {
  ambientColor: 0x8a6a40,
  ambientIntensity: 1.2,
  fogColor: 0x4a3520,
  fillAColor: 0xe8a54b,
  fillAIntensity: 1.8,
  fillBColor: 0xd4934a,
  fillBIntensity: 1.2,
  groundEmissive: 0x3a2a18,
  groundEmissiveIntensity: 0.5,
};

const AFTERNOON: LightPreset = {
  ambientColor: 0x6a5030,
  ambientIntensity: 1.0,
  fogColor: 0x3a2818,
  fillAColor: 0xc4813a,
  fillAIntensity: 1.4,
  fillBColor: 0xb07030,
  fillBIntensity: 1.0,
  groundEmissive: 0x2a1a10,
  groundEmissiveIntensity: 0.4,
};

const EVENING: LightPreset = {
  ambientColor: 0x4a2010,
  ambientIntensity: 0.8,
  fogColor: 0x201008,
  fillAColor: 0xcc5520,
  fillAIntensity: 1.5,
  fillBColor: 0x8b3010,
  fillBIntensity: 1.0,
  groundEmissive: 0x1a0c06,
  groundEmissiveIntensity: 0.35,
};

const NIGHT: LightPreset = {
  ambientColor: 0x182030,
  ambientIntensity: 0.5,
  fogColor: 0x0a0e14,
  fillAColor: 0x6a7a9a,
  fillAIntensity: 0.4,
  fillBColor: 0x3a3028,
  fillBIntensity: 0.3,
  groundEmissive: 0x080a10,
  groundEmissiveIntensity: 0.15,
};

// Period boundaries (hours)
// Night: 0–6, Morning: 6–12, Afternoon: 12–17, Evening: 17–21, Night: 21–24
const PERIODS: { start: number; end: number; preset: LightPreset }[] = [
  { start: 0, end: 6, preset: NIGHT },
  { start: 6, end: 12, preset: MORNING },
  { start: 12, end: 17, preset: AFTERNOON },
  { start: 17, end: 21, preset: EVENING },
  { start: 21, end: 24, preset: NIGHT },
];

// Transition zone: 1 hour of smooth blending at period boundaries
const TRANSITION = 1.0;

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();

function lerpColor(a: number, b: number, t: number): number {
  tmpA.set(a);
  tmpB.set(b);
  tmpA.lerp(tmpB, t);
  return tmpA.getHex();
}

function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPreset(a: LightPreset, b: LightPreset, t: number): LightPreset {
  return {
    ambientColor: lerpColor(a.ambientColor, b.ambientColor, t),
    ambientIntensity: lerpNum(a.ambientIntensity, b.ambientIntensity, t),
    fogColor: lerpColor(a.fogColor, b.fogColor, t),
    fillAColor: lerpColor(a.fillAColor, b.fillAColor, t),
    fillAIntensity: lerpNum(a.fillAIntensity, b.fillAIntensity, t),
    fillBColor: lerpColor(a.fillBColor, b.fillBColor, t),
    fillBIntensity: lerpNum(a.fillBIntensity, b.fillBIntensity, t),
    groundEmissive: lerpColor(a.groundEmissive, b.groundEmissive, t),
    groundEmissiveIntensity: lerpNum(a.groundEmissiveIntensity, b.groundEmissiveIntensity, t),
  };
}

/** Returns a lerped light preset based on the visitor's local time. */
export function getTimeOfDayPreset(): LightPreset {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  // Find current and next period
  for (let i = 0; i < PERIODS.length; i++) {
    const p = PERIODS[i];
    if (hour >= p.start && hour < p.end) {
      // Check if we're in a transition zone near the end of this period
      const timeToEnd = p.end - hour;
      if (timeToEnd < TRANSITION && i < PERIODS.length - 1) {
        const next = PERIODS[i + 1];
        const t = 1 - timeToEnd / TRANSITION; // 0→1 as we approach boundary
        return lerpPreset(p.preset, next.preset, t);
      }

      // Check if we're in a transition zone near the start of this period
      const timeFromStart = hour - p.start;
      if (timeFromStart < TRANSITION && i > 0) {
        const prev = PERIODS[i - 1];
        const t = timeFromStart / TRANSITION; // 0→1 as we move away from boundary
        return lerpPreset(prev.preset, p.preset, t);
      }

      return { ...p.preset };
    }
  }

  return { ...AFTERNOON }; // fallback
}

export type { LightPreset };
