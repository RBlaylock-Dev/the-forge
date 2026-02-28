'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useForgeStore } from '@/store/useForgeStore';

interface ZoneLabelProps {
  title: string;
  subtitle: string;
  position: [number, number, number];
}

const FADE_FAR = 30;
const FADE_NEAR = 15;

export function ZoneLabel({ title, subtitle, position }: ZoneLabelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStarted = useForgeStore((s) => s.isStarted);

  useFrame(() => {
    const el = containerRef.current;
    if (!el) return;

    const { playerPosition } = useForgeStore.getState();
    const dx = playerPosition.x - position[0];
    const dz = playerPosition.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Opacity: 0 at FADE_FAR+, 1 at FADE_NEAR-
    const opacity = dist >= FADE_FAR ? 0 : dist <= FADE_NEAR ? 1 : 1 - (dist - FADE_NEAR) / (FADE_FAR - FADE_NEAR);

    // Scale: 1 at ≤20, shrinks to 0.6 at 30+
    const scale = dist <= 20 ? 1 : Math.max(0.6, 1 - (dist - 20) * 0.04);

    el.style.opacity = String(opacity);
    el.style.transform = `scale(${scale})`;
  });

  if (!isStarted) return null;

  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div ref={containerRef} className="zone-label" style={{ opacity: 0 }}>
        <div className="zone-label-title">{title}</div>
        <div className="zone-label-subtitle">{subtitle}</div>
      </div>
    </Html>
  );
}
