'use client';

import { memo, useEffect } from 'react';
import { SKILL_CATEGORIES } from '@/data/skills';
import { ZoneLabel } from '@/objects/ZoneLabel';
import { CategoryPedestal } from '@/objects/CategoryPedestal';
import { SkillConstellations } from '@/objects/SkillConstellations';
import { useForgeStore } from '@/store/useForgeStore';
import * as THREE from 'three';

const platformMat = new THREE.MeshStandardMaterial({
  color: 0x2a3a30,
  emissive: 0x0a1008,
  emissiveIntensity: 0.2,
  roughness: 0.5,
  metalness: 0.7,
});

export const SkillTree = memo(function SkillTree() {
  const currentZone = useForgeStore((s) => s.currentZone);
  const collapseCategory = useForgeStore((s) => s.collapseCategory);

  // Auto-collapse orbit when player leaves the skill-tree zone
  useEffect(() => {
    if (currentZone !== 'skill-tree') {
      collapseCategory();
    }
  }, [currentZone, collapseCategory]);

  return (
    <group position={[-22, 0, 0]}>
      <ZoneLabel
        title="Skills & Expertise"
        subtitle="Technologies I work with"
        position={[0, 8, 0]}
        worldPosition={[-22, 8, 0]}
      />

      {/* Platform */}
      <mesh position={[0, 0.15, 0]} material={platformMat}>
        <cylinderGeometry args={[6, 6.5, 0.3, 16]} />
      </mesh>

      {/* Category Pedestals */}
      {SKILL_CATEGORIES.map((cat) => (
        <CategoryPedestal key={cat.id} category={cat} />
      ))}

      {/* Constellation lines (unlock as subcategories are discovered) */}
      <SkillConstellations />
    </group>
  );
});
