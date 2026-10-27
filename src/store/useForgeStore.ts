import { create } from 'zustand';
import type { ForgeState, ZoneId, DetailData } from '@/types';

// ── localStorage persistence for Codex ─────────────────────
const CODEX_KEY = 'forge-codex';

interface CodexData {
  zones: string[];
  projects: string[];
  subcategories: string[];
  eras: string[];
  activeProjects: string[];
}

function loadCodex(): {
  discoveredZones: Set<ZoneId>;
  discoveredProjects: Set<string>;
  discoveredSubcategories: Set<string>;
  discoveredEras: Set<string>;
  discoveredActiveProjects: Set<string>;
} {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(CODEX_KEY) : null;
    if (!raw) throw new Error('no data');
    const data: CodexData = JSON.parse(raw);
    return {
      discoveredZones: new Set(data.zones as ZoneId[]),
      discoveredProjects: new Set(data.projects),
      discoveredSubcategories: new Set(data.subcategories),
      discoveredEras: new Set(data.eras),
      discoveredActiveProjects: new Set(data.activeProjects),
    };
  } catch {
    return {
      discoveredZones: new Set<ZoneId>(),
      discoveredProjects: new Set<string>(),
      discoveredSubcategories: new Set<string>(),
      discoveredEras: new Set<string>(),
      discoveredActiveProjects: new Set<string>(),
    };
  }
}

function saveCodex(state: ForgeState) {
  try {
    const data: CodexData = {
      zones: Array.from(state.discoveredZones),
      projects: Array.from(state.discoveredProjects),
      subcategories: Array.from(state.discoveredSubcategories),
      eras: Array.from(state.discoveredEras),
      activeProjects: Array.from(state.discoveredActiveProjects),
    };
    localStorage.setItem(CODEX_KEY, JSON.stringify(data));
  } catch {
    /* SSR or quota — silently fail */
  }
}

const hydrated = loadCodex();

