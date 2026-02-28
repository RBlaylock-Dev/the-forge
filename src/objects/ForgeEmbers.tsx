'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 150;
const SPREAD = 5;
const Y_MAX = 6;

export function ForgeEmbers() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SPREAD;
      pos[i * 3 + 1] = Math.random() * Y_MAX;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      spd[i] = Math.random() * 0.5 + 0.15;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      let y = posAttr.getY(i) + speeds[i] * 0.02;
      if (y > Y_MAX) {
        y = 0;
        posAttr.setX(i, (Math.random() - 0.5) * SPREAD);
        posAttr.setZ(i, (Math.random() - 0.5) * SPREAD);
      }
      posAttr.setX(i, posAttr.getX(i) + Math.sin(t + i) * 0.002);
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[-3, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xff4400}
        size={0.05}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
