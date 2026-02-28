'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface PathStripProps {
  from: { x: number; z: number };
  to: { x: number; z: number };
  color: number;
}

const segmentGeo = new THREE.BoxGeometry(0.3, 0.04, 0.8);

export function PathStrip({ from, to, color }: PathStripProps) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
        roughness: 0.5,
        metalness: 0.5,
      }),
    [color],
  );

  const segments = useMemo(() => {
    const dir = new THREE.Vector3(to.x - from.x, 0, to.z - from.z);
    const len = dir.length();
    dir.normalize();
    const count = Math.floor(len / 1.5);

    const items: { position: THREE.Vector3; quaternion: THREE.Quaternion }[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const px = from.x + dir.x * len * t;
      const pz = from.z + dir.z * len * t;
      // Match the Ground vertex displacement so paths sit on terrain
      const groundY = Math.sin(px * 0.2) * Math.cos(pz * 0.2) * 0.4;
      const pos = new THREE.Vector3(px, groundY + 0.06, pz);
      const target = new THREE.Vector3(to.x, pos.y, to.z);
      // Compute rotation to face the target
      const dummy = new THREE.Object3D();
      dummy.position.copy(pos);
      dummy.lookAt(target);
      dummy.updateMatrix();
      items.push({ position: pos, quaternion: dummy.quaternion.clone() });
    }
    return items;
  }, [from, to]);

  return (
    <>
      {segments.map((seg, i) => (
        <mesh
          key={i}
          geometry={segmentGeo}
          material={material}
          position={seg.position}
          quaternion={seg.quaternion}
        />
      ))}
    </>
  );
}
