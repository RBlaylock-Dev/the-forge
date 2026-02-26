'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Materials (shared across meshes) ────────────────────────
const darkMetal = new THREE.MeshStandardMaterial({
  color: 0x2a2018,
  roughness: 0.6,
  metalness: 0.8,
});

const brightMetal = new THREE.MeshStandardMaterial({
  color: 0x3a3028,
  roughness: 0.4,
  metalness: 0.9,
});

const coalMaterial = new THREE.MeshStandardMaterial({
  color: 0xff4400,
  emissive: 0xff4400,
  emissiveIntensity: 2.5,
  roughness: 0.8,
});

const torchMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6b1a,
  emissive: 0xff6b1a,
  emissiveIntensity: 1.5,
});

const pitMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1008,
  roughness: 0.7,
  metalness: 0.6,
});

// ── Shared Geometries ───────────────────────────────────────
const pillarGeo = new THREE.CylinderGeometry(0.25, 0.3, 3, 6);
const torchGeo = new THREE.SphereGeometry(0.15, 8, 8);

// ── Sub-components ──────────────────────────────────────────

function Anvil() {
  const hornGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.3, 1.4, 8);
    geo.rotateZ(Math.PI / 2);
    return geo;
  }, []);

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.6, 0]} material={darkMetal} castShadow receiveShadow>
        <boxGeometry args={[2, 1.2, 1.2]} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 1.4, 0]} material={brightMetal} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.4, 1.5]} />
      </mesh>
      {/* Horn */}
      <mesh
        position={[1.8, 1.4, 0]}
        geometry={hornGeo}
        material={brightMetal}
        castShadow
      />
    </group>
  );
}

function FirePit() {
  const coals = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      positions.push([
        (Math.random() - 0.5) * 1,
        0.4 + Math.random() * 0.2,
        (Math.random() - 0.5) * 0.7,
      ]);
    }
    return positions;
  }, []);

  const coalSizes = useMemo(
    () => Array.from({ length: 12 }, () => 0.1 + Math.random() * 0.12),
    [],
  );

  return (
    <group position={[-3, 0, 0]}>
      {/* Pit cylinder */}
      <mesh position={[0, 0.5, 0]} material={pitMaterial} receiveShadow>
        <cylinderGeometry args={[1.2, 0.9, 1, 12]} />
      </mesh>
      {/* Coals */}
      {coals.map((pos, i) => (
        <mesh key={i} position={pos} material={coalMaterial}>
          <sphereGeometry args={[coalSizes[i], 6, 6]} />
        </mesh>
      ))}
    </group>
  );
}

function Pillars() {
  const pillars = useMemo(() => {
    const items: { x: number; z: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      items.push({
        x: Math.cos(angle) * 6,
        z: Math.sin(angle) * 6,
      });
    }
    return items;
  }, []);

  return (
    <>
      {pillars.map((p, i) => (
        <group key={i}>
          {/* Pillar */}
          <mesh
            position={[p.x, 1.5, p.z]}
            geometry={pillarGeo}
            material={darkMetal}
            castShadow
          />
          {/* Torch */}
          <mesh
            position={[p.x, 3.2, p.z]}
            geometry={torchGeo}
            material={torchMaterial}
          />
          {/* Torch light */}
          <pointLight
            color={0xff6b1a}
            intensity={0.5}
            distance={8}
            decay={2}
            position={[p.x, 3.2, p.z]}
          />
        </group>
      ))}
    </>
  );
}

// ── Main Component ──────────────────────────────────────────

export function Hearth() {
  const fireLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!fireLightRef.current) return;
    const t = clock.getElapsedTime();
    fireLightRef.current.intensity =
      3.5 + Math.sin(t * 8) * 0.6 + Math.sin(t * 13) * 0.35;
    fireLightRef.current.position.y =
      2.5 + Math.sin(t * 3) * 0.1;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Fire light (animated) */}
      <pointLight
        ref={fireLightRef}
        color={0xff6b1a}
        intensity={3.5}
        distance={30}
        decay={2}
        position={[0, 2.5, 0]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Anvil />
      <FirePit />
      <Pillars />
    </group>
  );
}
