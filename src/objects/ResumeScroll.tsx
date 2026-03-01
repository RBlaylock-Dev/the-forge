'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

// ── Materials ───────────────────────────────────────────────
const standMat = new THREE.MeshStandardMaterial({
  color: 0x3a2a1a,
  roughness: 0.6,
  metalness: 0.7,
});

const parchmentMat = new THREE.MeshStandardMaterial({
  color: 0xd4b896,
  emissive: 0xc4813a,
  emissiveIntensity: 0.3,
  roughness: 0.8,
  metalness: 0.1,
});

const rodMat = new THREE.MeshStandardMaterial({
  color: 0x8b6914,
  emissive: 0xc4813a,
  emissiveIntensity: 0.15,
  roughness: 0.4,
  metalness: 0.8,
});

const sealMat = new THREE.MeshStandardMaterial({
  color: 0xc4813a,
  emissive: 0xe8a54b,
  emissiveIntensity: 0.6,
  roughness: 0.3,
  metalness: 0.5,
});

/**
 * ResumeScroll — A glowing parchment scroll on a display stand.
 * Positioned in the Hearth zone. Clicking opens the resume preview.
 */
export const ResumeScroll = memo(function ResumeScroll() {
  const scrollRef = useRef<THREE.Group>(null);
  const sealRef = useRef<THREE.Mesh>(null);
  const openResume = useForgeStore((s) => s.openResume);

  // Parchment body geometry (slightly curved box)
  const parchmentGeo = useMemo(() => new THREE.BoxGeometry(0.6, 0.8, 0.08), []);
  const rodGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.75, 8), []);
  const sealGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 0.03, 12), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle hover bob
    if (scrollRef.current) {
      scrollRef.current.position.y = 1.3 + Math.sin(t * 1.5) * 0.04;
      scrollRef.current.rotation.y = Math.sin(t * 0.5) * 0.08;
    }

    // Seal pulse
    if (sealRef.current) {
      const mat = sealRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.2;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!useForgeStore.getState().isStarted) return;
    if (useForgeStore.getState().isTourActive) return;
    openResume();
  };

  return (
    <group position={[3, 0, -3]}>
      {/* Display stand */}
      <mesh position={[0, 0.5, 0]} material={standMat}>
        <cylinderGeometry args={[0.25, 0.35, 1, 8]} />
      </mesh>
      <mesh position={[0, 1.05, 0]} material={standMat}>
        <cylinderGeometry args={[0.35, 0.25, 0.1, 8]} />
      </mesh>

      {/* Floating scroll group */}
      <group ref={scrollRef} position={[0, 1.3, 0]}>
        {/* Parchment body */}
        <mesh
          geometry={parchmentGeo}
          material={parchmentMat}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = '';
          }}
        />

        {/* Top rod */}
        <mesh
          position={[0, 0.42, 0]}
          rotation={[0, 0, Math.PI / 2]}
          geometry={rodGeo}
          material={rodMat}
        />

        {/* Bottom rod */}
        <mesh
          position={[0, -0.42, 0]}
          rotation={[0, 0, Math.PI / 2]}
          geometry={rodGeo}
          material={rodMat}
        />

        {/* Wax seal */}
        <mesh
          ref={sealRef}
          position={[0, -0.15, 0.06]}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={sealGeo}
          material={sealMat}
        />
      </group>

      {/* Ambient glow light */}
      <pointLight
        color={0xe8a54b}
        intensity={0.4}
        distance={4}
        decay={2}
        position={[0, 1.5, 0.3]}
      />
    </group>
  );
});
