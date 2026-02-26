'use client';

import * as THREE from 'three';

const pedestalMat = new THREE.MeshStandardMaterial({
  color: 0x2a1e14,
  roughness: 0.5,
  metalness: 0.8,
});

interface PedestalProps {
  position: [number, number, number];
  tierColor: number;
}

export function Pedestal({ position, tierColor }: PedestalProps) {
  const ringMat = new THREE.MeshStandardMaterial({
    color: tierColor,
    emissive: tierColor,
    emissiveIntensity: 0.8,
  });

  return (
    <group>
      {/* Pedestal cylinder */}
      <mesh
        position={[position[0], 0.85, position[2]]}
        material={pedestalMat}
        castShadow
      >
        <cylinderGeometry args={[0.4, 0.55, 1.5, 8]} />
      </mesh>

      {/* Tier glow ring */}
      <mesh
        position={[position[0], 1.62, position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={ringMat}
      >
        <torusGeometry args={[0.5, 0.03, 8, 24]} />
      </mesh>
    </group>
  );
}
