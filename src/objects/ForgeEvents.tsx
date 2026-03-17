'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundscape } from '@/audio/soundscape';
import { useForgeStore } from '@/store/useForgeStore';

// ── Config ──────────────────────────────────────────────
const MIN_INTERVAL = 60; // seconds
const MAX_INTERVAL = 90;
const SHOOTING_STAR_DURATION = 1.5; // seconds
const FLARE_DURATION = 3; // seconds
const EMBER_SHAPE_DURATION = 4; // seconds

const HAMMER_SOUND = '/audio/dragon-studio-ancient-mechanical-gears-487670.mp3';
const FLARE_SOUND = '/audio/fire-whoosh.mp3';

type ForgeEventType = 'shooting-star' | 'forge-flare' | 'hammer-sound' | 'ember-shape';

const EVENT_TYPES: ForgeEventType[] = [
  'shooting-star',
  'forge-flare',
  'hammer-sound',
  'ember-shape',
];

// ── Ember shape patterns (normalized -1..1 coordinates) ─
const SHAPES: Record<string, [number, number][]> = {
  heart: [
    [0, 0.6], [-0.1, 0.8], [-0.3, 0.9], [-0.5, 0.8], [-0.6, 0.5],
    [-0.5, 0.2], [-0.3, -0.1], [0, -0.5],
    [0.3, -0.1], [0.5, 0.2], [0.6, 0.5], [0.5, 0.8], [0.3, 0.9], [0.1, 0.8],
  ],
  star: [
    [0, 1], [0.2, 0.3], [0.95, 0.3], [0.35, -0.1], [0.6, -0.8],
    [0, -0.35], [-0.6, -0.8], [-0.35, -0.1], [-0.95, 0.3], [-0.2, 0.3],
  ],
  diamond: [
    [0, 1], [0.5, 0], [0, -1], [-0.5, 0],
    [0.25, 0.5], [0.25, -0.5], [-0.25, -0.5], [-0.25, 0.5],
  ],
};

const SHAPE_NAMES = Object.keys(SHAPES);

