'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ACTIVE_PROJECTS } from '@/data/activeProjects';
import type { DetailData } from '@/types';

// ── Materials ───────────────────────────────────────────────
const tableMat = new THREE.MeshStandardMaterial({
  color: 0x1a2a3a,
  roughness: 0.4,
  metalness: 0.8,
});

const holoRingMat = new THREE.MeshStandardMaterial({
  color: 0x22aacc,
  emissive: 0x22aacc,
  emissiveIntensity: 1,
  transparent: true,
  opacity: 0.4,
});

// ── Hologram geometries (one per active project) ────────────
const HOLO_GEOMETRIES: THREE.BufferGeometry[] = [
  new THREE.BoxGeometry(0.6, 0.6, 0.6),       // HALO — Ethereum block
  new THREE.BoxGeometry(0.7, 0.12, 0.5),       // BibleWalk — book
  new THREE.SphereGeometry(0.35, 12, 12),      // Savannah Connect — globe
  new THREE.OctahedronGeometry(0.35, 0),        // RB Digital
];

// ── Hologram ────────────────────────────────────────────────
function Hologram({
  project,
  index,
  holoRef,
}: {
  project: (typeof ACTIVE_PROJECTS)[number];
  index: number;
  holoRef: (el: THREE.Mesh | null) => void;
}) {
  const angle = (index / ACTIVE_PROJECTS.length) * Math.PI * 2;
  const r = 1.6;
  const px = Math.cos(angle) * r;
  const pz = Math.sin(angle) * r;
  const baseY = 2;

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.7,
        wireframe: true,
      }),
    [project.color],
  );

  const detailData: DetailData = {
    type: 'active-project',
    data: project,
  };

  return (
    <mesh
      ref={holoRef}
      position={[px, baseY, pz]}
      geometry={HOLO_GEOMETRIES[index]}
      material={material}
      userData={{
        interactable: true,
        type: 'active-project',
        name: project.name,
        detailData,
        baseY,
        phase: index * 1.5,
      }}
    />
  );
}

// ── Main Component ──────────────────────────────────────────

export const WarRoom = memo(function WarRoom() {
  const holosRef = useRef<(THREE.Mesh | null)[]>([]);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate holograms
    for (const mesh of holosRef.current) {
      if (!mesh) continue;
      const ud = mesh.userData;
      mesh.position.y = ud.baseY + Math.sin(t * 1.3 + ud.phase) * 0.15;
      mesh.rotation.y = t * 0.7 + ud.phase;
    }

    // Rotate holographic ring slowly
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group position={[0, 0, 24]}>
      {/* Table top */}
      <mesh position={[0, 1, 0]} material={tableMat}>
        <cylinderGeometry args={[3, 2.8, 0.15, 20]} />
      </mesh>

      {/* Table leg */}
      <mesh position={[0, 0.5, 0]} material={tableMat}>
        <cylinderGeometry args={[0.4, 0.5, 1, 10]} />
      </mesh>

      {/* Holographic ring */}
      <mesh
        ref={ringRef}
        position={[0, 1.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={holoRingMat}
      >
        <torusGeometry args={[2.5, 0.02, 8, 48]} />
      </mesh>

      {/* Holograms */}
      {ACTIVE_PROJECTS.map((proj, i) => (
        <Hologram
          key={proj.name}
          project={proj}
          index={i}
          holoRef={(el) => {
            holosRef.current[i] = el;
          }}
        />
      ))}
    </group>
  );
});
