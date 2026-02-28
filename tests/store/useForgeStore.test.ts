import { useForgeStore, selectDiscoveryProgress } from '@/store/useForgeStore';
import type { DetailData } from '@/types';

// Reset store between tests
beforeEach(() => {
  useForgeStore.setState({
    isStarted: false,
    playerPosition: { x: 0, y: 1.7, z: 0 },
    playerYaw: 0,
    playerPitch: 0,
    currentZone: null,
    discoveredZones: new Set(),
    interactTarget: null,
    activeDetail: null,
    showDetail: false,
  });
});

describe('useForgeStore', () => {
  describe('initial state', () => {
    it('has correct default values', () => {
      const state = useForgeStore.getState();
      expect(state.isStarted).toBe(false);
      expect(state.playerPosition).toEqual({ x: 0, y: 1.7, z: 0 });
      expect(state.playerYaw).toBe(0);
      expect(state.playerPitch).toBe(0);
      expect(state.currentZone).toBeNull();
      expect(state.discoveredZones.size).toBe(0);
      expect(state.interactTarget).toBeNull();
      expect(state.activeDetail).toBeNull();
      expect(state.showDetail).toBe(false);
    });
  });

  describe('startGame', () => {
    it('sets isStarted to true', () => {
      useForgeStore.getState().startGame();
      expect(useForgeStore.getState().isStarted).toBe(true);
    });
  });

  describe('updatePlayerPosition', () => {
    it('updates player position', () => {
      useForgeStore.getState().updatePlayerPosition(10, 1.7, -5);
      expect(useForgeStore.getState().playerPosition).toEqual({ x: 10, y: 1.7, z: -5 });
    });
  });

  describe('updatePlayerRotation', () => {
    it('updates yaw and pitch', () => {
      useForgeStore.getState().updatePlayerRotation(1.5, -0.3);
      expect(useForgeStore.getState().playerYaw).toBe(1.5);
      expect(useForgeStore.getState().playerPitch).toBe(-0.3);
    });
  });

  describe('setCurrentZone', () => {
    it('sets the current zone', () => {
      useForgeStore.getState().setCurrentZone('hearth');
      expect(useForgeStore.getState().currentZone).toBe('hearth');
    });

    it('can be set to null', () => {
      useForgeStore.getState().setCurrentZone('vault');
      useForgeStore.getState().setCurrentZone(null);
      expect(useForgeStore.getState().currentZone).toBeNull();
    });
  });

  describe('discoverZone', () => {
    it('adds a zone to the discovered set', () => {
      useForgeStore.getState().discoverZone('hearth');
      expect(useForgeStore.getState().discoveredZones.has('hearth')).toBe(true);
      expect(useForgeStore.getState().discoveredZones.size).toBe(1);
    });

    it('is idempotent — calling twice does not duplicate', () => {
      useForgeStore.getState().discoverZone('vault');
      useForgeStore.getState().discoverZone('vault');
      expect(useForgeStore.getState().discoveredZones.size).toBe(1);
    });

    it('tracks multiple zones', () => {
      useForgeStore.getState().discoverZone('hearth');
      useForgeStore.getState().discoverZone('vault');
      useForgeStore.getState().discoverZone('timeline');
      expect(useForgeStore.getState().discoveredZones.size).toBe(3);
    });
  });

  describe('setInteractTarget', () => {
    it('sets the interact target', () => {
      const target = {
        name: 'Test Project',
        userData: { type: 'project', data: { name: 'Test', desc: '', tags: [], tier: 'RARE', color: 0, shape: 'box' } } as DetailData,
      };
      useForgeStore.getState().setInteractTarget(target);
      expect(useForgeStore.getState().interactTarget).toEqual(target);
    });

    it('can be cleared to null', () => {
      useForgeStore.getState().setInteractTarget(null);
      expect(useForgeStore.getState().interactTarget).toBeNull();
    });
  });

  describe('showDetailPanel / closeDetailPanel', () => {
    const detail: DetailData = {
      type: 'project',
      data: {
        name: 'Test',
        desc: 'Description',
        tags: ['A'],
        tier: 'EPIC',
        color: 0xcc4400,
        shape: 'ico',
      },
    };

    it('opens the detail panel with data', () => {
      useForgeStore.getState().showDetailPanel(detail);
      const state = useForgeStore.getState();
      expect(state.showDetail).toBe(true);
      expect(state.activeDetail).toEqual(detail);
    });

    it('closes the detail panel and clears data', () => {
      useForgeStore.getState().showDetailPanel(detail);
      useForgeStore.getState().closeDetailPanel();
      const state = useForgeStore.getState();
      expect(state.showDetail).toBe(false);
      expect(state.activeDetail).toBeNull();
      expect(state.interactTarget).toBeNull();
    });
  });

  describe('selectDiscoveryProgress', () => {
    it('returns 0 when no zones discovered', () => {
      expect(selectDiscoveryProgress(useForgeStore.getState())).toBe(0);
    });

    it('returns correct ratio', () => {
      useForgeStore.getState().discoverZone('hearth');
      useForgeStore.getState().discoverZone('vault');
      expect(selectDiscoveryProgress(useForgeStore.getState())).toBe(2 / 5);
    });

    it('returns 1 when all 5 zones discovered', () => {
      useForgeStore.getState().discoverZone('hearth');
      useForgeStore.getState().discoverZone('skill-tree');
      useForgeStore.getState().discoverZone('vault');
      useForgeStore.getState().discoverZone('timeline');
      useForgeStore.getState().discoverZone('war-room');
      expect(selectDiscoveryProgress(useForgeStore.getState())).toBe(1);
    });
  });

  describe('flyToZone / clearFlyTarget', () => {
    it('sets flyTarget with coordinates and yaw', () => {
      useForgeStore.getState().flyToZone(22, 25, 1.2);
      expect(useForgeStore.getState().flyTarget).toEqual({ x: 22, z: 25, yaw: 1.2 });
    });

    it('clears flyTarget', () => {
      useForgeStore.getState().flyToZone(10, 5, 0);
      useForgeStore.getState().clearFlyTarget();
      expect(useForgeStore.getState().flyTarget).toBeNull();
    });
  });
});
