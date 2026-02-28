'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useForgeStore } from '@/store/useForgeStore';

// ── Category Header Label ──────────────────────────────────

interface CategoryLabelProps {
  name: string;
  color: number;
  position: [number, number, number];
  worldPosition: [number, number, number];
}

const CAT_FADE_FAR = 25;
const CAT_FADE_NEAR = 12;

function hexFromNumber(c: number) {
  return '#' + c.toString(16).padStart(6, '0');
}

export function CategoryLabel({ name, color, position, worldPosition }: CategoryLabelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const el = containerRef.current;
    if (!el) return;

    const { playerPosition } = useForgeStore.getState();
    const dx = playerPosition.x - worldPosition[0];
    const dz = playerPosition.z - worldPosition[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    const opacity = dist >= CAT_FADE_FAR ? 0 : dist <= CAT_FADE_NEAR ? 1 : 1 - (dist - CAT_FADE_NEAR) / (CAT_FADE_FAR - CAT_FADE_NEAR);
    el.style.opacity = String(opacity);
  });

  const hex = hexFromNumber(color);

  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div ref={containerRef} className="skill-cat-label" style={{ opacity: 0 }}>
        <div className="skill-cat-name" style={{ color: hex, textShadow: `0 0 10px ${hex}80, 0 0 20px ${hex}40` }}>
          {name}
        </div>
      </div>
    </Html>
  );
}

// ── Individual Skill Label ─────────────────────────────────

interface SkillLabelProps {
  name: string;
  level: number;
  color: number;
  position: [number, number, number];
  worldPosition: [number, number, number];
}

const SKILL_FADE_FAR = 18;
const SKILL_FADE_NEAR = 8;

export function SkillNodeLabel({ name, level, color, position, worldPosition }: SkillLabelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const el = containerRef.current;
    if (!el) return;

    const { playerPosition } = useForgeStore.getState();
    const dx = playerPosition.x - worldPosition[0];
    const dz = playerPosition.z - worldPosition[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    const opacity = dist >= SKILL_FADE_FAR ? 0 : dist <= SKILL_FADE_NEAR ? 1 : 1 - (dist - SKILL_FADE_NEAR) / (SKILL_FADE_FAR - SKILL_FADE_NEAR);
    el.style.opacity = String(opacity);
  });

  const hex = hexFromNumber(color);
  const hammers = '\u2692'.repeat(level);

  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div ref={containerRef} className="skill-node-label" style={{ opacity: 0 }}>
        <div className="skill-node-name">{name}</div>
        <div className="skill-node-level" style={{ color: hex }}>{hammers}</div>
      </div>
    </Html>
  );
}
