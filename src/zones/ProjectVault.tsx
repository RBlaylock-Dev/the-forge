'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PROJECTS } from '@/data/projects';
import { TIER_COLORS } from '@/data/theme';
import { Pedestal } from '@/objects/Pedestal';
import type { ArtifactShape, DetailData } from '@/types';
import { ZoneLabel } from '@/objects/ZoneLabel';
import { ProjectLabel } from '@/objects/ProjectLabel';

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

// ── Layout ──────────────────────────────────────────────────
function getProjectLayout(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 + 0.3;
  const radius = 3 + (index % 3) * 2.5;
  return {
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
  };
}

// ── Artifact ────────────────────────────────────────────────
function Artifact({
  project,
  index,
  artifactRef,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  artifactRef: (el: THREE.Mesh | null) => void;
}) {
  const { x, z } = getProjectLayout(index, PROJECTS.length);
  const baseY = 2.3;

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
      position={[x, baseY, z]}
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
      <ZoneLabel title="Projects" subtitle="12 shipped projects" position={[0, 6, 0]} worldPosition={[22, 6, 0]} />

      {/* Platform */}
      <mesh position={[0, 0.1, 0]} material={platformMat}>
        <cylinderGeometry args={[10, 10.5, 0.2, 24]} />
      </mesh>

      {/* Projects */}
      {PROJECTS.map((proj, i) => {
        const { x, z } = getProjectLayout(i, PROJECTS.length);
        const tierColor = TIER_COLORS[proj.tier];
        return (
          <group key={proj.name}>
            <Pedestal position={[x, 0, z]} tierColor={tierColor} />
            <Artifact
              project={proj}
              index={i}
              artifactRef={(el) => {
                artifactsRef.current[i] = el;
              }}
            />
            <ProjectLabel
              name={proj.name}
              tier={proj.tier}
              tags={proj.tags}
              color={proj.color}
              position={[x, 3.5, z]}
              worldPosition={[x + 22, 3.5, z]}
            />
          </group>
        );
      })}
    </group>
  );
});
