'use client';

import { memo, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';
import type { Testimonial, DetailData } from '@/types';

const RELATIONSHIP_COLORS: Record<string, number> = {
  colleague: 0xc4813a,
  client: 0xe8a54b,
  mentor: 0x6644aa,
  mentee: 0x4488ff,
  collaborator: 0x44aa88,
};

const plaqueMat = new THREE.MeshStandardMaterial({
  color: 0x3a2a1a,
  roughness: 0.4,
  metalness: 0.8,
});

const borderMat = new THREE.MeshStandardMaterial({
  color: 0x8b6914,
  roughness: 0.3,
  metalness: 0.9,
});

/**
 * TestimonialPlaque — A glowing metal plaque that displays a testimonial
 * when clicked. Glow color reflects the relationship type.
 */
export const TestimonialPlaque = memo(function TestimonialPlaque({
  testimonial,
  position,
  rotation,
}: {
  testimonial: Testimonial;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const hoverLerp = useRef(0);

  const glowColor = RELATIONSHIP_COLORS[testimonial.relationship] ?? 0xc4813a;

  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: glowColor,
        emissive: glowColor,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.3,
        roughness: 0.2,
        metalness: 0.5,
      }),
    [glowColor],
  );

  const detailData: DetailData = {
    type: 'testimonial',
    data: testimonial,
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const target = hovered ? 1 : 0;
    hoverLerp.current += (target - hoverLerp.current) * 0.1;
    const h = hoverLerp.current;

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.1 + h * 0.5;
      mat.opacity = 0.2 + h * 0.3;
    }

    if (lightRef.current) {
      lightRef.current.intensity = 0.15 + h * 0.4;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!useForgeStore.getState().isStarted) return;
    if (useForgeStore.getState().isTourActive) return;
    useForgeStore.getState().showDetailPanel(detailData);
  };

  return (
    <group position={position} rotation={rotation}>
      {/* Plaque body */}
      <mesh
        material={plaqueMat}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = '';
        }}
      >
        <boxGeometry args={[0.8, 0.5, 0.06]} />
      </mesh>

      {/* Border frame */}
      <mesh position={[0, 0, 0.035]} material={borderMat}>
        <boxGeometry args={[0.85, 0.55, 0.01]} />
      </mesh>
      <mesh position={[0, 0, 0.04]} material={plaqueMat}>
        <boxGeometry args={[0.75, 0.45, 0.01]} />
      </mesh>

      {/* Glow overlay */}
      <mesh ref={glowRef} position={[0, 0, 0.04]} material={glowMat}>
        <boxGeometry args={[0.78, 0.48, 0.005]} />
      </mesh>

      {/* Author initial — small embossed circle */}
      <mesh position={[0, -0.12, 0.05]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 8]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Ambient glow light */}
      <pointLight
        ref={lightRef}
        color={glowColor}
        intensity={0.15}
        distance={3}
        decay={2}
        position={[0, 0, 0.3]}
      />
    </group>
  );
});
