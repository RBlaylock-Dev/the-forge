'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useForgeStore } from '@/store/useForgeStore';

interface TimelineCardProps {
  era: string;
  org: string;
  years: string;
  skill: string;
  color: number;
  position: [number, number, number];
  worldPosition: [number, number, number];
  side: 'left' | 'right';
}

const FADE_FAR = 22;
const FADE_NEAR = 10;

function hexFromNumber(c: number) {
  return '#' + c.toString(16).padStart(6, '0');
}

export function TimelineCard({ era, org, years, skill, color, position, worldPosition, side }: TimelineCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const el = containerRef.current;
    if (!el) return;

    const { playerPosition } = useForgeStore.getState();
    const dx = playerPosition.x - worldPosition[0];
    const dz = playerPosition.z - worldPosition[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    const opacity = dist >= FADE_FAR ? 0 : dist <= FADE_NEAR ? 1 : 1 - (dist - FADE_NEAR) / (FADE_FAR - FADE_NEAR);
    el.style.opacity = String(opacity);
  });

  const hex = hexFromNumber(color);
  const alignClass = side === 'left' ? 'timeline-card-left' : 'timeline-card-right';

  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div ref={containerRef} className={`timeline-card ${alignClass}`} style={{ opacity: 0, borderColor: hex }}>
        <div className="timeline-card-years" style={{ color: hex }}>{years}</div>
        <div className="timeline-card-era">{era}</div>
        <div className="timeline-card-org">{org}</div>
        <div className="timeline-card-skill">{skill}</div>
      </div>
    </Html>
  );
}
