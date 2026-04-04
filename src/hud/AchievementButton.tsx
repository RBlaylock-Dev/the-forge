'use client';

import { useState, useEffect, useRef } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { useAchievementStore } from '@/store/useAchievementStore';
import { ACHIEVEMENTS } from '@/data/achievements';

/**
 * AchievementButton — HUD button showing achievement progress.
 * Click to open the Achievement Gallery.
 */
export function AchievementButton() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const showAchievements = useForgeStore((s) => s.showAchievements);
  const openAchievements = useForgeStore((s) => s.openAchievements);
  const unlocked = useAchievementStore((s) => s.unlocked);

  const [pulse, setPulse] = useState(false);
  const prevCount = useRef(unlocked.size);

  // Pulse animation on new unlock
  useEffect(() => {
    if (unlocked.size > prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      prevCount.current = unlocked.size;
      return () => clearTimeout(timer);
    }
    prevCount.current = unlocked.size;
  }, [unlocked.size]);

  if (!isStarted || isTourActive || showAchievements) return null;

  const count = unlocked.size;
  const total = ACHIEVEMENTS.length;

  return (
    <button
      onClick={openAchievements}
      aria-label={`Achievements: ${count} of ${total} unlocked`}
      title={`Achievements: ${count}/${total}`}
      className="font-rajdhani"
      style={{
        position: 'fixed',
        bottom: 128,
        right: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(10, 8, 6, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(196, 129, 58, 0.25)',
        borderRadius: 8,
        color: 'rgba(245, 222, 179, 0.6)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.5px',
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'all 0.2s ease',
        transform: pulse ? 'scale(1.1)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#e8a54b';
        e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.5)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 129, 58, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(245, 222, 179, 0.6)';
        e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.25)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ fontSize: 14 }}>{'\u{1F3C6}'}</span>
      {count}/{total}
    </button>
  );
}