// ── Shooting Star ───────────────────────────────────────
function ShootingStar({ onComplete }: { onComplete: () => void }) {
  const trailRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  // Random trajectory across the sky
  const trajectory = useMemo(() => {
    const startX = (Math.random() - 0.5) * 60;
    const startZ = (Math.random() - 0.5) * 60;
    const endX = startX + (Math.random() - 0.5) * 40;
    const endZ = startZ + (Math.random() - 0.5) * 40;
    return {
      start: new THREE.Vector3(startX, 20 + Math.random() * 10, startZ),
      end: new THREE.Vector3(endX, 12 + Math.random() * 5, endZ),
    };
  }, []);

  const TRAIL_COUNT = 20;
  const positions = useMemo(() => new Float32Array(TRAIL_COUNT * 3), []);
  const sizes = useMemo(() => {
    const s = new Float32Array(TRAIL_COUNT);
    for (let i = 0; i < TRAIL_COUNT; i++) {
      s[i] = 0.15 * (1 - i / TRAIL_COUNT);
    }
    return s;
  }, []);

  useFrame((_, delta) => {
    if (!trailRef.current || completedRef.current) return;

    progressRef.current += delta / SHOOTING_STAR_DURATION;
    if (progressRef.current >= 1) {
      completedRef.current = true;
      onComplete();
      return;
    }

    const pos = trailRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const t = progressRef.current;

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const trailT = Math.max(0, t - i * 0.02);
      const x = THREE.MathUtils.lerp(trajectory.start.x, trajectory.end.x, trailT);
      const y = THREE.MathUtils.lerp(trajectory.start.y, trajectory.end.y, trailT);
      const z = THREE.MathUtils.lerp(trajectory.start.z, trajectory.end.z, trailT);
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    // Fade out material near end
    const mat = trailRef.current.material as THREE.PointsMaterial;
    mat.opacity = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
  });

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={TRAIL_COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={sizes} count={TRAIL_COUNT} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        color={0xffffff}
        size={0.15}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Forge Flare ─────────────────────────────────────────
function ForgeFlare({ onComplete }: { onComplete: () => void }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  const SPARK_COUNT = 60;
  const { sparkPositions, sparkVelocities } = useMemo(() => {
    const pos = new Float32Array(SPARK_COUNT * 3);
    const vel = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i++) {
      // Start at hearth forge position
      pos[i * 3] = -3 + (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = 1 + Math.random();
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      // Random upward velocity
      vel[i * 3] = (Math.random() - 0.5) * 4;
      vel[i * 3 + 1] = 3 + Math.random() * 5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return { sparkPositions: pos, sparkVelocities: vel };
  }, []);

  useEffect(() => {
    soundscape.playOneShot(FLARE_SOUND, 0.4);
  }, []);

  useFrame((_, delta) => {
    if (completedRef.current) return;

    progressRef.current += delta / FLARE_DURATION;
    if (progressRef.current >= 1) {
      completedRef.current = true;
      onComplete();
      return;
    }

    const t = progressRef.current;

    // Flare light intensity: ramp up fast, then decay
    if (lightRef.current) {
      const intensity = t < 0.15 ? t / 0.15 * 8 : 8 * Math.pow(1 - (t - 0.15) / 0.85, 2);
      lightRef.current.intensity = intensity;
    }

    // Move sparks outward with gravity
    if (sparksRef.current) {
      const pos = sparksRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < SPARK_COUNT; i++) {
        const x = pos.getX(i) + sparkVelocities[i * 3] * delta;
        const y = pos.getY(i) + sparkVelocities[i * 3 + 1] * delta;
        const z = pos.getZ(i) + sparkVelocities[i * 3 + 2] * delta;
        pos.setXYZ(i, x, y, z);
        // Apply gravity
        sparkVelocities[i * 3 + 1] -= 5 * delta;
      }
      pos.needsUpdate = true;

      const mat = sparksRef.current.material as THREE.PointsMaterial;
      mat.opacity = t > 0.6 ? 1 - (t - 0.6) / 0.4 : 1;
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        color={0xff6b1a}
        intensity={0}
        distance={20}
        decay={2}
        position={[-3, 3, 0]}
      />
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={sparkPositions}
            count={SPARK_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0xff8833}
          size={0.08}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

// ── Ember Shape ─────────────────────────────────────────
function EmberShape({ onComplete }: { onComplete: () => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  const { shapeTargets, initialPositions, count } = useMemo(() => {
    const shapeName = SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)];
    const shape = SHAPES[shapeName];
    const c = shape.length;
    const targets = new Float32Array(c * 3);
    const initial = new Float32Array(c * 3);

    // Place shape above the hearth
    for (let i = 0; i < c; i++) {
      targets[i * 3] = shape[i][0] * 2;      // x: scale up
      targets[i * 3 + 1] = 5 + shape[i][1] * 2; // y: floating above hearth
      targets[i * 3 + 2] = 0;                // z: flat facing camera

      // Start from scattered positions
      initial[i * 3] = (Math.random() - 0.5) * 8;
      initial[i * 3 + 1] = 2 + Math.random() * 4;
      initial[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return { shapeTargets: targets, initialPositions: initial, count: c };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || completedRef.current) return;

    progressRef.current += delta / EMBER_SHAPE_DURATION;
    if (progressRef.current >= 1) {
      completedRef.current = true;
      onComplete();
      return;
    }

    const t = progressRef.current;
    const pos = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;

    // Phase 1 (0-0.4): converge to shape
    // Phase 2 (0.4-0.7): hold shape
    // Phase 3 (0.7-1.0): dissolve upward
    for (let i = 0; i < count; i++) {
      if (t < 0.4) {
        const lerp = t / 0.4;
        const eased = lerp * lerp * (3 - 2 * lerp); // smoothstep
        const x = THREE.MathUtils.lerp(initialPositions[i * 3], shapeTargets[i * 3], eased);
        const y = THREE.MathUtils.lerp(initialPositions[i * 3 + 1], shapeTargets[i * 3 + 1], eased);
        const z = THREE.MathUtils.lerp(initialPositions[i * 3 + 2], shapeTargets[i * 3 + 2], eased);
        pos.setXYZ(i, x, y, z);
      } else if (t < 0.7) {
        // Hold with subtle float
        const floatOffset = Math.sin(t * 10 + i) * 0.05;
        pos.setXYZ(
          i,
          shapeTargets[i * 3] + floatOffset,
          shapeTargets[i * 3 + 1] + floatOffset,
          shapeTargets[i * 3 + 2],
        );
      } else {
        // Dissolve upward
        const dissolve = (t - 0.7) / 0.3;
        pos.setXYZ(
          i,
          shapeTargets[i * 3] + (Math.random() - 0.5) * dissolve * 3,
          shapeTargets[i * 3 + 1] + dissolve * 4,
          shapeTargets[i * 3 + 2] + (Math.random() - 0.5) * dissolve * 3,
        );
      }
    }
    pos.needsUpdate = true;

    // Opacity
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    if (t < 0.1) mat.opacity = t / 0.1;
    else if (t > 0.7) mat.opacity = 1 - (t - 0.7) / 0.3;
    else mat.opacity = 1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={initialPositions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xff6b1a}
        size={0.2}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Main ForgeEvents Controller ─────────────────────────
export function ForgeEvents() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const [activeEvent, setActiveEvent] = useState<ForgeEventType | null>(null);
  const nextEventTime = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const scheduleNext = useCallback(() => {
    const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
    nextEventTime.current = performance.now() / 1000 + delay;
  }, []);

  // Schedule first event after game starts
  useEffect(() => {
    if (isStarted) scheduleNext();
  }, [isStarted, scheduleNext]);

  const handleComplete = useCallback(() => {
    setActiveEvent(null);
    scheduleNext();
  }, [scheduleNext]);

  // Check timer each frame
  useFrame(() => {
    if (!isStarted || activeEvent || reducedMotion) return;
    if (nextEventTime.current === 0) return;

    const now = performance.now() / 1000;
    if (now >= nextEventTime.current) {
      const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

      if (eventType === 'hammer-sound') {
        // Audio-only event — play sound then schedule next
        soundscape.playOneShot(HAMMER_SOUND, 0.25);
        scheduleNext();
      } else {
        setActiveEvent(eventType);
      }
    }
  });

  if (!isStarted || reducedMotion) return null;

  return (
    <>
      {activeEvent === 'shooting-star' && <ShootingStar onComplete={handleComplete} />}
      {activeEvent === 'forge-flare' && <ForgeFlare onComplete={handleComplete} />}
      {activeEvent === 'ember-shape' && <EmberShape onComplete={handleComplete} />}
    </>
  );
}
