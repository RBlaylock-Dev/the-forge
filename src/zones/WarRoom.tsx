'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ACTIVE_PROJECTS } from '@/data/activeProjects';
import type { DetailData } from '@/types';
import { ZoneLabel } from '@/objects/ZoneLabel';
import { HoloLabel } from '@/objects/HoloLabel';

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

// ── Hologram geometry pool — cycles for any number of projects ─
const HOLO_GEOMETRY_POOL: THREE.BufferGeometry[] = [
  new THREE.BoxGeometry(0.6, 0.6, 0.6),
  new THREE.BoxGeometry(0.7, 0.12, 0.5),
  new THREE.SphereGeometry(0.35, 12, 12),
  new THREE.OctahedronGeometry(0.35, 0),
  new THREE.IcosahedronGeometry(0.32, 0),
  new THREE.ConeGeometry(0.3, 0.6, 6),
  new THREE.TorusGeometry(0.25, 0.1, 8, 16),
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
      geometry={HOLO_GEOMETRY_POOL[index % HOLO_GEOMETRY_POOL.length]}
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
      <ZoneLabel title="Currently Building" subtitle="7 active projects" position={[0, 5, 0]} worldPosition={[0, 5, 24]} />

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
      {ACTIVE_PROJECTS.map((proj, i) => {
        const angle = (i / ACTIVE_PROJECTS.length) * Math.PI * 2;
        const r = 1.6;
        const px = Math.cos(angle) * r;
        const pz = Math.sin(angle) * r;
        return (
          <group key={proj.name}>
            <Hologram
              project={proj}
              index={i}
              holoRef={(el) => {
                holosRef.current[i] = el;
              }}
            />
            <HoloLabel
              name={proj.name}
              desc={proj.desc}
              status={proj.status}
              color={proj.color}
              position={[px, 3.2, pz]}
              worldPosition={[px, 3.2, pz + 24]}
            />
          </group>
        );
      })}
    </group>
  );
});
