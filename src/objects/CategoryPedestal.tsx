'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';
import { getCategorySkillCount } from '@/data/skills';
import { SubcategoryOrbit } from './SubcategoryOrbit';
import type { SkillCategoryConfig } from '@/types';

interface CategoryPedestalProps {
  category: SkillCategoryConfig;
}

const LABEL_FADE_FAR = 28;
const LABEL_FADE_NEAR = 14;

export function CategoryPedestal({ category }: CategoryPedestalProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const expandedCategory = useForgeStore((s) => s.expandedSkillCategory);
  const expandCategory = useForgeStore((s) => s.expandCategory);
  const collapseCategory = useForgeStore((s) => s.collapseCategory);
  const showDetailPanel = useForgeStore((s) => s.showDetailPanel);
  const isExpanded = expandedCategory === category.id;
  const skillCount = useMemo(() => getCategorySkillCount(category.id), [category.id]);

  // Local position within the zone group
  const [lx, , lz] = category.position;
  const localPos: [number, number, number] = [lx + 22, 0, lz]; // offset from zone center

  const baseMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: 0x1a1511,
      roughness: 0.6,
      metalness: 0.8,
    }),
    [],
  );

  const glowMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: category.color,
      emissive: category.color,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
      roughness: 0.3,
    }),
    [category.color],
  );

  // Animate glow ring pulse + distance-based label fade
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Glow pulse
    if (glowRef.current) {
      const pulse = 0.4 + Math.sin(t * 2 + category.position[0]) * 0.3;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isExpanded ? 1.2 : pulse;
    }

    // Label distance fade
    if (labelRef.current) {
      const { playerPosition } = useForgeStore.getState();
      const dx = playerPosition.x - category.position[0];
      const dz = playerPosition.z - category.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      const opacity = dist >= LABEL_FADE_FAR ? 0 : dist <= LABEL_FADE_NEAR ? 1 : 1 - (dist - LABEL_FADE_NEAR) / (LABEL_FADE_FAR - LABEL_FADE_NEAR);
      labelRef.current.style.opacity = String(opacity);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isExpanded) {
      collapseCategory();
    } else {
      expandCategory(category.id);
    }
  };

  return (
    <group position={localPos}>
      {/* Stone base cylinder */}
      <mesh
        position={[0, 0.4, 0]}
        material={baseMat}
        userData={{ interactable: true, name: category.label }}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.6, 0.7, 0.8, 12]} />
      </mesh>

      {/* Glow ring at base */}
      <mesh
        ref={glowRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={glowMat}
      >
        <torusGeometry args={[0.75, 0.06, 8, 32]} />
      </mesh>

      {/* Floating label */}
      <Html center position={[0, 1.6, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={labelRef} style={{ textAlign: 'center', whiteSpace: 'nowrap', opacity: 0, transition: 'opacity 0.3s ease' }}>
          <div
            className="font-cinzel"
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: category.color,
              textShadow: `0 0 10px ${category.color}80, 0 0 20px ${category.color}40`,
            }}
          >
            {category.label}
          </div>
          <div
            className="font-rajdhani"
            style={{
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              color: '#6a5a4a',
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            {skillCount} skills
          </div>
        </div>
      </Html>

      {/* Subcategory orbit (visible when expanded) */}
      {isExpanded && (
        <SubcategoryOrbit
          category={category}
          onSelectSubcategory={(sub) => {
            showDetailPanel({ type: 'skill-subcategory', data: { subcategory: sub, category } });
          }}
        />
      )}
    </group>
  );
}
