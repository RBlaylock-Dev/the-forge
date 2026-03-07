'use client';

import { useEffect } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { soundscape } from './soundscape';

/**
 * useSoundscape — connects the Zustand store to the SoundscapeEngine.
 * Place this once in a top-level client component (e.g. HUD).
 */
export function useSoundscape() {
  const audioEnabled = useForgeStore((s) => s.audioEnabled);
  const audioVolume = useForgeStore((s) => s.audioVolume);
  const currentZone = useForgeStore((s) => s.currentZone);
  const isStarted = useForgeStore((s) => s.isStarted);

  // Enable / disable
  useEffect(() => {
    if (!isStarted) return;
    if (audioEnabled) {
      soundscape.enable();
    } else {
      soundscape.disable();
    }
  }, [audioEnabled, isStarted]);

  // Volume changes
  useEffect(() => {
    soundscape.setVolume(audioVolume);
  }, [audioVolume]);

  // Zone changes
  useEffect(() => {
    if (!isStarted) return;
    soundscape.setZone(currentZone);
  }, [currentZone, isStarted]);

  // Page Visibility API — suspend/resume when tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        soundscape.suspend();
      } else {
        soundscape.resume();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
}
