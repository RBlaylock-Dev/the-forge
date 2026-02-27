'use client';

import { memo, useMemo } from 'react';
import * as THREE from 'three';

const pedestalMat = new THREE.MeshStandardMaterial({
  color: 0x2a1e14,
  roughness: 0.5,
  metalness: 0.8,
});

// Shared pedestal geometry — avoids per-instance allocations
const pedestalGeo = new THREE.CylinderGeometry(0.4, 0.55, 1.5, 8);
const ringGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 24);

interface PedestalProps {
  position: [number, number, number];
  tierColor: number;
}

/**
 * Pedestal — reusable base for project vault artifacts.
 * Wrapped in React.memo since props (position, tierColor)
 * are stable across renders. Ring material is memoized
 * to avoid creating a new material every render.
 */
export const Pedestal = memo(function Pedestal({ position, tierColor }: PedestalProps) {
  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: tierColor,
        emissive: tierColor,
        emissiveIntensity: 0.8,
      }),
    [tierColor],
  );

  return (
    <group>
      {/* Pedestal cylinder */}
      <mesh
        position={[position[0], 0.85, position[2]]}
        geometry={pedestalGeo}
        material={pedestalMat}
        castShadow
      />

      {/* Tier glow ring */}
      <mesh
        position={[position[0], 1.62, position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={ringGeo}
        material={ringMat}
      />
    </group>
  );
});
