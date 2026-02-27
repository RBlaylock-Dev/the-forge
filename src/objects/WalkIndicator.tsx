'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ringGeo = new THREE.RingGeometry(0.3, 0.5, 24);

/**
 * Glowing ring on the ground showing the click-to-walk destination.
 * Pulses gently to indicate the target is active.
 */
export function WalkIndicator({
  target,
}: {
  target: React.MutableRefObject<THREE.Vector3 | null>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xe8a54b,
        emissive: 0xe8a54b,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (target.current) {
      mesh.visible = true;
      mesh.position.set(target.current.x, 0.05, target.current.z);
      // Pulse opacity
      const t = clock.getElapsedTime();
      material.opacity = 0.3 + Math.sin(t * 4) * 0.15;
      material.emissiveIntensity = 0.6 + Math.sin(t * 4) * 0.3;
    } else {
      mesh.visible = false;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={ringGeo}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    />
  );
}
