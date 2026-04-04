'use client';

import { memo, useRef, useMemo, useState } from 'react';
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

// ── Scroll Ember Particles ──────────────────────────────────
const EMBER_COUNT = 20;

function ScrollEmbers() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(EMBER_COUNT * 3);
    const vel = new Float32Array(EMBER_COUNT * 3);
    for (let i = 0; i < EMBER_COUNT; i++) {
      // Start around scroll edges
      pos[i * 3] = (Math.random() - 0.5) * 0.7;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      // Drift upward and outward
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = Math.random() * 0.008 + 0.004;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const emberTexture = useMemo(() => {
    const size = 16;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < EMBER_COUNT; i++) {
      let x = posAttr.getX(i) + velocities[i * 3];
      let y = posAttr.getY(i) + velocities[i * 3 + 1];
      let z = posAttr.getZ(i) + velocities[i * 3 + 2];

      // Reset when drifted too far
      if (y > 1.2) {
        x = (Math.random() - 0.5) * 0.7;
        y = (Math.random() - 0.5) * 0.9;
        z = (Math.random() - 0.5) * 0.2;
      }

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={emberTexture}
        color={0xe8a54b}
        size={0.04}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * ResumeScroll — A glowing parchment scroll on a display stand with
 * ember particles and proximity unroll animation.
 * Positioned in the Hearth zone. Clicking opens the resume preview.
 */
export const ResumeScroll = memo(function ResumeScroll() {
  const scrollRef = useRef<THREE.Group>(null);
  const sealRef = useRef<THREE.Mesh>(null);
  const topRodRef = useRef<THREE.Mesh>(null);
  const openResume = useForgeStore((s) => s.openResume);
  const [hovered, setHovered] = useState(false);
  const hoverLerp = useRef(0);

  // Parchment body geometry
  const parchmentGeo = useMemo(() => new THREE.BoxGeometry(0.6, 0.8, 0.08), []);
  const rodGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.75, 8), []);
  const sealGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 0.03, 12), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Smooth hover lerp for unroll effect
    const target = hovered ? 1 : 0;
    hoverLerp.current += (target - hoverLerp.current) * 0.08;
    const h = hoverLerp.current;

    // Gentle hover bob
    if (scrollRef.current) {
      scrollRef.current.position.y = 1.3 + Math.sin(t * 1.5) * 0.04;
      scrollRef.current.rotation.y = Math.sin(t * 0.5) * 0.08;
    }

    // Top rod slides up on hover (unroll preview)
    if (topRodRef.current) {
      topRodRef.current.position.y = 0.42 + h * 0.12;
    }

    // Parchment stretches slightly on hover
    if (scrollRef.current) {
      const parchment = scrollRef.current.children[0] as THREE.Mesh;
      if (parchment) {
        parchment.scale.y = 1 + h * 0.15;
        parchment.position.y = h * 0.06;
      }
    }

    // Seal pulse — brighter on hover
    if (sealRef.current) {
      const mat = sealRef.current.material as THREE.MeshStandardMaterial;
      const base = 0.4 + Math.sin(t * 2) * 0.2;
      mat.emissiveIntensity = base + h * 0.4;
    }

    // Parchment glows brighter on hover
    parchmentMat.emissiveIntensity = 0.3 + h * 0.2;
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
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = '';
          }}
        />

        {/* Top rod — moves up on hover for unroll effect */}
        <mesh
          ref={topRodRef}
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

        {/* Ember particles trailing from scroll edges */}
        <ScrollEmbers />
      </group>

      {/* Ambient glow light — brighter area on hover handled by emissive */}
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
