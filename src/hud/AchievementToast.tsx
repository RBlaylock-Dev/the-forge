'use client';

import { useEffect, useState } from 'react';
import { useAchievementStore } from '@/store/useAchievementStore';
import { ACHIEVEMENTS, RARITY_COLORS } from '@/data/achievements';

const TOAST_DURATION = 5000;

interface ToastItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  color: string;
}

/**
 * AchievementToast — Slides in from top-right when an achievement is unlocked.
 * Auto-dismisses after 5 seconds, click to dismiss early.
 */
export function AchievementToast() {
  const pending = useAchievementStore((s) => s.pending);
  const dismissToast = useAchievementStore((s) => s.dismissToast);
  const [visible, setVisible] = useState<ToastItem[]>([]);

  // Convert pending IDs to toast items
  useEffect(() => {
    if (pending.length === 0) return;

    const newItems: ToastItem[] = [];
    for (const id of pending) {
      if (visible.some((v) => v.id === id)) continue;
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (!def) continue;
      newItems.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        rarity: def.rarity,
        color: RARITY_COLORS[def.rarity],
      });
    }

    if (newItems.length > 0) {
      setVisible((prev) => [...prev, ...newItems]);
    }
  }, [pending, visible]);

  // Auto-dismiss timers
  useEffect(() => {
    if (visible.length === 0) return;

    const timers = visible.map((item) =>
      setTimeout(() => {
        setVisible((prev) => prev.filter((v) => v.id !== item.id));
        dismissToast(item.id);
      }, TOAST_DURATION),
    );

    return () => timers.forEach(clearTimeout);
  }, [visible, dismissToast]);

  if (visible.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 55,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'auto',
      }}
    >
      {visible.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            setVisible((prev) => prev.filter((v) => v.id !== item.id));
            dismissToast(item.id);
          }}
          role="status"
          aria-live="polite"
          aria-label={`Achievement unlocked: ${item.title}`}
          className="font-rajdhani"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: 'rgba(10, 8, 6, 0.92)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${item.color}40`,
            borderRadius: 8,
            cursor: 'pointer',
            animation: 'achievementSlideIn 0.4s ease-out',
            boxShadow: `0 0 20px ${item.color}20`,
            maxWidth: 300,
          }}
        >
          {/* Icon */}
          <div style={{ fontSize: 28, lineHeight: 1 }}>{item.icon}</div>

          <div style={{ flex: 1 }}>
            {/* Rarity label */}
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: item.color,
                marginBottom: 2,
              }}
            >
              {item.rarity} Achievement
            </div>

            {/* Title */}
            <div
              className="font-cinzel"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#f5deb3',
                letterSpacing: '1px',
              }}
            >
              {item.title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 11,
                color: 'rgba(245, 222, 179, 0.5)',
                marginTop: 2,
              }}
            >
              {item.description}
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes achievementSlideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
