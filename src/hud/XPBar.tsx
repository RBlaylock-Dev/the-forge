'use client';

import { useForgeStore } from '@/store/useForgeStore';
import { selectCodexProgress } from '@/store/useForgeStore';

export function XPBar() {
  const progress = useForgeStore(selectCodexProgress);
  const isStarted = useForgeStore((s) => s.isStarted);

  if (!isStarted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 52,
        right: 'clamp(12px, 3vw, 28px)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      <span
        className="font-rajdhani"
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#6a5a4a',
        }}
      >
        Explored
      </span>

      <div
        style={{
          width: 'clamp(80px, 15vw, 120px)',
          height: 6,
          borderRadius: 3,
          background: 'rgba(196,129,58,0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(90deg, #c4813a, #e8a54b)',
            boxShadow: '0 0 8px rgba(232,165,75,0.5)',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}
