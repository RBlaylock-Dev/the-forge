'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import { DEFAULT_PITCH } from './useMovement';
import type { ZoneId } from '@/types';

const WALK_SPEED = 6;
const ARRIVE_THRESHOLD = 0.5;
const FLY_DURATION = 1.5;
const BOUND = 45;
const PLAYER_Y = 1.7;
const DRAG_THRESHOLD = 5; // px — ignore clicks that moved more than this

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
 * Keyboard input cancels any active walk target.
 */
export function useClickToWalk(
  yawRef: React.MutableRefObject<number>,
  pitchRef: React.MutableRefObject<number>,
  zoomRef: React.MutableRefObject<number>,
  playerPosRef: React.MutableRefObject<THREE.Vector3>,
) {
  const { camera, gl } = useThree();
  const walkTarget = useRef<THREE.Vector3 | null>(null);
  const flyState = useRef<FlyState | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouseVec = useRef(new THREE.Vector2());
  const intersectPt = useRef(new THREE.Vector3());
  const mouseDownPos = useRef({ x: 0, y: 0 });

  const updatePlayerPosition = useForgeStore((s) => s.updatePlayerPosition);
  const updatePlayerRotation = useForgeStore((s) => s.updatePlayerRotation);
  const closeDetailPanel = useForgeStore((s) => s.closeDetailPanel);

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

  /** Check if mouse moved more than threshold between down and up (was a drag). */
  const wasDrag = useCallback((e: MouseEvent): boolean => {
    const dx = e.clientX - mouseDownPos.current.x;
    const dy = e.clientY - mouseDownPos.current.y;
    return Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD;
  }, []);

  /** Apply zoom offset to camera based on player position. */
  const applyCameraZoom = useCallback(
    (px: number, py: number, pz: number, yaw: number) => {
      const zoomDist = zoomRef.current;
      if (zoomDist > 0.1) {
        camera.position.set(
          px + Math.sin(yaw) * zoomDist,
          py + zoomDist * 0.5,
          pz + Math.cos(yaw) * zoomDist,
        );
        camera.lookAt(px, py, pz);
      } else {
        camera.position.set(px, py, pz);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw;
        camera.rotation.x = pitchRef.current;
      }
    },
    [camera, zoomRef, pitchRef],
  );

  // ── Click handlers ──────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      if (wasDrag(e)) return;
      if (!useForgeStore.getState().isStarted) return;
      if (useForgeStore.getState().showDetail) return;
      if (flyState.current) return;

      const pt = screenToGround(e.clientX, e.clientY);
      if (!pt) return;

      walkTarget.current = pt.clone();
      flyState.current = null;
    };

    const onDblClick = (e: MouseEvent) => {
      if (wasDrag(e)) return;
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
        from: playerPosRef.current.clone(),
        to: new THREE.Vector3(toX, PLAYER_Y, toZ),
        fromYaw: yawRef.current,
        toYaw,
        elapsed: 0,
      };
      walkTarget.current = null;

      e.preventDefault();
      e.stopPropagation();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('dblclick', onDblClick);
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('dblclick', onDblClick);
    };
  }, [camera, gl, screenToGround, findZoneNear, yawToward, yawRef, playerPosRef, wasDrag]);

  // ── Per-frame update ────────────────────────────────────
  const update = useCallback(
    (delta: number, keysActive: boolean): boolean => {
      // ── Pick up nav bar fly request ─────────────────────
      const { flyTarget, clearFlyTarget, showDetail } = useForgeStore.getState();
      if (flyTarget && !flyState.current) {
        if (showDetail) closeDetailPanel();
        flyState.current = {
          from: playerPosRef.current.clone(),
          to: new THREE.Vector3(flyTarget.x, PLAYER_Y, flyTarget.z),
          fromYaw: yawRef.current,
          toYaw: flyTarget.yaw,
          elapsed: 0,
        };
        walkTarget.current = null;
        clearFlyTarget();
      }

      // ── Fly animation ───────────────────────────────────
      if (flyState.current) {
        const fly = flyState.current;
        fly.elapsed += delta;
        const t = Math.min(fly.elapsed / FLY_DURATION, 1);

        // Cubic ease in-out
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Interpolate player position
        const px = fly.from.x + (fly.to.x - fly.from.x) * ease;
        const pz = fly.from.z + (fly.to.z - fly.from.z) * ease;
        const py = PLAYER_Y + Math.sin(t * Math.PI) * 2; // Arc up

        playerPosRef.current.set(px, py, pz);

        // Shortest-path yaw interpolation
        let yawDiff = fly.toYaw - fly.fromYaw;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        const newYaw = fly.fromYaw + yawDiff * ease;

        yawRef.current = newYaw;
        pitchRef.current = DEFAULT_PITCH - 0.15 * Math.sin(t * Math.PI); // Slight extra look-down during fly

        // Apply camera with zoom offset
        applyCameraZoom(px, py, pz, newYaw);

        updatePlayerPosition(px, py, pz);
        updatePlayerRotation(newYaw, pitchRef.current);

        if (t >= 1) {
          flyState.current = null;
          pitchRef.current = DEFAULT_PITCH;
          playerPosRef.current.y = PLAYER_Y;
          applyCameraZoom(px, PLAYER_Y, pz, newYaw);
        }

        return true; // Signal: click-to-walk is active
      }

      // ── Walk-to-target ──────────────────────────────────
      if (walkTarget.current && !keysActive) {
        const target = walkTarget.current;
        const pp = playerPosRef.current;
        const dx = target.x - pp.x;
        const dz = target.z - pp.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < ARRIVE_THRESHOLD) {
          walkTarget.current = null;
          return false;
        }

        // Move toward target
        const step = Math.min(WALK_SPEED * delta, dist);
        const dirX = dx / dist;
        const dirZ = dz / dist;

        pp.x += dirX * step;
        pp.z += dirZ * step;
        pp.y = PLAYER_Y;

        // World bounds
        pp.x = Math.max(-BOUND, Math.min(BOUND, pp.x));
        pp.z = Math.max(-BOUND, Math.min(BOUND, pp.z));

        // Auto-rotate yaw toward target (smooth)
        const targetYaw = yawToward(pp.x, pp.z, target.x, target.z);
        let yd = targetYaw - yawRef.current;
        while (yd > Math.PI) yd -= Math.PI * 2;
        while (yd < -Math.PI) yd += Math.PI * 2;
        yawRef.current += yd * Math.min(1, 5 * delta);

        // Apply camera with zoom offset
        applyCameraZoom(pp.x, PLAYER_Y, pp.z, yawRef.current);

        updatePlayerPosition(pp.x, PLAYER_Y, pp.z);
        updatePlayerRotation(yawRef.current, pitchRef.current);

        return true;
      }

      // Keyboard cancels walk
      if (keysActive && walkTarget.current) {
        walkTarget.current = null;
      }

      return false;
    },
    [updatePlayerPosition, updatePlayerRotation, closeDetailPanel, yawRef, pitchRef, playerPosRef, yawToward, applyCameraZoom],
  );

  return { update, walkTarget, flyState };
}
