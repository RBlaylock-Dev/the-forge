'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useForgeStore } from '@/store/useForgeStore';
import { TIER_COLORS } from '@/data/theme';
import type { ProjectTier } from '@/types';

interface ProjectLabelProps {
  name: string;
  tier: ProjectTier;
  tags: string[];
  color: number;
  position: [number, number, number];
  worldPosition: [number, number, number];
}

const FADE_FAR = 20;
const FADE_NEAR = 10;

function hexFromNumber(c: number) {
  return '#' + c.toString(16).padStart(6, '0');
}

export function ProjectLabel({ name, tier, tags, color, position, worldPosition }: ProjectLabelProps) {
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

  const tierColor = hexFromNumber(TIER_COLORS[tier]);
  const nameColor = hexFromNumber(color);
  const topTags = tags.slice(0, 2);

  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div ref={containerRef} className="project-label" style={{ opacity: 0 }}>
        <div className="project-label-name" style={{ color: nameColor }}>{name}</div>
        <div className="project-label-badge" style={{ backgroundColor: tierColor }}>{tier}</div>
        {topTags.length > 0 && (
          <div className="project-label-tags">{topTags.join(' · ')}</div>
        )}
      </div>
    </Html>
  );
}
