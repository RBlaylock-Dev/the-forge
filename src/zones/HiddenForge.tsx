'use client';

import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZoneLabel } from '@/objects/ZoneLabel';

// ── Materials ───────────────────────────────────────────────

const deskMat = new THREE.MeshStandardMaterial({
  color: 0x2a1a0e,
  roughness: 0.7,
  metalness: 0.3,
});

const monitorMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.2,
  metalness: 0.8,
});

const screenMat = new THREE.MeshStandardMaterial({
  color: 0x0a1628,
  emissive: 0x1a3a5a,
  emissiveIntensity: 1.5,
  roughness: 0.1,
  metalness: 0.0,
});

const mugMat = new THREE.MeshStandardMaterial({
  color: 0xc4813a,
  emissive: 0xc4813a,
  emissiveIntensity: 0.1,
  roughness: 0.5,
  metalness: 0.2,
});

const coffeeMat = new THREE.MeshStandardMaterial({
  color: 0x3a2010,
  roughness: 0.3,
  metalness: 0.0,
});

const bookMats = [
  new THREE.MeshStandardMaterial({ color: 0x8b2020, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x204080, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x206040, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x604020, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x503070, roughness: 0.8 }),
  new THREE.MeshStandardMaterial({ color: 0x704020, roughness: 0.8 }),
];

const shelfMat = new THREE.MeshStandardMaterial({
  color: 0x3a2a1a,
  roughness: 0.7,
  metalness: 0.2,
});

const frameMat = new THREE.MeshStandardMaterial({
  color: 0x8b6914,
  emissive: 0xc4813a,
  emissiveIntensity: 0.2,
  roughness: 0.4,
  metalness: 0.6,
});

const photoMat = new THREE.MeshStandardMaterial({
  color: 0xd4b896,
  emissive: 0xe8a54b,
  emissiveIntensity: 0.15,
  roughness: 0.9,
  metalness: 0.0,
});

const headbandMat = new THREE.MeshStandardMaterial({
  color: 0x222222,
  roughness: 0.5,
  metalness: 0.6,
});

const earcupMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.4,
  metalness: 0.5,
});

const keyboardMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.3,
  metalness: 0.7,
});

const wallMat = new THREE.MeshStandardMaterial({
  color: 0x1a1210,
  roughness: 0.9,
  metalness: 0.1,
  transparent: true,
  opacity: 0.6,
});

const lanternMat = new THREE.MeshStandardMaterial({
  color: 0x8b6914,
  emissive: 0xe8a54b,
  emissiveIntensity: 0.8,
  roughness: 0.4,
  metalness: 0.5,
});

