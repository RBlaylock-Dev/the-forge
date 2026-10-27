'use client';

import { useState, useEffect, useRef } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { useAchievementStore } from '@/store/useAchievementStore';
import { ACHIEVEMENTS } from '@/data/achievements';

/**
 * AchievementButton — tool rail button with an unlocked-count badge.
 * Click to open the Achievement Gallery.
 */
export function AchievementButton() {
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

  const count = unlocked.size;
  const total = ACHIEVEMENTS.length;

  return (
    <button
      onClick={openAchievements}
      aria-label={`Achievements: ${count} of ${total} unlocked`}
      aria-pressed={showAchievements}
      title={`Achievements: ${count}/${total}`}
      className={`hud-tool font-rajdhani ${pulse ? 'hud-tool-pulse' : ''}`}
      style={{ position: 'relative' }}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" />
        <path d="M17 6h3v2a3 3 0 01-3 3M7 6H4v2a3 3 0 003 3" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 15,
            height: 15,
            padding: '0 3px',
            borderRadius: 8,
            background: '#c4813a',
            color: '#0a0806',
            fontSize: 9,
            fontWeight: 700,
            lineHeight: '15px',
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
