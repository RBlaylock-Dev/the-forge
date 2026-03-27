'use client';

import { memo, useMemo } from 'react';
import * as THREE from 'three';

const pedestalMat = new THREE.MeshStandardMaterial({
  color: 0x4a3a28,
  emissive: 0x1a1008,
  emissiveIntensity: 0.3,
  roughness: 0.5,
  metalness: 0.8,
});

// Shared pedestal geometries — one per row tier
const PEDESTAL_GEOS = {
  short: new THREE.CylinderGeometry(0.4, 0.55, 1.5, 8),
  medium: new THREE.CylinderGeometry(0.4, 0.55, 3.0, 8),
  tall: new THREE.CylinderGeometry(0.4, 0.55, 4.5, 8),
};

const PEDESTAL_METRICS = {
  short: { cylY: 0.85, ringY: 1.62 },
  medium: { cylY: 1.6, ringY: 3.12 },
  tall: { cylY: 2.35, ringY: 4.62 },
};

const ringGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 24);

export type PedestalSize = 'short' | 'medium' | 'tall';

interface PedestalProps {
  position: [number, number, number];
  tierColor: number;
  size?: PedestalSize;
}

/**
 * Pedestal — reusable base for project vault artifacts.
 */
export const Pedestal = memo(function Pedestal({ position, tierColor, size = 'short' }: PedestalProps) {
  const ringMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: tierColor,
        emissive: tierColor,
        emissiveIntensity: 0.8,
      }),
    [tierColor],
  );

  const geo = PEDESTAL_GEOS[size];
  const { cylY, ringY } = PEDESTAL_METRICS[size];

  return (
    <group>
      {/* Pedestal cylinder */}
      <mesh
        position={[position[0], cylY, position[2]]}
        geometry={geo}
        material={pedestalMat}
        castShadow
      />

      {/* Tier glow ring */}
      <mesh
        position={[position[0], ringY, position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={ringGeo}
        material={ringMat}
      />
    </group>
  );
});
