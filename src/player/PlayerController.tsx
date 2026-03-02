'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useMovement, DEFAULT_PITCH } from './useMovement';
import { useZoneDetection } from './useZoneDetection';
import { useInteraction } from './useInteraction';
import { useClickToWalk } from './useClickToWalk';
import { WalkIndicator } from '@/objects/WalkIndicator';
import { useForgeStore } from '@/store/useForgeStore';

const CINEMATIC_DURATION = 3; // seconds
const CINEMATIC_ZOOM_START = 2.5;
const CINEMATIC_ZOOM_END = 10;
const CINEMATIC_PITCH_START = -0.3;
const CINEMATIC_PITCH_END = DEFAULT_PITCH; // -0.15
const PLAYER_Y = 1.7;

export function PlayerController() {
  const { update, yaw, pitch, isKeysActive, zoom, playerPos } = useMovement();
  const detect = useZoneDetection();
  const { update: interact } = useInteraction();
  const { update: walkUpdate, walkTarget } = useClickToWalk(yaw, pitch, zoom, playerPos);
  const { camera } = useThree();

  const cinematicElapsed = useRef(0);
  const cinematicStarted = useRef(false);

  useFrame((_, delta) => {
    const { isCinematicActive } = useForgeStore.getState();

    // ── Cinematic camera pull-back ─────────────────────────
    if (isCinematicActive) {
      // Initialize on first frame
      if (!cinematicStarted.current) {
        cinematicStarted.current = true;
        cinematicElapsed.current = 0;
        zoom.current = CINEMATIC_ZOOM_START;
        pitch.current = CINEMATIC_PITCH_START;
        yaw.current = 0;
      }

      cinematicElapsed.current += delta;
      const t = Math.min(cinematicElapsed.current / CINEMATIC_DURATION, 1);

      // Cubic ease-out
      const ease = 1 - Math.pow(1 - t, 3);

      // Interpolate zoom and pitch
      zoom.current = CINEMATIC_ZOOM_START + (CINEMATIC_ZOOM_END - CINEMATIC_ZOOM_START) * ease;
      pitch.current = CINEMATIC_PITCH_START + (CINEMATIC_PITCH_END - CINEMATIC_PITCH_START) * ease;

      // Apply camera (same math as useMovement)
      const zoomDist = zoom.current;
      const pp = playerPos.current;
      const offsetX = Math.sin(yaw.current) * Math.cos(pitch.current) * zoomDist;
      const offsetZ = Math.cos(yaw.current) * Math.cos(pitch.current) * zoomDist;
      const offsetY = -Math.sin(pitch.current) * zoomDist;
      camera.position.set(pp.x + offsetX, PLAYER_Y + offsetY, pp.z + offsetZ);
      camera.lookAt(pp.x, PLAYER_Y, pp.z);

      return; // Skip all other input
    }

    // Reset cinematic flag when it ends
    if (cinematicStarted.current) {
      cinematicStarted.current = false;
    }

    // ── Normal gameplay ────────────────────────────────────
    const keysActive = isKeysActive();
    const walkingOrFlying = walkUpdate(delta, keysActive);

    if (!walkingOrFlying) {
      update(delta);
    }

    detect(playerPos.current.x, playerPos.current.z);
    interact();
  });

  return <WalkIndicator target={walkTarget} />;
}
