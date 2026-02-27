'use client';

import { useFrame } from '@react-three/fiber';
import { useMovement } from './useMovement';
import { useZoneDetection } from './useZoneDetection';
import { useForgeStore } from '@/store/useForgeStore';

export function PlayerController() {
  const { update } = useMovement();
  const detect = useZoneDetection();

  useFrame((_, delta) => {
    update(delta);
    const { x, z } = useForgeStore.getState().playerPosition;
    detect(x, z);
  });

  return null;
}
