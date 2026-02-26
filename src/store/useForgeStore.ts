import { create } from 'zustand';
import type { ForgeState, ZoneId, DetailData } from '@/types';

export const useForgeStore = create<ForgeState>()((set) => ({
  // ── Game State ───────────────────────────────────────────
  isStarted: false,
  isLocked: false,

  // ── Player ───────────────────────────────────────────────
  playerPosition: { x: 0, y: 1.7, z: 0 },
  playerYaw: 0,
  playerPitch: 0,

  // ── Zones ────────────────────────────────────────────────
  currentZone: null,
  discoveredZones: new Set<ZoneId>(),

  // ── Interaction ──────────────────────────────────────────
  interactTarget: null,
  activeDetail: null,
  showDetail: false,

  // ── Actions ──────────────────────────────────────────────
  startGame: () => set({ isStarted: true }),

  setLocked: (locked: boolean) => set({ isLocked: locked }),

  updatePlayerPosition: (x: number, y: number, z: number) =>
    set({ playerPosition: { x, y, z } }),

  updatePlayerRotation: (yaw: number, pitch: number) =>
    set({ playerYaw: yaw, playerPitch: pitch }),

  setCurrentZone: (zone: ZoneId | null) => set({ currentZone: zone }),

  discoverZone: (zone: ZoneId) =>
    set((state) => {
      if (state.discoveredZones.has(zone)) return state;
      const next = new Set(state.discoveredZones);
      next.add(zone);
      return { discoveredZones: next };
    }),

  setInteractTarget: (target) => set({ interactTarget: target }),

  showDetailPanel: (data: DetailData) =>
    set({ activeDetail: data, showDetail: true }),

  closeDetailPanel: () =>
    set({ activeDetail: null, showDetail: false, interactTarget: null }),
}));

/** Derived selector: discovery progress as 0–1 ratio */
export const selectDiscoveryProgress = (state: ForgeState) =>
  state.discoveredZones.size / 5;
