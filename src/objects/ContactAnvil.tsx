'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

// ── Materials ───────────────────────────────────────────────
const pedestalMat = new THREE.MeshStandardMaterial({
  color: 0x3a2a1a,
  roughness: 0.6,
  metalness: 0.7,
});

const anvilBaseMat = new THREE.MeshStandardMaterial({
  color: 0x4a3d30,
  emissive: 0xc4813a,
  emissiveIntensity: 0.2,
  roughness: 0.5,
  metalness: 0.8,
});

const anvilTopMat = new THREE.MeshStandardMaterial({
  color: 0x5a4a3a,
  emissive: 0xe8a54b,
  emissiveIntensity: 0.3,
  roughness: 0.4,
  metalness: 0.9,
});

const glowRingMat = new THREE.MeshStandardMaterial({
  color: 0xc4813a,
  emissive: 0xe8a54b,
  emissiveIntensity: 0.6,
  transparent: true,
  opacity: 0.4,
  side: THREE.DoubleSide,
});

/**
 * ContactAnvil — A small glowing anvil on a pedestal.
 * Positioned in the Hearth zone. Clicking opens the contact modal.
 */
export const ContactAnvil = memo(function ContactAnvil() {
  const anvilRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const openContact = useForgeStore((s) => s.openContact);

  const hornGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.15, 0.7, 8);
    geo.rotateZ(Math.PI / 2);
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle hover bob
    if (anvilRef.current) {
      anvilRef.current.position.y = 1.2 + Math.sin(t * 1.3) * 0.03;
    }

    // Pulsing glow ring
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.2;
      ringRef.current.rotation.z = t * 0.3;
    }

    // Pulsing light
    if (lightRef.current) {
      lightRef.current.intensity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!useForgeStore.getState().isStarted) return;
    if (useForgeStore.getState().isTourActive) return;
    openContact();
  };

  return (
    <group position={[-3, 0, -3]}>
      {/* Pedestal */}
      <mesh position={[0, 0.45, 0]} material={pedestalMat}>
        <cylinderGeometry args={[0.3, 0.4, 0.9, 8]} />
      </mesh>
      <mesh position={[0, 0.95, 0]} material={pedestalMat}>
        <cylinderGeometry args={[0.4, 0.3, 0.1, 8]} />
      </mesh>

      {/* Glow ring at base */}
      <mesh
        ref={ringRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={glowRingMat}
      >
        <ringGeometry args={[0.35, 0.5, 24]} />
      </mesh>

      {/* Floating anvil group (clickable) */}
      <group ref={anvilRef} position={[0, 1.2, 0]}>
        {/* Anvil base */}
        <mesh
          material={anvilBaseMat}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = '';
          }}
        >
          <boxGeometry args={[0.8, 0.5, 0.5]} />
        </mesh>

        {/* Anvil top (flat surface) */}
        <mesh position={[0, 0.35, 0]} material={anvilTopMat}>
          <boxGeometry args={[1.0, 0.15, 0.6]} />
        </mesh>

        {/* Horn */}
        <mesh
          position={[0.7, 0.35, 0]}
          geometry={hornGeo}
          material={anvilTopMat}
        />
      </group>

      {/* Ambient glow light */}
      <pointLight
        ref={lightRef}
        color={0xe8a54b}
        intensity={0.3}
        distance={4}
        decay={2}
        position={[0, 1.5, 0.3]}
      />
    </group>
  );
});
