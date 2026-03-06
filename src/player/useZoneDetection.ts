'use client';

import { useRef } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import type { ZoneId } from '@/types';

const ZONE_ENTRIES = Object.entries(ZONE_DEFS) as [ZoneId, (typeof ZONE_DEFS)[ZoneId]][];

export function useZoneDetection() {
  const lastZone = useRef<ZoneId | null>(null);

  const setCurrentZone = useForgeStore((s) => s.setCurrentZone);
  const discoverZone = useForgeStore((s) => s.discoverZone);
  const startZoneUnlock = useForgeStore((s) => s.startZoneUnlock);

  return function detect(px: number, pz: number) {
    let closest: ZoneId | null = null;
    let closestDist = Infinity;

    for (const [id, def] of ZONE_ENTRIES) {
      const dx = px - def.center.x;
      const dz = pz - def.center.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < def.radius && dist < closestDist) {
        closest = id;
        closestDist = dist;
      }
    }

    if (closest !== lastZone.current) {
      lastZone.current = closest;
      setCurrentZone(closest);
      if (closest !== null) {
        const {
          discoveredZones,
          isCinematicActive,
          isTourActive,
          isZoneUnlockActive,
        } = useForgeStore.getState();
        const alreadyDiscovered = discoveredZones.has(closest);
        discoverZone(closest);

        // Trigger zone unlock cinematic on first entry
        // Skip if: already discovered, cold open active, tour active, or another unlock playing
        if (!alreadyDiscovered && !isCinematicActive && !isTourActive && !isZoneUnlockActive) {
          startZoneUnlock(closest);
        }
      }
    }
  };
}
