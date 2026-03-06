'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useMovement, DEFAULT_PITCH } from './useMovement';
import { useZoneDetection } from './useZoneDetection';
import { useInteraction } from './useInteraction';
import { useClickToWalk } from './useClickToWalk';
import { WalkIndicator } from '@/objects/WalkIndicator';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';

const CINEMATIC_DURATION = 3; // seconds
const CINEMATIC_ZOOM_START = 2.5;
const CINEMATIC_ZOOM_END = 10;
const CINEMATIC_PITCH_START = -0.3;
const CINEMATIC_PITCH_END = DEFAULT_PITCH; // -0.15
const PLAYER_Y = 1.7;

// Zone unlock camera sweep constants
const ZONE_UNLOCK_DURATION = 2.0; // seconds
const ZONE_UNLOCK_SWEEP_ANGLE = Math.PI * 0.25; // 45° sweep
const ZONE_UNLOCK_ZOOM_IN = 8; // tighter zoom during sweep
const ZONE_UNLOCK_PITCH = -0.25; // slightly more dramatic angle

export function PlayerController() {
  const { update, yaw, pitch, isKeysActive, zoom, playerPos } = useMovement();
  const detect = useZoneDetection();
  const { update: interact } = useInteraction();
  const { update: walkUpdate, walkTarget } = useClickToWalk(yaw, pitch, zoom, playerPos);
  const { camera } = useThree();

  const cinematicElapsed = useRef(0);
  const cinematicStarted = useRef(false);

  // Zone unlock camera sweep refs
  const zoneUnlockElapsed = useRef(0);
  const zoneUnlockStarted = useRef(false);
  const zoneUnlockStartYaw = useRef(0);
  const zoneUnlockStartZoom = useRef(10);
  const zoneUnlockStartPitch = useRef(DEFAULT_PITCH);

  useFrame((_, delta) => {
    const { isCinematicActive, isZoneUnlockActive, zoneUnlockTarget } = useForgeStore.getState();

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
      const camY = Math.max(0.5, PLAYER_Y + offsetY);
      camera.position.set(pp.x + offsetX, camY, pp.z + offsetZ);
      camera.lookAt(pp.x, PLAYER_Y, pp.z);

      return; // Skip all other input
    }

    // Reset cinematic flag when it ends
    if (cinematicStarted.current) {
      cinematicStarted.current = false;
    }

    // ── Zone unlock camera sweep ────────────────────────────
    if (isZoneUnlockActive && zoneUnlockTarget) {
      if (!zoneUnlockStarted.current) {
        zoneUnlockStarted.current = true;
        zoneUnlockElapsed.current = 0;
        zoneUnlockStartYaw.current = yaw.current;
        zoneUnlockStartZoom.current = zoom.current;
        zoneUnlockStartPitch.current = pitch.current;
      }

      zoneUnlockElapsed.current += delta;
      const t = Math.min(zoneUnlockElapsed.current / ZONE_UNLOCK_DURATION, 1);

      // Ease in-out for smooth sweep
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // Sweep yaw: rotate out and back (bell curve)
      const sweepT = Math.sin(t * Math.PI); // 0 → 1 → 0
      yaw.current = zoneUnlockStartYaw.current + ZONE_UNLOCK_SWEEP_ANGLE * sweepT;

      // Zoom: tighten in then back out (bell curve)
      const zoomTarget = ZONE_UNLOCK_ZOOM_IN;
      zoom.current = zoneUnlockStartZoom.current + (zoomTarget - zoneUnlockStartZoom.current) * sweepT;

      // Pitch: dip slightly more dramatic, then return
      pitch.current = zoneUnlockStartPitch.current + (ZONE_UNLOCK_PITCH - zoneUnlockStartPitch.current) * sweepT;

      // Look at zone center during sweep
      const zoneDef = ZONE_DEFS[zoneUnlockTarget];
      const lookX = playerPos.current.x + (zoneDef.center.x - playerPos.current.x) * ease * 0.3;
      const lookZ = playerPos.current.z + (zoneDef.center.z - playerPos.current.z) * ease * 0.3;

      // Apply camera
      const zoomDist = zoom.current;
      const pp = playerPos.current;
      const offsetX = Math.sin(yaw.current) * Math.cos(pitch.current) * zoomDist;
      const offsetZ = Math.cos(yaw.current) * Math.cos(pitch.current) * zoomDist;
      const offsetY = -Math.sin(pitch.current) * zoomDist;
      const camY = Math.max(0.5, PLAYER_Y + offsetY);
      camera.position.set(pp.x + offsetX, camY, pp.z + offsetZ);
      camera.lookAt(lookX, PLAYER_Y, lookZ);

      return; // Skip all other input
    }

    // Reset zone unlock flag when it ends
    if (zoneUnlockStarted.current) {
      zoneUnlockStarted.current = false;
      // Restore original values
      yaw.current = zoneUnlockStartYaw.current;
      zoom.current = zoneUnlockStartZoom.current;
      pitch.current = zoneUnlockStartPitch.current;
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
