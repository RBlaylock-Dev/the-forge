'use client';

import { useProgress } from '@react-three/drei';

/**
 * Shared progress state that bridges R3F's useProgress (Canvas-only)
 * to regular React components outside the Canvas.
 */
export const loadProgress = { value: 0, active: true };

/**
 * ProgressTracker — Sits inside the R3F Canvas and writes
 * Drei's useProgress values to a shared object that the
 * StartOverlay can read via requestAnimationFrame polling.
 */
export function ProgressTracker() {
  const { progress, active } = useProgress();
  loadProgress.value = progress;
  loadProgress.active = active;
  return null;
}
