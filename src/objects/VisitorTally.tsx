'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

// ── Materials ───────────────────────────────────────────────
const stoneMat = new THREE.MeshStandardMaterial({
  color: 0x3a3028,
  roughness: 0.85,
  metalness: 0.3,
});

const stoneTopMat = new THREE.MeshStandardMaterial({
  color: 0x4a3d30,
  roughness: 0.8,
  metalness: 0.4,
});

const baseMat = new THREE.MeshStandardMaterial({
  color: 0x2a2018,
  roughness: 0.9,
  metalness: 0.2,
});

const glowMat = new THREE.MeshStandardMaterial({
  color: 0xc4813a,
  emissive: 0xe8a54b,
  emissiveIntensity: 0.4,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide,
});

const FADE_FAR = 25;
const FADE_NEAR = 12;

/**
 * VisitorTally — A small stone tablet in the Hearth zone showing
 * how many explorers have visited The Forge. Understated, carved
 * into stone aesthetic with a subtle ember glow.
 */
export const VisitorTally = memo(function VisitorTally() {
  const lightRef = useRef<THREE.PointLight>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visitorCount = useForgeStore((s) => s.visitorCount);
  const isStarted = useForgeStore((s) => s.isStarted);

  // Tally marks: group into sets of 5 (||||  ̶ )
  const tallyDisplay = useMemo(() => {
    if (visitorCount <= 0) return '';
    return visitorCount.toLocaleString();
  }, [visitorCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle pulsing glow
    if (lightRef.current) {
      lightRef.current.intensity = 0.15 + Math.sin(t * 1.5) * 0.08;
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 1.5) * 0.15;
      mat.opacity = 0.2 + Math.sin(t * 1.5) * 0.1;
    }

    // Distance-based fade for the HTML label
    const el = containerRef.current;
    if (!el) return;

    const { playerPosition } = useForgeStore.getState();
    const dx = playerPosition.x - 3;
    const dz = playerPosition.z - 3;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const opacity =
      dist >= FADE_FAR
        ? 0
        : dist <= FADE_NEAR
          ? 1
          : 1 - (dist - FADE_NEAR) / (FADE_FAR - FADE_NEAR);
    el.style.opacity = String(opacity);
  });

  if (!isStarted) return null;

  return (
    <group position={[3, 0, 3]}>
      {/* Stone base / pedestal */}
      <mesh position={[0, 0.2, 0]} material={baseMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.4, 6]} />
      </mesh>

      {/* Stone tablet (angled slab) */}
      <group position={[0, 0.7, 0]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Main slab */}
        <mesh material={stoneMat} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.7, 0.12]} />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, 0.38, 0]} material={stoneTopMat} castShadow>
          <boxGeometry args={[0.85, 0.06, 0.15]} />
        </mesh>
      </group>

      {/* Subtle glow ring at base */}
      <mesh
        ref={glowRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={glowMat}
      >
        <ringGeometry args={[0.3, 0.42, 16]} />
      </mesh>

      {/* Ambient glow light */}
      <pointLight
        ref={lightRef}
        color={0xe8a54b}
        intensity={0.15}
        distance={3}
        decay={2}
        position={[0, 0.8, 0.2]}
      />

      {/* HTML text overlay — carved inscription look */}
      <Html center position={[0, 0.7, 0]} style={{ pointerEvents: 'none' }}>
        <div
          ref={containerRef}
          style={{
            opacity: 0,
            textAlign: 'center',
            fontFamily: '"Cinzel", serif',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {visitorCount > 0 && (
            <>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#e8a54b',
                  textShadow: '0 0 12px rgba(232, 165, 75, 0.6), 0 0 24px rgba(196, 129, 58, 0.3)',
                  letterSpacing: '2px',
                }}
              >
                {tallyDisplay}
              </div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 400,
                  color: '#c4813a',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  marginTop: '2px',
                  opacity: 0.8,
                }}
              >
                Explorers
              </div>
            </>
          )}
        </div>
      </Html>
    </group>
  );
});
