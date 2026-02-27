'use client';

import { useForgeStore } from '@/store/useForgeStore';

export function InteractPrompt() {
  const interactTarget = useForgeStore((s) => s.interactTarget);
  const isStarted = useForgeStore((s) => s.isStarted);

  const visible = isStarted && interactTarget !== null;

  return (
    <div
      className="font-rajdhani"
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '1px',
          color: '#c4813a',
          background: 'rgba(196,129,58,0.12)',
          border: '1px solid rgba(196,129,58,0.3)',
          borderRadius: 3,
          padding: '4px 10px',
        }}
      >
        E
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#f5deb3',
        }}
      >
        Inspect {interactTarget?.name ?? ''}
      </span>
    </div>
  );
}
