'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';
import { useChatStore } from '@/store/useChatStore';

const SPIRIT_POS: [number, number, number] = [1, 1.5, 1];
const FLOAT_AMP = 0.15;
const FLOAT_SPEED = 0.33; // ~3s cycle
const PARTICLE_COUNT = 24;
const PROMPT_DISTANCE = 4; // Show "Talk to the Forge Spirit" within this range

/**
 * ForgeSpirit — a glowing ember orb that floats near the Hearth.
 * Clicking opens the AI chat panel.
 */
export function ForgeSpirit() {
  const orbRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const [near, setNear] = useState(false);
  const nearRef = useRef(false);

  const isOpen = useChatStore((s) => s.isOpen);
  const openChat = useChatStore((s) => s.openChat);

  // Particle positions (trail around orb)
  const particleGeo = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.4;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      scales[i] = 0.5 + Math.random() * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, []);

  const orbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffaa44,
        emissive: 0xff6600,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
      }),
    [],
  );

  const particleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xff8833,
        size: 0.06,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const h = hovered ? 1 : 0;
    const active = isOpen ? 1 : 0;

    // Proximity prompt — only re-render when crossing the threshold
    const { playerPosition } = useForgeStore.getState();
    const dx = playerPosition.x - SPIRIT_POS[0];
    const dz = playerPosition.z - SPIRIT_POS[2];
    const isNear = dx * dx + dz * dz < PROMPT_DISTANCE * PROMPT_DISTANCE;
    if (isNear !== nearRef.current) {
      nearRef.current = isNear;
      setNear(isNear);
    }

    // Float animation
    if (orbRef.current) {
      orbRef.current.position.y =
        SPIRIT_POS[1] + Math.sin(t * Math.PI * 2 * FLOAT_SPEED) * FLOAT_AMP;
    }

    // Inner core follows same float
    if (coreRef.current) {
      coreRef.current.position.y =
        SPIRIT_POS[1] + Math.sin(t * Math.PI * 2 * FLOAT_SPEED) * FLOAT_AMP;
    }

    // Orb glow intensity
    orbMat.emissiveIntensity = 1.5 + h * 0.8 + active * 0.5 + Math.sin(t * 3) * 0.3;
    orbMat.opacity = 0.85 + h * 0.1;

    // Particle rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.5;
      particlesRef.current.position.y =
        SPIRIT_POS[1] + Math.sin(t * Math.PI * 2 * FLOAT_SPEED) * FLOAT_AMP;
    }

    // Light intensity
    if (glowRef.current) {
      glowRef.current.position.y =
        SPIRIT_POS[1] + Math.sin(t * Math.PI * 2 * FLOAT_SPEED) * FLOAT_AMP;
      glowRef.current.intensity = 2 + h * 1 + active * 0.5 + Math.sin(t * 2) * 0.5;
    }
  });

  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!isStarted || isTourActive) return;
    openChat();
  };

  const showPrompt = (near || hovered) && !isOpen && isStarted && !isTourActive;

  return (
    <group position={[SPIRIT_POS[0], 0, SPIRIT_POS[2]]}>
      {/* Main ember orb */}
      <Billboard>
        <mesh
          ref={orbRef}
          position={[0, SPIRIT_POS[1], 0]}
          material={orbMat}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[0.35, 16, 16]} />
        </mesh>
      </Billboard>

      {/* Inner bright core */}
      <Billboard>
        <mesh ref={coreRef} position={[0, SPIRIT_POS[1], 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial
            color={0xffeedd}
            emissive={0xffcc88}
            emissiveIntensity={3}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Billboard>

      {/* Proximity prompt */}
      {showPrompt && (
        <Html center position={[0, SPIRIT_POS[1] + 0.75, 0]} zIndexRange={[20, 0]}>
          <button
            onClick={openChat}
            className="font-rajdhani"
            style={{
              whiteSpace: 'nowrap',
              padding: '5px 12px',
              borderRadius: 999,
              border: '1px solid rgba(232, 165, 75, 0.6)',
              background: 'rgba(10, 8, 6, 0.85)',
              color: '#f5deb3',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(255, 136, 51, 0.35)',
            }}
          >
            Talk to the Forge Spirit
          </button>
        </Html>
      )}

      {/* Orbiting particles */}
      <points ref={particlesRef} geometry={particleGeo} material={particleMat} />

      {/* Glow light */}
      <pointLight
        ref={glowRef}
        position={[0, SPIRIT_POS[1], 0]}
        color={0xff8833}
        intensity={2}
        distance={6}
        decay={2}
      />
    </group>
  );
}
