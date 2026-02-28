'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useForgeStore } from '@/store/useForgeStore';

interface HoloLabelProps {
  name: string;
  desc: string;
  status: string;
  color: number;
  position: [number, number, number];
  worldPosition: [number, number, number];
}

const FADE_FAR = 20;
const FADE_NEAR = 10;

function hexFromNumber(c: number) {
  return '#' + c.toString(16).padStart(6, '0');
}

export function HoloLabel({ name, desc, status, color, position, worldPosition }: HoloLabelProps) {
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
  const isActive = status === 'Active';

  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div ref={containerRef} className="holo-label" style={{ opacity: 0, borderColor: `${hex}60` }}>
        <div className="holo-label-name" style={{ color: hex }}>{name}</div>
        <div className={`holo-label-status ${isActive ? 'holo-status-active' : 'holo-status-dev'}`}>
          {status}
        </div>
        <div className="holo-label-desc">{desc}</div>
      </div>
    </Html>
  );
}
