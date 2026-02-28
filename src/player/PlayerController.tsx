'use client';

import { useFrame } from '@react-three/fiber';
import { useMovement } from './useMovement';
import { useZoneDetection } from './useZoneDetection';
import { useInteraction } from './useInteraction';
import { useClickToWalk } from './useClickToWalk';
import { WalkIndicator } from '@/objects/WalkIndicator';

export function PlayerController() {
  const { update, yaw, pitch, isKeysActive, zoom, playerPos } = useMovement();
  const detect = useZoneDetection();
  const { update: interact } = useInteraction();
  const { update: walkUpdate, walkTarget } = useClickToWalk(yaw, pitch, zoom, playerPos);

  useFrame((_, delta) => {
    const keysActive = isKeysActive();

    // Click-to-walk / fly-to takes precedence when active and no keys pressed
    const walkingOrFlying = walkUpdate(delta, keysActive);

    // Keyboard movement (only when not mid-fly/walk)
    if (!walkingOrFlying) {
      update(delta);
    }

    // Use playerPos for zone detection (more immediate than store read)
    detect(playerPos.current.x, playerPos.current.z);
    interact();
  });

  return <WalkIndicator target={walkTarget} />;
}
