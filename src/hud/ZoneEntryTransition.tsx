'use client';

import { useEffect, useRef, useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import type { ZoneId } from '@/types';

const ZONE_COLORS: Record<ZoneId, string> = {
  hearth: '#c4813a',
  'skill-tree': '#44aa88',
  vault: '#aa6622',
  timeline: '#6644aa',
  'war-room': '#22aacc',
};

const TRANSITION_DURATION = 600; // ms

/**
 * ZoneEntryTransition — a brief color vignette that pulses at the
 * screen edges every time the player enters a different zone.
 * Distinct from ZoneUnlockCinematic (first-visit only) and
 * ZoneFlash (discovery notification).
 */
export function ZoneEntryTransition() {
  const currentZone = useForgeStore((s) => s.currentZone);
  const isStarted = useForgeStore((s) => s.isStarted);
  const prevZone = useRef<ZoneId | null>(null);
  const [active, setActive] = useState(false);
  const [color, setColor] = useState('#c4813a');

  useEffect(() => {
    if (!isStarted) return;

    // Only trigger on zone *change* (not initial mount)
    if (currentZone === prevZone.current) return;
    const wasNull = prevZone.current === null;
    prevZone.current = currentZone;

    // Don't flash on the very first zone detection (page load)
    if (wasNull && currentZone === 'hearth') return;

    if (!currentZone) return;

    setColor(ZONE_COLORS[currentZone]);
    setActive(true);

    const timer = setTimeout(() => setActive(false), TRANSITION_DURATION);
    return () => clearTimeout(timer);
  }, [currentZone, isStarted]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 45,
        pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, transparent 40%, ${color}30 70%, ${color}50 100%)`,
        animation: `zone-entry-pulse ${TRANSITION_DURATION}ms ease-out forwards`,
      }}
    />
  );
}
