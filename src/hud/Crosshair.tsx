'use client';

import { useForgeStore } from '@/store/useForgeStore';

export function Crosshair() {
  const isLocked = useForgeStore((s) => s.isLocked);

  if (!isLocked) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        pointerEvents: 'none',
        width: 24,
        height: 24,
      }}
    >
      {/* Horizontal line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 12,
          height: 1,
          background: 'rgba(245,222,179,0.6)',
          borderRadius: 1,
        }}
      />
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1,
          height: 12,
          background: 'rgba(245,222,179,0.6)',
          borderRadius: 1,
        }}
      />
    </div>
  );
}
