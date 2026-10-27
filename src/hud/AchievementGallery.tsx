'use client';

import { useEffect, useCallback } from 'react';
import { useAchievementStore } from '@/store/useAchievementStore';
import { useForgeStore } from '@/store/useForgeStore';
import { ACHIEVEMENTS, RARITY_COLORS } from '@/data/achievements';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/**
 * AchievementGallery — Full-screen overlay showing all achievements.
 * Unlocked badges shown in color, locked as silhouettes.
 * Accessible via a dedicated HUD button.
 */
export function AchievementGallery() {
  const showAchievements = useForgeStore((s) => s.showAchievements);
  const closeAchievements = useForgeStore((s) => s.closeAchievements);
  const unlocked = useAchievementStore((s) => s.unlocked);
  const focusTrapRef = useFocusTrap(showAchievements);

  const handleClose = useCallback(() => {
    closeAchievements();
  }, [closeAchievements]);

  // ESC to close
  useEffect(() => {
    if (!showAchievements) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAchievements, handleClose]);

  if (!showAchievements) return null;

  const unlockedCount = unlocked.size;
  const totalCount = ACHIEVEMENTS.length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div
      ref={focusTrapRef}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Achievement Gallery"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 75,
        background: 'rgba(10, 8, 6, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: 'clamp(16px, 4vw, 40px) clamp(12px, 3vw, 32px)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              className="font-cinzel"
              style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 700,
                color: '#f5deb3',
                margin: 0,
              }}
            >
              Achievements
            </h2>
            <div className="font-rajdhani" style={{ fontSize: 13, color: '#6a5a4a', marginTop: 4 }}>
              {unlockedCount} / {totalCount} unlocked
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close achievements"
            style={{
              background: 'none',
              border: '1px solid rgba(196,129,58,0.3)',
              borderRadius: 4,
              color: '#c4813a',
              fontSize: 20,
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            &times;
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span
              className="font-rajdhani"
              style={{
                fontSize: 12,
                color: '#6a5a4a',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Progress
            </span>
            <span
              className="font-rajdhani"
              style={{ fontSize: 14, color: '#e8a54b', fontWeight: 600 }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: 'rgba(196,129,58,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(90deg, #c4813a, #e8a54b)',
                boxShadow: '0 0 8px rgba(232,165,75,0.5)',
                transition: 'width 0.8s ease',
              }}
            />
          </div>
        </div>

        {/* Achievement grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.id);
            const color = RARITY_COLORS[achievement.rarity];
            const timestamp = unlocked.get(achievement.id);

            return (
              <div
                key={achievement.id}
                style={{
                  padding: '16px 14px',
                  background: isUnlocked ? 'rgba(26, 21, 17, 0.8)' : 'rgba(10, 8, 6, 0.5)',
                  border: `1px solid ${isUnlocked ? `${color}40` : 'rgba(106, 90, 74, 0.15)'}`,
                  borderRadius: 8,
                  opacity: isUnlocked ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    fontSize: 32,
                    marginBottom: 8,
                    filter: isUnlocked ? 'none' : 'grayscale(1) brightness(0.3)',
                  }}
                >
                  {achievement.icon}
                </div>

                {/* Rarity */}
                <div
                  className="font-rajdhani"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: isUnlocked ? color : '#3a3228',
                    marginBottom: 4,
                  }}
                >
                  {achievement.rarity}
                </div>

                {/* Title */}
                <div
                  className="font-cinzel"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isUnlocked ? '#f5deb3' : '#3a3228',
                    letterSpacing: '0.5px',
                    marginBottom: 4,
                  }}
                >
                  {isUnlocked ? achievement.title : '???'}
                </div>

                {/* Description */}
                <div
                  className="font-rajdhani"
                  style={{
                    fontSize: 11,
                    color: isUnlocked ? 'rgba(245, 222, 179, 0.5)' : '#2a2420',
                    lineHeight: 1.3,
                  }}
                >
                  {isUnlocked ? achievement.description : 'Keep exploring...'}
                </div>

                {/* Unlock date */}
                {isUnlocked && timestamp && (
                  <div
                    className="font-rajdhani"
                    style={{
                      fontSize: 9,
                      color: '#4a3d30',
                      marginTop: 8,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {new Date(timestamp).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
