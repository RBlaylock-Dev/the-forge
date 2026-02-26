'use client';

import { useFrame } from '@react-three/fiber';
import { useMovement } from './useMovement';

export function PlayerController() {
  const { update } = useMovement();

  useFrame((_, delta) => {
    update(delta);
  });

  return null;
}