export const useForgeStore = create<ForgeState>()((set) => ({
  // ── Game State ───────────────────────────────────────────
  isStarted: false,

  // ── Player ───────────────────────────────────────────────
  playerPosition: { x: 0, y: 1.7, z: 0 },
  playerYaw: 0,
  playerPitch: 0,

  // ── Zones ────────────────────────────────────────────────
  currentZone: null,
  discoveredZones: hydrated.discoveredZones,
  lastDiscoveredZone: null,

  // ── Interaction ──────────────────────────────────────────
  interactTarget: null,
  activeDetail: null,
  showDetail: false,

  // ── Teleport ───────────────────────────────────────────
  teleportTarget: null,

  // ── Navigation Fly ────────────────────────────────────
  flyTarget: null,

  // ── Tour ─────────────────────────────────────────────
  isTourActive: false,
  tourStep: 0,

  // ── Resume ──────────────────────────────────────────
  showResume: false,

  // ── Contact ─────────────────────────────────────────
  showContact: false,
  contactSubject: null,

  // ── Skill Tree ─────────────────────────────────────
  expandedSkillCategory: null,

  // ── Cinematic ─────────────────────────────────────
  isCinematicActive: false,

  // ── Zone Unlock Cinematic ───────────────────────
  isZoneUnlockActive: false,
  zoneUnlockTarget: null,

  // ── Audio ──────────────────────────────────────────
  audioEnabled: false,
  audioVolume: 0.5,

  // ── Visitor Counter ──────────────────────────────
  visitorCount: 0,

  // ── Screenshot Mode ─────────────────────────────
  isScreenshotMode: false,

  // ── Resume ─────────────────────────────────────
  resumeDownloaded: false,

  // ── Konami Easter Egg ─────────────────────────
  isKonamiActive: false,

  // ── Achievements ───────────────────────────────────
  showAchievements: false,

  // ── Codex (Discovery Tracker) ─────────────────────
  discoveredProjects: hydrated.discoveredProjects,
  discoveredSubcategories: hydrated.discoveredSubcategories,
  discoveredEras: hydrated.discoveredEras,
  discoveredActiveProjects: hydrated.discoveredActiveProjects,
  showCodex: false,

  // ── Actions ──────────────────────────────────────────────
  startGame: () => set({ isStarted: true }),

  updatePlayerPosition: (x: number, y: number, z: number) => set({ playerPosition: { x, y, z } }),

  updatePlayerRotation: (yaw: number, pitch: number) => set({ playerYaw: yaw, playerPitch: pitch }),

  setCurrentZone: (zone: ZoneId | null) => set({ currentZone: zone }),

  discoverZone: (zone: ZoneId) =>
    set((state) => {
      if (state.discoveredZones.has(zone)) return state;
      const next = new Set(state.discoveredZones);
      next.add(zone);
      const newState = { ...state, discoveredZones: next, lastDiscoveredZone: zone };
      saveCodex(newState as ForgeState);
      return { discoveredZones: next, lastDiscoveredZone: zone };
    }),

  setInteractTarget: (target) => set({ interactTarget: target }),

  showDetailPanel: (data: DetailData) =>
    set((state) => {
      // Auto-discover item based on detail type
      let changed = false;
      let discoveredProjects = state.discoveredProjects;
      let discoveredSubcategories = state.discoveredSubcategories;
      let discoveredEras = state.discoveredEras;
      let discoveredActiveProjects = state.discoveredActiveProjects;

      if (data.type === 'project' && !state.discoveredProjects.has(data.data.name)) {
        discoveredProjects = new Set(state.discoveredProjects);
        discoveredProjects.add(data.data.name);
        changed = true;
      } else if (
        data.type === 'skill-subcategory' &&
        !state.discoveredSubcategories.has(data.data.subcategory.id)
      ) {
        discoveredSubcategories = new Set(state.discoveredSubcategories);
        discoveredSubcategories.add(data.data.subcategory.id);
        changed = true;
      } else if (data.type === 'timeline-era' && !state.discoveredEras.has(data.data.era)) {
        discoveredEras = new Set(state.discoveredEras);
        discoveredEras.add(data.data.era);
        changed = true;
      } else if (
        data.type === 'active-project' &&
        !state.discoveredActiveProjects.has(data.data.name)
      ) {
        discoveredActiveProjects = new Set(state.discoveredActiveProjects);
        discoveredActiveProjects.add(data.data.name);
        changed = true;
      }

      const update = {
        activeDetail: data,
        showDetail: true,
        ...(changed
          ? {
              discoveredProjects,
              discoveredSubcategories,
              discoveredEras,
              discoveredActiveProjects,
            }
          : {}),
      };

      if (changed) {
        const newState = { ...state, ...update };
        saveCodex(newState as ForgeState);
      }

      return update;
    }),

  closeDetailPanel: () => set({ activeDetail: null, showDetail: false, interactTarget: null }),

  teleportTo: (x: number, z: number, yaw: number) => set({ teleportTarget: { x, z, yaw } }),

  clearTeleport: () => set({ teleportTarget: null }),

  flyToZone: (x: number, z: number, yaw: number) => set({ flyTarget: { x, z, yaw } }),

  clearFlyTarget: () => set({ flyTarget: null }),

  startTour: () => set({ isTourActive: true, tourStep: 0 }),
  advanceTour: () => set((state) => ({ tourStep: state.tourStep + 1 })),
  endTour: () => set({ isTourActive: false, tourStep: 0 }),

  openResume: () => set({ showResume: true }),
  closeResume: () => set({ showResume: false }),

  openContact: () => set({ showContact: true }),
  closeContact: () => set({ showContact: false, contactSubject: null }),

  expandCategory: (id: string) => set({ expandedSkillCategory: id }),
  collapseCategory: () => set({ expandedSkillCategory: null }),

  startCinematic: () => set({ isCinematicActive: true }),
  endCinematic: () => set({ isCinematicActive: false }),

  startZoneUnlock: (zone: ZoneId) => set({ isZoneUnlockActive: true, zoneUnlockTarget: zone }),
  endZoneUnlock: () => set({ isZoneUnlockActive: false, zoneUnlockTarget: null }),

  openCodex: () => set({ showCodex: true }),
  closeCodex: () => set({ showCodex: false }),

  openAchievements: () => set({ showAchievements: true }),
  closeAchievements: () => set({ showAchievements: false }),

  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  setAudioVolume: (volume: number) => set({ audioVolume: Math.max(0, Math.min(1, volume)) }),

  setVisitorCount: (count: number) => set({ visitorCount: count }),

  toggleScreenshotMode: () => set((state) => ({ isScreenshotMode: !state.isScreenshotMode })),

  markResumeDownloaded: () => set({ resumeDownloaded: true }),

  activateKonami: () => set({ isKonamiActive: true }),
  deactivateKonami: () => set({ isKonamiActive: false }),
}));

// ── Total discoverable item counts ──────────────────────────
const TOTAL_ZONES = 6;
const TOTAL_PROJECTS = 12;
const TOTAL_SUBCATEGORIES = 21;
const TOTAL_ERAS = 5;
const TOTAL_ACTIVE_PROJECTS = 7;
const TOTAL_ITEMS =
  TOTAL_ZONES + TOTAL_PROJECTS + TOTAL_SUBCATEGORIES + TOTAL_ERAS + TOTAL_ACTIVE_PROJECTS;

/** Derived selector: overall Codex progress as 0–1 ratio */
export const selectCodexProgress = (state: ForgeState) => {
  const discovered =
    state.discoveredZones.size +
    state.discoveredProjects.size +
    state.discoveredSubcategories.size +
    state.discoveredEras.size +
    state.discoveredActiveProjects.size;
  return discovered / TOTAL_ITEMS;
};

/** Derived selector: discovery progress (alias for backward compat) */
export const selectDiscoveryProgress = selectCodexProgress;
