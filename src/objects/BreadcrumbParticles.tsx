'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import { isMobile } from '@/utils/mobile';
import type { ZoneId } from '@/types';

// Zones that get breadcrumb trails (not Hearth — it's the origin)
const TRAIL_ZONES: ZoneId[] = ['skill-tree', 'vault', 'timeline', 'war-room'];

function createEmberTexture(): THREE.Texture {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

const PARTICLES_PER_TRAIL = 25;
const FULL_COUNT = TRAIL_ZONES.length * PARTICLES_PER_TRAIL;
const PARTICLE_Y_MIN = 0.05;
const PARTICLE_Y_MAX = 0.6;
const TRAIL_SPEED = 0.4;
const DRIFT = 0.8; // lateral spread around the path line
const BRIGHT_OPACITY = 0.6;
const DIM_OPACITY = 0.0; // fully hidden when visited

interface TrailParticle {
  progress: number; // 0–1 along the Hearth→Zone vector
  speed: number;
  offsetX: number; // perpendicular drift
  offsetZ: number;
  baseY: number;
}

/**
 * BreadcrumbParticles — faint ember trails flowing from the Hearth
 * toward unvisited zones. The nearest unvisited zone gets the
 * brightest trail; visited zone trails disappear.
 */
export function BreadcrumbParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const count = useMemo(() => isMobile() ? Math.floor(FULL_COUNT / 2) : FULL_COUNT, []);
  const emberTexture = useMemo(() => createEmberTexture(), []);
  const perTrail = useMemo(() => Math.floor(count / TRAIL_ZONES.length), [count]);

  // Pre-compute trail directions (Hearth center → zone center)
  const trails = useMemo(() =>
    TRAIL_ZONES.map((id) => {
      const def = ZONE_DEFS[id];
      const dx = def.center.x;
      const dz = def.center.z;
      const len = Math.sqrt(dx * dx + dz * dz);
      return {
        id,
        dirX: dx / len,
        dirZ: dz / len,
        length: len,
        // Perpendicular vector for drift
        perpX: -dz / len,
        perpZ: dx / len,
      };
    }),
  []);

  // Initialize particle data
  const particles = useMemo(() => {
    const arr: TrailParticle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        progress: Math.random(),
        speed: TRAIL_SPEED + Math.random() * 0.2,
        offsetX: (Math.random() - 0.5) * DRIFT,
        offsetZ: (Math.random() - 0.5) * DRIFT,
        baseY: PARTICLE_Y_MIN + Math.random() * (PARTICLE_Y_MAX - PARTICLE_Y_MIN),
      });
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    // Warm amber default
    for (let i = 0; i < count; i++) {
      c[i * 3] = 1.0;
      c[i * 3 + 1] = 0.55;
      c[i * 3 + 2] = 0.1;
    }
    return c;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const { discoveredZones, isStarted, playerPosition } = useForgeStore.getState();
    if (!isStarted) return;

    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = pointsRef.current.geometry.getAttribute('color') as THREE.BufferAttribute;

    // Find nearest unvisited zone
    let nearestUnvisited: ZoneId | null = null;
    let nearestDist = Infinity;
    for (const id of TRAIL_ZONES) {
      if (discoveredZones.has(id)) continue;
      const def = ZONE_DEFS[id];
      const dx = def.center.x - playerPosition.x;
      const dz = def.center.z - playerPosition.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestUnvisited = id;
      }
    }

    const dt = Math.min(delta, 0.05);

    for (let t = 0; t < trails.length; t++) {
      const trail = trails[t];
      const isVisited = discoveredZones.has(trail.id);
      const isNearest = trail.id === nearestUnvisited;
      const opacity = isVisited ? DIM_OPACITY : isNearest ? BRIGHT_OPACITY : BRIGHT_OPACITY * 0.4;

      for (let p = 0; p < perTrail; p++) {
        const idx = t * perTrail + p;
        if (idx >= count) break;
        const particle = particles[idx];

        // Advance particle along trail
        particle.progress += particle.speed * dt * 0.15;
        if (particle.progress > 1) {
          particle.progress = 0;
          particle.offsetX = (Math.random() - 0.5) * DRIFT;
          particle.offsetZ = (Math.random() - 0.5) * DRIFT;
          particle.baseY = PARTICLE_Y_MIN + Math.random() * (PARTICLE_Y_MAX - PARTICLE_Y_MIN);
        }

        const prog = particle.progress;
        // Position along trail line + perpendicular drift
        const x = trail.dirX * prog * trail.length + trail.perpX * particle.offsetX;
        const z = trail.dirZ * prog * trail.length + trail.perpZ * particle.offsetZ;
        // Fade Y up at edges, peak in middle
        const y = particle.baseY + Math.sin(prog * Math.PI) * 0.3;

        posAttr.setXYZ(idx, x, y, z);

        // Color: bright amber for nearest, dimmer for others, hidden for visited
        // Fade at start and end of trail
        const edgeFade = Math.sin(prog * Math.PI);
        const alpha = opacity * edgeFade;

        colorAttr.setXYZ(idx,
          1.0 * alpha,
          (isNearest ? 0.6 : 0.4) * alpha,
          0.1 * alpha,
        );
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={emberTexture}
        transparent
        opacity={0.9}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
