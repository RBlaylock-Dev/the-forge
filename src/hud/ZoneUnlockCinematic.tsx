'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import type { ZoneId } from '@/types';

const UNLOCK_DURATION = 2500; // ms total display time

/** Zone-specific config for the unlock cinematic */
const ZONE_UNLOCK_CONFIG: Record<ZoneId, { subtitle: string; color: string }> = {
  hearth: { subtitle: 'Where it all begins', color: '#c4813a' },
  'skill-tree': { subtitle: '70+ skills forged in fire', color: '#44aa88' },
  vault: { subtitle: 'Shipped artifacts on display', color: '#aa6622' },
  timeline: { subtitle: 'The journey so far', color: '#6644aa' },
  'war-room': { subtitle: 'What\'s being built now', color: '#22aacc' },
};

export function ZoneUnlockCinematic() {
  const isZoneUnlockActive = useForgeStore((s) => s.isZoneUnlockActive);
  const zoneUnlockTarget = useForgeStore((s) => s.zoneUnlockTarget);
  const endZoneUnlock = useForgeStore((s) => s.endZoneUnlock);

  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const finish = useCallback(() => {
    setFadeOut(false);
    setShowTitle(false);
    setShowSubtitle(false);
    endZoneUnlock();
  }, [endZoneUnlock]);

  // Animation sequence
  useEffect(() => {
    if (!isZoneUnlockActive || !zoneUnlockTarget) return;

    setFadeOut(false);
    setShowTitle(false);
    setShowSubtitle(false);

    // Title burns in immediately
    const titleTimer = setTimeout(() => setShowTitle(true), 100);
    // Subtitle fades in shortly after
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 500);
    // Start fade out
    const fadeTimer = setTimeout(() => setFadeOut(true), UNLOCK_DURATION - 500);
    // End
    const endTimer = setTimeout(finish, UNLOCK_DURATION);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [isZoneUnlockActive, zoneUnlockTarget, finish]);

  // ESC to skip
  useEffect(() => {
    if (!isZoneUnlockActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isZoneUnlockActive, finish]);

  if (!isZoneUnlockActive || !zoneUnlockTarget) return null;

  const zoneName = ZONE_DEFS[zoneUnlockTarget].name;
  const config = ZONE_UNLOCK_CONFIG[zoneUnlockTarget];

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 65,
        pointerEvents: 'auto',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Zone title burn-in */}
      {showTitle && (
        <h2
          className="font-cinzel"
          style={{
            fontWeight: 900,
            fontSize: 'clamp(28px, 5vw, 56px)',
            color: config.color,
            textShadow: `0 0 40px ${config.color}80, 0 0 80px ${config.color}40, 0 2px 20px rgba(0,0,0,0.8)`,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            margin: 0,
            opacity: 0,
            animation: 'zone-unlock-title-in 0.8s ease forwards',
          }}
        >
          {zoneName}
        </h2>
      )}

      {/* Subtitle */}
      {showSubtitle && (
        <div
          className="font-rajdhani"
          style={{
            fontWeight: 400,
            fontSize: 'clamp(11px, 1.8vw, 16px)',
            color: '#f5deb3',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginTop: 10,
            opacity: 0,
            animation: 'zone-unlock-subtitle-in 0.6s ease forwards',
          }}
        >
          {config.subtitle}
        </div>
      )}

      {/* Decorative line */}
      {showTitle && (
        <div
          style={{
            width: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
            marginTop: 16,
            animation: 'zone-unlock-line-expand 1s ease 0.3s forwards',
          }}
        />
      )}
    </div>
  );
}
