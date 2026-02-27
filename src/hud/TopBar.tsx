'use client';

import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';

export function TopBar() {
  const currentZone = useForgeStore((s) => s.currentZone);
  const isStarted = useForgeStore((s) => s.isStarted);

  const zoneName = currentZone ? ZONE_DEFS[currentZone].name : 'The Wilds';
  const isActive = currentZone !== null;

  if (!isStarted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 28px',
        background:
          'linear-gradient(180deg, rgba(10,8,6,0.92) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}
    >
      {/* Brand */}
      <div
        className="font-cinzel"
        style={{
          fontWeight: 900,
          fontSize: 16,
          letterSpacing: '5px',
          color: '#c4813a',
          textTransform: 'uppercase',
          textShadow: '0 0 20px rgba(196,129,58,0.4)',
        }}
      >
        THE FORGE{' '}
        <span style={{ color: '#f5deb3', fontWeight: 400 }}>— RB</span>
      </div>

      {/* Zone indicator */}
      <div
        className="font-cinzel"
        style={{
          fontSize: 13,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: isActive ? '#e8a54b' : '#5a4a3a',
          textShadow: isActive
            ? '0 0 12px rgba(232,165,75,0.5)'
            : 'none',
          transition: 'all 0.6s ease',
        }}
      >
        {zoneName}
      </div>
    </div>
  );
}
