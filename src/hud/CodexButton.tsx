'use client';

import { useEffect, useRef, useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { selectCodexProgress } from '@/store/useForgeStore';

const RING_RADIUS = 11;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * CodexButton — tool rail button with a discovery progress ring.
 * Pulses when the visitor discovers something new.
 */
export function CodexButton() {
  const progress = useForgeStore(selectCodexProgress);
  const openCodex = useForgeStore((s) => s.openCodex);
  const showCodex = useForgeStore((s) => s.showCodex);

  const [pulse, setPulse] = useState(false);
  const prevProgress = useRef(progress);

  // Pulse animation when progress increases
  useEffect(() => {
    if (progress > prevProgress.current) {
      prevProgress.current = progress;
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
    prevProgress.current = progress;
  }, [progress]);

  const pct = Math.round(progress * 100);
  const offset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <button
      onClick={openCodex}
      aria-label={`Forge Codex — ${pct}% discovered`}
      aria-pressed={showCodex}
      title={`Forge Codex — ${pct}% discovered`}
      className={`hud-tool ${pulse ? 'hud-tool-pulse' : ''}`}
    >
      <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden="true">
        {/* Background ring */}
        <circle
          cx={14}
          cy={14}
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(196,129,58,0.2)"
          strokeWidth={2.5}
        />
        {/* Progress ring */}
        <circle
          cx={14}
          cy={14}
          r={RING_RADIUS}
          fill="none"
          stroke="#e8a54b"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.8s ease',
          }}
        />
        {/* Percentage text */}
        <text
          x={14}
          y={14.5}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          fontSize={pct === 100 ? 7 : 8}
          fontFamily="Rajdhani, sans-serif"
          fontWeight={700}
        >
          {pct}
        </text>
      </svg>
    </button>
  );
}
