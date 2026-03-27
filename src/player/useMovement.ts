'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

const SPEED = 1;
const TURN_SPEED = 1;
const FRICTION = 0.85;
const PITCH_LIMIT = 1.2;
const BOUND = 45;
const PLAYER_Y = 1.7;

// ── Orbit camera constants ───────────────────────────────────
export const DEFAULT_PITCH = -0.15; // ~8.5° downward — shows Hearth + BioCard on start
const MIN_ZOOM = 0;
const MAX_ZOOM = 15;
const ZOOM_SPEED = 1.5;
const DRAG_SENSITIVITY = 0.003;

export function useMovement() {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const yaw = useRef(0);
  const pitch = useRef(DEFAULT_PITCH);

  // ── Orbit camera refs ──────────────────────────────────────
  const zoom = useRef(10);
  const isDragging = useRef(false);
  const playerPos = useRef(new THREE.Vector3(0, PLAYER_Y, 0));

  const updatePlayerPosition = useForgeStore((s) => s.updatePlayerPosition);
  const updatePlayerRotation = useForgeStore((s) => s.updatePlayerRotation);

  // ── Keyboard listeners ──────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // ── Drag-to-rotate + scroll-to-zoom ────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;
    const lastMouse = { x: 0, y: 0 };

    // --- Mouse handlers ---
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.target !== canvas) return;
      isDragging.current = true;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
      canvas.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;

      yaw.current -= dx * DRAG_SENSITIVITY;
      pitch.current -= dy * DRAG_SENSITIVITY;
      pitch.current = Math.max(DEFAULT_PITCH, Math.min(PITCH_LIMIT, pitch.current));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom.current += (e.deltaY > 0 ? 1 : -1) * ZOOM_SPEED;
      zoom.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom.current));
    };

    // --- Touch handlers ---
    let lastTouchDist = 0;
    let touchCount = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchCount = e.touches.length;
      if (touchCount === 1) {
        isDragging.current = true;
        lastMouse.x = e.touches[0].clientX;
        lastMouse.y = e.touches[0].clientY;
      } else if (touchCount === 2) {
        isDragging.current = false;
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchCount === 1 && isDragging.current) {
        const dx = e.touches[0].clientX - lastMouse.x;
        const dy = e.touches[0].clientY - lastMouse.y;
        lastMouse.x = e.touches[0].clientX;
        lastMouse.y = e.touches[0].clientY;
        yaw.current -= dx * DRAG_SENSITIVITY;
        pitch.current -= dy * DRAG_SENSITIVITY;
        pitch.current = Math.max(DEFAULT_PITCH, Math.min(PITCH_LIMIT, pitch.current));
      } else if (touchCount === 2 && e.touches.length === 2) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = lastTouchDist - dist;
        zoom.current += delta * 0.02;
        zoom.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom.current));
        lastTouchDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDragging.current = false;
      touchCount = 0;
    };

    // Set default cursor
    canvas.style.cursor = 'grab';

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl.domElement]);

  // ── Per-frame update ────────────────────────────────────────
  const update = useCallback(
    (delta: number) => {
      // ── Skip during cinematic or zone unlock ──────────────
      const state = useForgeStore.getState();
      if (state.isCinematicActive || state.isZoneUnlockActive) return;

      // ── Check for teleport request ──────────────────────
      const { teleportTarget, clearTeleport } = useForgeStore.getState();
      if (teleportTarget) {
        playerPos.current.set(teleportTarget.x, PLAYER_Y, teleportTarget.z);
        yaw.current = teleportTarget.yaw;
        pitch.current = DEFAULT_PITCH;
        velocity.current.set(0, 0, 0);
        clearTeleport();

        updatePlayerPosition(teleportTarget.x, PLAYER_Y, teleportTarget.z);
        updatePlayerRotation(teleportTarget.yaw, DEFAULT_PITCH);
        return;
      }

      const dt = Math.min(delta, 0.05);
      const k = keys.current;
      const vel = velocity.current;
      const pp = playerPos.current;

      // Direction vectors from yaw
      const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
      const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

      // Arrow left/right rotate camera, WASD + arrow up/down move
      if (k['ArrowLeft']) yaw.current += TURN_SPEED * dt;
      if (k['ArrowRight']) yaw.current -= TURN_SPEED * dt;

      if (k['KeyW'] || k['ArrowUp']) vel.add(forward.clone().multiplyScalar(SPEED * dt));
      if (k['KeyS'] || k['ArrowDown']) vel.add(forward.clone().multiplyScalar(-SPEED * dt));
      if (k['KeyA']) vel.add(right.clone().multiplyScalar(-SPEED * dt));
      if (k['KeyD']) vel.add(right.clone().multiplyScalar(SPEED * dt));

      // Friction
      vel.multiplyScalar(FRICTION);

      // Apply velocity to player position
      pp.add(vel);
      pp.y = PLAYER_Y;

      // World bounds
      pp.x = Math.max(-BOUND, Math.min(BOUND, pp.x));
      pp.z = Math.max(-BOUND, Math.min(BOUND, pp.z));

      // ── Derive camera from player position + zoom ──────
      const zoomDist = zoom.current;

      if (zoomDist > 0.1) {
        // Pull-back: camera behind and above player, with pitch
        const offsetX = Math.sin(yaw.current) * Math.cos(pitch.current) * zoomDist;
        const offsetZ = Math.cos(yaw.current) * Math.cos(pitch.current) * zoomDist;
        const offsetY = -Math.sin(pitch.current) * zoomDist;

        const camY = Math.max(0.5, PLAYER_Y + offsetY);
        camera.position.set(pp.x + offsetX, camY, pp.z + offsetZ);
        camera.lookAt(pp.x, PLAYER_Y, pp.z);
      } else {
        // First-person: camera at player position
        camera.position.copy(pp);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = yaw.current;
        camera.rotation.x = pitch.current;
      }

      // Sync player position to store
      updatePlayerPosition(pp.x, PLAYER_Y, pp.z);
      updatePlayerRotation(yaw.current, pitch.current);
    },
    [camera, updatePlayerPosition, updatePlayerRotation],
  );

  const isKeysActive = useCallback(() => {
    const k = keys.current;
    return !!(
      k['KeyW'] || k['ArrowUp'] ||
      k['KeyS'] || k['ArrowDown'] ||
      k['KeyA'] || k['ArrowLeft'] ||
      k['KeyD'] || k['ArrowRight']
    );
  }, []);

  return { update, yaw, pitch, isKeysActive, zoom, isDragging, playerPos };
}
