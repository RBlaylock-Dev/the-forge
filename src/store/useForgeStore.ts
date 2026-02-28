import { create } from 'zustand';
import type { ForgeState, ZoneId, DetailData } from '@/types';

export const useForgeStore = create<ForgeState>()((set) => ({
  // ── Game State ───────────────────────────────────────────
  isStarted: false,

  // ── Player ───────────────────────────────────────────────
  playerPosition: { x: 0, y: 1.7, z: 0 },
  playerYaw: 0,
  playerPitch: 0,

  // ── Zones ────────────────────────────────────────────────
  currentZone: null,
  discoveredZones: new Set<ZoneId>(),
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

  // ── Actions ──────────────────────────────────────────────
  startGame: () => set({ isStarted: true }),

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
      return { discoveredZones: next, lastDiscoveredZone: zone };
    }),

  setInteractTarget: (target) => set({ interactTarget: target }),

  showDetailPanel: (data: DetailData) =>
    set({ activeDetail: data, showDetail: true }),

  closeDetailPanel: () =>
    set({ activeDetail: null, showDetail: false, interactTarget: null }),

  teleportTo: (x: number, z: number, yaw: number) =>
    set({ teleportTarget: { x, z, yaw } }),

  clearTeleport: () => set({ teleportTarget: null }),

  flyToZone: (x: number, z: number, yaw: number) =>
    set({ flyTarget: { x, z, yaw } }),

  clearFlyTarget: () => set({ flyTarget: null }),

  startTour: () => set({ isTourActive: true, tourStep: 0 }),
  advanceTour: () => set((state) => ({ tourStep: state.tourStep + 1 })),
  endTour: () => set({ isTourActive: false, tourStep: 0 }),

  openResume: () => set({ showResume: true }),
  closeResume: () => set({ showResume: false }),

  openContact: () => set({ showContact: true }),
  closeContact: () => set({ showContact: false }),
}));

/** Derived selector: discovery progress as 0–1 ratio */
export const selectDiscoveryProgress = (state: ForgeState) =>
  state.discoveredZones.size / 5;
