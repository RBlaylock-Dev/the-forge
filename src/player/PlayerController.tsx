'use client';

import { useFrame } from '@react-three/fiber';
import { useMovement } from './useMovement';
import { useZoneDetection } from './useZoneDetection';
import { useInteraction } from './useInteraction';
import { useClickToWalk } from './useClickToWalk';
import { useForgeStore } from '@/store/useForgeStore';
import { WalkIndicator } from '@/objects/WalkIndicator';

export function PlayerController() {
  const { update, yaw, pitch, isKeysActive } = useMovement();
  const detect = useZoneDetection();
  const { update: interact } = useInteraction();
  const { update: walkUpdate, walkTarget } = useClickToWalk(yaw, pitch);

  useFrame((_, delta) => {
    const keysActive = isKeysActive();

    // Click-to-walk / fly-to takes precedence when active and no keys pressed
    const walkingOrFlying = walkUpdate(delta, keysActive);

    // Keyboard movement (only when not mid-fly/walk)
    if (!walkingOrFlying) {
      update(delta);
    }

    const { x, z } = useForgeStore.getState().playerPosition;
    detect(x, z);
    interact();
  });

  return <WalkIndicator target={walkTarget} />;
}
