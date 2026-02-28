'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TIMELINE_DATA } from '@/data/timeline';
import type { DetailData } from '@/types';
import { ZoneLabel } from '@/objects/ZoneLabel';
import { TimelineCard } from '@/objects/TimelineCard';

// ── Materials ───────────────────────────────────────────────
const pathMat = new THREE.MeshStandardMaterial({
  color: 0x6644aa,
  emissive: 0x6644aa,
  emissiveIntensity: 0.25,
  roughness: 0.5,
  metalness: 0.6,
});

// ── Layout helper ───────────────────────────────────────────
function getEraPosition(index: number) {
  const x = (index - 2) * 3.5;
  const z = Math.sin(index * 0.8) * 1.5;
  return { x, z };
}

// ── Path segment between eras ───────────────────────────────
function PathSegment({ fromIndex }: { fromIndex: number }) {
  const from = getEraPosition(fromIndex);
  const to = getEraPosition(fromIndex + 1);

  const { position, quaternion } = useMemo(() => {
    const mid = new THREE.Vector3(
      (from.x + to.x) / 2,
      0.05,
      (from.z + to.z) / 2,
    );
    const dummy = new THREE.Object3D();
    dummy.position.copy(mid);
    dummy.lookAt(new THREE.Vector3(to.x, 0.05, to.z));
    dummy.updateMatrix();
    return { position: mid, quaternion: dummy.quaternion.clone() };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} material={pathMat}>
      <boxGeometry args={[3.5, 0.06, 0.3]} />
    </mesh>
  );
}

// ── Era marker group ────────────────────────────────────────
function EraMarker({
  era,
  index,
  markerRef,
}: {
  era: (typeof TIMELINE_DATA)[number];
  index: number;
  markerRef: (el: THREE.Mesh | null) => void;
}) {
  const { x, z } = getEraPosition(index);
  const baseY = 2.2;
  const cardSide = index % 2 === 0 ? 'left' : 'right';
  const cardZOffset = cardSide === 'left' ? -2.2 : 2.2;

  const markerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: era.color,
        emissive: era.color,
        emissiveIntensity: 0.9,
        roughness: 0.3,
        metalness: 0.5,
      }),
    [era.color],
  );

  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: era.color,
        emissive: era.color,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide,
      }),
    [era.color],
  );

  const detailData: DetailData = {
    type: 'timeline-era',
    data: era,
  };

  return (
    <group>
      {/* Timeline card */}
      <TimelineCard
        era={era.era}
        org={era.org}
        years={era.years}
        skill={era.skill}
        color={era.color}
        position={[x, 3.5, z + cardZOffset]}
        worldPosition={[x, 3.5, z + cardZOffset - 24]}
        side={cardSide}
      />

      {/* Floating marker (interactable) */}
      <mesh
        ref={markerRef}
        position={[x, baseY, z]}
        material={markerMat}
        userData={{
          interactable: true,
          type: 'timeline-era',
          name: era.era,
          detailData,
          baseY,
          phase: index * 1.2,
        }}
      >
        <octahedronGeometry args={[0.4, 0]} />
      </mesh>

      {/* Vertical connector */}
      <mesh position={[x, 1.1, z]} material={pathMat}>
        <cylinderGeometry args={[0.04, 0.04, 2, 4]} />
      </mesh>

      {/* Ground ring */}
      <mesh
        position={[x, 0.03, z]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={ringMat}
      >
        <ringGeometry args={[0.6, 0.75, 24]} />
      </mesh>
    </group>
  );
}

// ── Main Component ──────────────────────────────────────────

export const Timeline = memo(function Timeline() {
  const markersRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const mesh of markersRef.current) {
      if (!mesh) continue;
      const ud = mesh.userData;
      mesh.position.y = ud.baseY + Math.sin(t * 1.3 + ud.phase) * 0.15;
      mesh.rotation.y = t * 0.7 + ud.phase;
    }
  });

  return (
    <group position={[0, 0, -24]}>
      <ZoneLabel title="Career Journey" subtitle="From leadership to engineering" position={[0, 5, 0]} worldPosition={[0, 5, -24]} />

      {/* Path segments */}
      {TIMELINE_DATA.slice(0, -1).map((_, i) => (
        <PathSegment key={i} fromIndex={i} />
      ))}

      {/* Era markers */}
      {TIMELINE_DATA.map((era, i) => (
        <EraMarker
          key={era.era}
          era={era}
          index={i}
          markerRef={(el) => {
            markersRef.current[i] = el;
          }}
        />
      ))}
    </group>
  );
});
