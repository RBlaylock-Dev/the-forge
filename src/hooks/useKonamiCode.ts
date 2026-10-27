'use client';

import { useEffect, useRef } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const EFFECT_DURATION = 5000; // 5 seconds

/**
 * useKonamiCode — Listens for the Konami code sequence (↑↑↓↓←→←→BA).
 * Activates a neon wireframe visual mode for 5 seconds when entered.
 */
export function useKonamiCode() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isKonamiActive = useForgeStore((s) => s.isKonamiActive);
  const activateKonami = useForgeStore((s) => s.activateKonami);
  const deactivateKonami = useForgeStore((s) => s.deactivateKonami);
  const bufferRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isStarted) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Don't accept input while effect is active
      if (isKonamiActive) return;

      bufferRef.current.push(
        e.key.toLowerCase() === 'b' ? 'b' : e.key.toLowerCase() === 'a' ? 'a' : e.key,
      );

      // Keep only the last N keys
      if (bufferRef.current.length > KONAMI_SEQUENCE.length) {
        bufferRef.current.shift();
      }

      // Check for match
      if (bufferRef.current.length === KONAMI_SEQUENCE.length) {
        const match = bufferRef.current.every(
          (key, i) => key.toLowerCase() === KONAMI_SEQUENCE[i].toLowerCase(),
        );

        if (match) {
          bufferRef.current = [];
          activateKonami();

          // Auto-deactivate after duration
          timerRef.current = setTimeout(() => {
            deactivateKonami();
          }, EFFECT_DURATION);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isStarted, isKonamiActive, activateKonami, deactivateKonami]);
}
