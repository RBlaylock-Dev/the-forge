'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import type { ZoneId } from '@/types';

const WALK_SPEED = 6;
const ARRIVE_THRESHOLD = 0.5;
const FLY_DURATION = 1.5;
const BOUND = 45;
const PLAYER_Y = 1.7;

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const ZONE_ENTRIES = Object.entries(ZONE_DEFS) as [ZoneId, (typeof ZONE_DEFS)[ZoneId]][];

interface FlyState {
  from: THREE.Vector3;
  to: THREE.Vector3;
  fromYaw: number;
  toYaw: number;
  elapsed: number;
}

/**
 * Click-to-walk + double-click fly-to-zone.
 * Works when the cursor is visible (not pointer-locked).
 * Keyboard input cancels any active walk target.
 */
export function useClickToWalk(
  yawRef: React.MutableRefObject<number>,
  pitchRef: React.MutableRefObject<number>,
) {
  const { camera, gl } = useThree();
  const walkTarget = useRef<THREE.Vector3 | null>(null);
  const flyState = useRef<FlyState | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouseVec = useRef(new THREE.Vector2());
  const intersectPt = useRef(new THREE.Vector3());

  const updatePlayerPosition = useForgeStore((s) => s.updatePlayerPosition);
  const updatePlayerRotation = useForgeStore((s) => s.updatePlayerRotation);

  // ── Helpers ─────────────────────────────────────────────
  const screenToGround = useCallback(
    (clientX: number, clientY: number): THREE.Vector3 | null => {
      const rect = gl.domElement.getBoundingClientRect();
      mouseVec.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouseVec.current, camera);
      const hit = raycaster.current.ray.intersectPlane(GROUND_PLANE, intersectPt.current);
      if (!hit) return null;

      hit.x = Math.max(-BOUND, Math.min(BOUND, hit.x));
      hit.z = Math.max(-BOUND, Math.min(BOUND, hit.z));
      return hit;
    },
    [camera, gl],
  );

  const findZoneNear = useCallback((x: number, z: number): [ZoneId, (typeof ZONE_DEFS)[ZoneId]] | null => {
    for (const entry of ZONE_ENTRIES) {
      const [, def] = entry;
      const dx = x - def.center.x;
      const dz = z - def.center.z;
      if (Math.sqrt(dx * dx + dz * dz) < def.radius) return entry;
    }
    return null;
  }, []);

  const yawToward = useCallback((fromX: number, fromZ: number, toX: number, toZ: number): number => {
    return Math.atan2(-(toX - fromX), -(toZ - fromZ));
  }, []);

  // ── Click handlers ──────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;

    const onClick = (e: MouseEvent) => {
      if (document.pointerLockElement) return;
      if (!useForgeStore.getState().isStarted) return;
      if (useForgeStore.getState().showDetail) return;
      if (flyState.current) return;

      const pt = screenToGround(e.clientX, e.clientY);
      if (!pt) return;

      walkTarget.current = pt.clone();
      flyState.current = null;
    };

    const onDblClick = (e: MouseEvent) => {
      if (document.pointerLockElement) return;
      if (!useForgeStore.getState().isStarted) return;

      const pt = screenToGround(e.clientX, e.clientY);
      if (!pt) return;

      const zone = findZoneNear(pt.x, pt.z);
      if (!zone) return;

      const [, def] = zone;
      const toX = def.center.x;
      const toZ = def.center.z + 3;
      const toYaw = yawToward(toX, toZ, def.center.x, def.center.z);

      flyState.current = {
        from: camera.position.clone(),
        to: new THREE.Vector3(toX, PLAYER_Y, toZ),
        fromYaw: yawRef.current,
        toYaw,
        elapsed: 0,
      };
      walkTarget.current = null;

      e.preventDefault();
      e.stopPropagation();
    };

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('dblclick', onDblClick);
    return () => {
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('dblclick', onDblClick);
    };
  }, [camera, gl, screenToGround, findZoneNear, yawToward, yawRef]);

  // ── Per-frame update ────────────────────────────────────
  const update = useCallback(
    (delta: number, keysActive: boolean): boolean => {
      // ── Fly animation ───────────────────────────────────
      if (flyState.current) {
        const fly = flyState.current;
        fly.elapsed += delta;
        const t = Math.min(fly.elapsed / FLY_DURATION, 1);

        // Cubic ease in-out
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.lerpVectors(fly.from, fly.to, ease);
        // Arc up slightly during fly
        camera.position.y = PLAYER_Y + Math.sin(t * Math.PI) * 2;

        // Shortest-path yaw interpolation
        let yawDiff = fly.toYaw - fly.fromYaw;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        const newYaw = fly.fromYaw + yawDiff * ease;

        yawRef.current = newYaw;
        pitchRef.current = -0.15 * Math.sin(t * Math.PI); // Slight look-down

        camera.rotation.order = 'YXZ';
        camera.rotation.y = newYaw;
        camera.rotation.x = pitchRef.current;

        updatePlayerPosition(camera.position.x, camera.position.y, camera.position.z);
        updatePlayerRotation(newYaw, pitchRef.current);

        if (t >= 1) {
          flyState.current = null;
          pitchRef.current = 0;
          camera.rotation.x = 0;
          camera.position.y = PLAYER_Y;
        }

        return true; // Signal: click-to-walk is active
      }

      // ── Walk-to-target ──────────────────────────────────
      if (walkTarget.current && !keysActive) {
        const target = walkTarget.current;
        const dx = target.x - camera.position.x;
        const dz = target.z - camera.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < ARRIVE_THRESHOLD) {
          walkTarget.current = null;
          return false;
        }

        // Move toward target
        const step = Math.min(WALK_SPEED * delta, dist);
        const dirX = dx / dist;
        const dirZ = dz / dist;

        camera.position.x += dirX * step;
        camera.position.z += dirZ * step;
        camera.position.y = PLAYER_Y;

        // World bounds
        camera.position.x = Math.max(-BOUND, Math.min(BOUND, camera.position.x));
        camera.position.z = Math.max(-BOUND, Math.min(BOUND, camera.position.z));

        // Auto-rotate yaw toward target (smooth)
        const targetYaw = yawToward(camera.position.x, camera.position.z, target.x, target.z);
        let yd = targetYaw - yawRef.current;
        while (yd > Math.PI) yd -= Math.PI * 2;
        while (yd < -Math.PI) yd += Math.PI * 2;
        yawRef.current += yd * Math.min(1, 5 * delta);

        camera.rotation.order = 'YXZ';
        camera.rotation.y = yawRef.current;
        camera.rotation.x = pitchRef.current;

        updatePlayerPosition(camera.position.x, PLAYER_Y, camera.position.z);
        updatePlayerRotation(yawRef.current, pitchRef.current);

        return true;
      }

      // Keyboard cancels walk
      if (keysActive && walkTarget.current) {
        walkTarget.current = null;
      }

      return false;
    },
    [camera, updatePlayerPosition, updatePlayerRotation, yawRef, pitchRef, yawToward],
  );

  return { update, walkTarget, flyState };
}