// ── "Code lines" on the screen ──────────────────────────────
function ScreenLines() {
  const linesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const t = clock.getElapsedTime();
    // Subtle scroll effect
    linesRef.current.position.y = Math.sin(t * 0.3) * 0.02;
  });

  const lines = useMemo(() => {
    const result: { width: number; y: number; x: number; color: number }[] = [];
    const lineColors = [0x44aa88, 0x6688cc, 0xcc8844, 0x88aa44, 0xaa6688, 0x4488aa];
    for (let i = 0; i < 8; i++) {
      const indent = (i % 3) * 0.04;
      result.push({
        width: 0.08 + Math.random() * 0.12,
        y: 0.12 - i * 0.03,
        x: -0.08 + indent,
        color: lineColors[i % lineColors.length],
      });
    }
    return result;
  }, []);

  return (
    <group ref={linesRef} position={[0, 0, 0.026]}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, 0]}>
          <boxGeometry args={[line.width, 0.012, 0.001]} />
          <meshStandardMaterial
            color={line.color}
            emissive={line.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * HiddenForge — Robert's personal workshop. A secret zone
 * discovered by exploring off the beaten path. Contains a
 * workbench, monitor, coffee mug, headphones, bookshelf,
 * and photo frame.
 */
export const HiddenForge = memo(function HiddenForge() {
  const screenRef = useRef<THREE.Mesh>(null);
  const lanternRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Screen flicker
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + Math.sin(t * 8) * 0.1;
    }

    // Lantern flicker
    if (lanternRef.current) {
      const mat = lanternRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.7 + Math.sin(t * 3) * 0.15 + Math.sin(t * 7) * 0.05;
    }
  });

  return (
    <group position={[-14, 0, -14]}>
      {/* Zone label — only visible when close */}
      <ZoneLabel
        title="The Workshop"
        subtitle="A secret workspace"
        position={[0, 4.5, 0]}
        worldPosition={[-14, 4.5, -14]}
      />

      {/* ── Low walls (partial enclosure) ───────────────────── */}
      <mesh position={[0, 1.2, -3]} material={wallMat}>
        <boxGeometry args={[6, 2.4, 0.15]} />
      </mesh>
      <mesh position={[-3, 1.2, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMat}>
        <boxGeometry args={[6, 2.4, 0.15]} />
      </mesh>

      {/* ── Workbench / Desk ───────────────────────────────── */}
      <group position={[0, 0, -2.2]}>
        {/* Desktop surface */}
        <mesh position={[0, 0.85, 0]} material={deskMat}>
          <boxGeometry args={[2.2, 0.08, 0.9]} />
        </mesh>
        {/* Legs */}
        <mesh position={[-1, 0.42, -0.35]} material={deskMat}>
          <boxGeometry args={[0.08, 0.84, 0.08]} />
        </mesh>
        <mesh position={[1, 0.42, -0.35]} material={deskMat}>
          <boxGeometry args={[0.08, 0.84, 0.08]} />
        </mesh>
        <mesh position={[-1, 0.42, 0.35]} material={deskMat}>
          <boxGeometry args={[0.08, 0.84, 0.08]} />
        </mesh>
        <mesh position={[1, 0.42, 0.35]} material={deskMat}>
          <boxGeometry args={[0.08, 0.84, 0.08]} />
        </mesh>

        {/* ── Monitor ──────────────────────────────────────── */}
        <group position={[0, 1.35, -0.15]}>
          {/* Monitor body */}
          <mesh material={monitorMat}>
            <boxGeometry args={[0.7, 0.45, 0.04]} />
          </mesh>
          {/* Screen */}
          <mesh ref={screenRef} position={[0, 0, 0.025]} material={screenMat}>
            <boxGeometry args={[0.62, 0.37, 0.005]} />
          </mesh>
          {/* Code lines on screen */}
          <ScreenLines />
          {/* Monitor stand */}
          <mesh position={[0, -0.28, 0]} material={monitorMat}>
            <boxGeometry args={[0.06, 0.12, 0.06]} />
          </mesh>
          {/* Monitor base */}
          <mesh position={[0, -0.35, 0.02]} material={monitorMat}>
            <boxGeometry args={[0.25, 0.02, 0.15]} />
          </mesh>
        </group>

        {/* ── Keyboard ─────────────────────────────────────── */}
        <mesh position={[0, 0.91, 0.15]} material={keyboardMat}>
          <boxGeometry args={[0.45, 0.015, 0.15]} />
        </mesh>

        {/* ── Coffee Mug ───────────────────────────────────── */}
        <group position={[0.7, 0.97, 0.1]}>
          {/* Mug body */}
          <mesh material={mugMat}>
            <cylinderGeometry args={[0.04, 0.035, 0.1, 8]} />
          </mesh>
          {/* Coffee surface */}
          <mesh position={[0, 0.04, 0]} material={coffeeMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.005, 8]} />
          </mesh>
          {/* Handle */}
          <mesh position={[0.05, 0, 0]} material={mugMat}>
            <torusGeometry args={[0.025, 0.006, 6, 8, Math.PI]} />
          </mesh>
        </group>

        {/* ── Headphones ───────────────────────────────────── */}
        <group position={[-0.75, 0.93, 0.1]} rotation={[0.15, 0.3, 0.1]}>
          {/* Headband */}
          <mesh material={headbandMat} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.08, 0.008, 6, 12, Math.PI]} />
          </mesh>
          {/* Left earcup */}
          <mesh position={[0, -0.08, 0]} material={earcupMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.025, 8]} />
          </mesh>
          {/* Right earcup */}
          <mesh position={[0, 0.08, 0]} material={earcupMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.025, 8]} />
          </mesh>
        </group>
      </group>

      {/* ── Bookshelf ──────────────────────────────────────── */}
      <group position={[-2.5, 0, -1]}>
        {/* Shelf frame */}
        <mesh position={[0, 0.9, 0]} material={shelfMat}>
          <boxGeometry args={[0.8, 1.8, 0.3]} />
        </mesh>

        {/* Books — stacked vertically on shelves */}
        {bookMats.map((mat, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const bookWidth = 0.06 + Math.random() * 0.03;
          return (
            <mesh key={i} position={[-0.2 + col * 0.2, 0.45 + row * 0.7, 0.05]} material={mat}>
              <boxGeometry args={[bookWidth, 0.28, 0.2]} />
            </mesh>
          );
        })}
      </group>

      {/* ── Photo Frame ────────────────────────────────────── */}
      <group position={[0.5, 1.6, -2.85]} rotation={[0.1, 0, 0]}>
        {/* Frame border */}
        <mesh material={frameMat}>
          <boxGeometry args={[0.25, 0.2, 0.02]} />
        </mesh>
        {/* Photo inside */}
        <mesh position={[0, 0, 0.012]} material={photoMat}>
          <boxGeometry args={[0.2, 0.15, 0.002]} />
        </mesh>
      </group>

      {/* ── Lantern ────────────────────────────────────────── */}
      <group position={[1.5, 0, -1]}>
        {/* Lantern post */}
        <mesh position={[0, 0.6, 0]} material={shelfMat}>
          <cylinderGeometry args={[0.03, 0.04, 1.2, 6]} />
        </mesh>
        {/* Lantern body */}
        <mesh ref={lanternRef} position={[0, 1.25, 0]} material={lanternMat}>
          <octahedronGeometry args={[0.12, 0]} />
        </mesh>
        {/* Lantern glow */}
        <pointLight
          color={0xe8a54b}
          intensity={0.8}
          distance={5}
          decay={2}
          position={[0, 1.3, 0]}
        />
      </group>

      {/* ── Zone ambient light ─────────────────────────────── */}
      <pointLight color={0xff6600} intensity={1.5} distance={12} decay={2} position={[0, 4, 0]} />

      {/* Screen glow cast */}
      <pointLight color={0x3366aa} intensity={0.3} distance={3} decay={2} position={[0, 1.5, -2]} />
    </group>
  );
});
