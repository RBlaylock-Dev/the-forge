'use client';

import { useEffect, useRef, useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { selectCodexProgress } from '@/store/useForgeStore';

const RING_RADIUS = 18;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function CodexButton() {
  const progress = useForgeStore(selectCodexProgress);
  const isStarted = useForgeStore((s) => s.isStarted);
  const openCodex = useForgeStore((s) => s.openCodex);
  const showCodex = useForgeStore((s) => s.showCodex);

  const [pulse, setPulse] = useState(false);
  const prevProgress = useRef(progress);

  // Pulse animation when progress increases
  useEffect(() => {
    if (progress > prevProgress.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
    prevProgress.current = progress;
  }, [progress]);

  if (!isStarted || showCodex) return null;

  const pct = Math.round(progress * 100);
  const offset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <button
      onClick={openCodex}
      aria-label={`Forge Codex — ${pct}% discovered`}
      style={{
        position: 'fixed',
        bottom: 'clamp(16px, 3vw, 24px)',
        right: 'clamp(16px, 3vw, 24px)',
        zIndex: 10,
        pointerEvents: 'auto',
        cursor: 'pointer',
        background: 'rgba(10,8,6,0.85)',
        border: '1px solid rgba(196,129,58,0.3)',
        borderRadius: '50%',
        width: 52,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: pulse ? 'scale(1.15)' : 'scale(1)',
        boxShadow: pulse
          ? '0 0 16px rgba(232,165,75,0.6)'
          : '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      <svg width={48} height={48} viewBox="0 0 48 48">
        {/* Background ring */}
        <circle
          cx={24}
          cy={24}
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(196,129,58,0.15)"
          strokeWidth={3}
        />
        {/* Progress ring */}
        <circle
          cx={24}
          cy={24}
          r={RING_RADIUS}
          fill="none"
          stroke="#c4813a"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.8s ease',
            filter: 'drop-shadow(0 0 3px rgba(232,165,75,0.5))',
          }}
        />
        {/* Percentage text */}
        <text
          x={24}
          y={25}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#f5deb3"
          fontSize={pct === 100 ? 10 : 12}
          fontFamily="Rajdhani, sans-serif"
          fontWeight={600}
        >
          {pct}%
        </text>
      </svg>
    </button>
  );
}
