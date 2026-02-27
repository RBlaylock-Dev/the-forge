'use client';

import { useEffect, useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';

export function ZoneFlash() {
  const lastDiscoveredZone = useForgeStore((s) => s.lastDiscoveredZone);
  const [visible, setVisible] = useState(false);
  const [zoneName, setZoneName] = useState('');

  useEffect(() => {
    if (!lastDiscoveredZone) return;
    setZoneName(ZONE_DEFS[lastDiscoveredZone].name);
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [lastDiscoveredZone]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        className="font-cinzel zone-flash-animate"
        style={{
          fontWeight: 900,
          fontSize: 'clamp(28px, 4vw, 52px)',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          color: '#e8a54b',
          textShadow:
            '0 0 40px rgba(232,165,75,0.6), 0 0 80px rgba(232,165,75,0.3)',
        }}
      >
        {zoneName}
      </div>
    </div>
  );
}
