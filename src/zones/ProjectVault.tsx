'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PROJECTS } from '@/data/projects';
import { TIER_COLORS } from '@/data/theme';
import { Pedestal, type PedestalSize } from '@/objects/Pedestal';
import type { ArtifactShape, DetailData } from '@/types';
import { ZoneLabel } from '@/objects/ZoneLabel';
import { ProjectLabel } from '@/objects/ProjectLabel';
import { useForgeStore } from '@/store/useForgeStore';

// ── Platform material ───────────────────────────────────────
const platformMat = new THREE.MeshStandardMaterial({
  color: 0x2a2018,
  emissive: 0x0a0806,
  emissiveIntensity: 0.2,
  roughness: 0.5,
  metalness: 0.7,
});

// ── Shared geometries by shape ──────────────────────────────
const SHAPE_GEOMETRIES: Record<ArtifactShape, THREE.BufferGeometry> = {
  box: new THREE.BoxGeometry(0.45, 0.45, 0.45),
  ico: new THREE.IcosahedronGeometry(0.32, 0),
  octa: new THREE.OctahedronGeometry(0.32, 0),
  torus: new THREE.TorusGeometry(0.28, 0.1, 8, 16),
  cone: new THREE.ConeGeometry(0.28, 0.5, 6),
  sphere: new THREE.SphereGeometry(0.3, 12, 12),
};

// ── 3-Row Amphitheater Layout ───────────────────────────────
// 3 rows of 4 projects in a 100° arc. Fewer items per row = no overlap.
// Each row is further out and elevated so nothing hides.
const ITEMS_PER_ROW = 4;
const ARC_DEG = 100;
const ARC_RAD = (ARC_DEG * Math.PI) / 180;
const HALF_ARC = ARC_RAD / 2;
const STEP = ARC_RAD / (ITEMS_PER_ROW - 1);

const ROWS: { radius: number; baseY: number; pedestal: PedestalSize }[] = [
  { radius: 5, baseY: 2.0, pedestal: 'short' },
  { radius: 8, baseY: 3.5, pedestal: 'medium' },
  { radius: 11, baseY: 5.0, pedestal: 'tall' },
];

const LABEL_OFFSET_Y = 1.2;

function getLayout(index: number) {
  const row = Math.floor(index / ITEMS_PER_ROW);
  const col = index % ITEMS_PER_ROW;
  const { radius, baseY, pedestal } = ROWS[row];
  const angle = -HALF_ARC + col * STEP;

  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
    baseY,
    labelY: baseY + LABEL_OFFSET_Y,
    pedestal,
  };
}

// ── Artifact ────────────────────────────────────────────────
function Artifact({
  project,
  index,
  position,
  baseY,
  artifactRef,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  position: [number, number, number];
  baseY: number;
  artifactRef: (el: THREE.Mesh | null) => void;
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        metalness: 0.7,
      }),
    [project.color],
  );

  const detailData: DetailData = {
    type: 'project',
    data: project,
  };

  return (
    <mesh
      ref={artifactRef}
      position={position}
      geometry={SHAPE_GEOMETRIES[project.shape]}
      material={material}
      userData={{
        interactable: true,
        type: 'project',
        name: project.name,
        detailData,
        baseY,
        phase: index * 0.7,
      }}
      onClick={(e) => {
        e.stopPropagation();
        useForgeStore.getState().showDetailPanel(detailData);
      }}
    />
  );
}

// ── Main Component ──────────────────────────────────────────

export const ProjectVault = memo(function ProjectVault() {
  const artifactsRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const mesh of artifactsRef.current) {
      if (!mesh) continue;
      const ud = mesh.userData;
      mesh.position.y = ud.baseY + Math.sin(t * 1.3 + ud.phase) * 0.15;
      mesh.rotation.y = t * 0.7 + ud.phase;
    }
  });

  return (
    <group position={[22, 0, 0]}>
      <ZoneLabel title="Projects" subtitle="12 shipped projects" position={[0, 8, 0]} worldPosition={[22, 8, 0]} />

      {/* Platform */}
      <mesh position={[0, 0.1, 0]} material={platformMat}>
        <cylinderGeometry args={[12, 12.5, 0.2, 24]} />
      </mesh>

      {/* Projects — 3 tiered rows of 4 */}
      {PROJECTS.map((proj, i) => {
        const layout = getLayout(i);
        const tierColor = TIER_COLORS[proj.tier];
        return (
          <group key={proj.name}>
            <Pedestal position={[layout.x, 0, layout.z]} tierColor={tierColor} size={layout.pedestal} />
            <Artifact
              project={proj}
              index={i}
              position={[layout.x, layout.baseY, layout.z]}
              baseY={layout.baseY}
              artifactRef={(el) => {
                artifactsRef.current[i] = el;
              }}
            />
            <ProjectLabel
              name={proj.name}
              tier={proj.tier}
              tags={proj.tags}
              color={proj.color}
              position={[layout.x, layout.labelY, layout.z]}
              worldPosition={[layout.x + 22, layout.labelY, layout.z]}
            />
          </group>
        );
      })}
    </group>
  );
});
