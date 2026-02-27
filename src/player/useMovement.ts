'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

const SPEED = 8;
const FRICTION = 0.85;
const PITCH_LIMIT = 1.2;
const BOUND = 45;
const PLAYER_Y = 1.7;
const MOUSE_SENSITIVITY = 0.002;

export function useMovement() {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isLocked = useRef(false);

  const updatePlayerPosition = useForgeStore((s) => s.updatePlayerPosition);
  const updatePlayerRotation = useForgeStore((s) => s.updatePlayerRotation);
  const setLocked = useForgeStore((s) => s.setLocked);

  // ── Keyboard listeners ──────────────────────────────────
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

  // ── Mouse look ──────────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      yaw.current -= e.movementX * MOUSE_SENSITIVITY;
      pitch.current -= e.movementY * MOUSE_SENSITIVITY;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
    };

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
      setLocked(isLocked.current);
    };

    const onClick = () => {
      if (!isLocked.current) {
        canvas.requestPointerLock();
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
    };
  }, [gl.domElement, setLocked]);

  // ── Per-frame update ────────────────────────────────────
  const update = useCallback(
    (delta: number) => {
      // ── Check for teleport request ──────────────────────
      const { teleportTarget, clearTeleport } = useForgeStore.getState();
      if (teleportTarget) {
        camera.position.set(teleportTarget.x, PLAYER_Y, teleportTarget.z);
        yaw.current = teleportTarget.yaw;
        pitch.current = 0;
        velocity.current.set(0, 0, 0);
        clearTeleport();

        // Sync immediately
        updatePlayerPosition(teleportTarget.x, PLAYER_Y, teleportTarget.z);
        updatePlayerRotation(teleportTarget.yaw, 0);
        return;
      }

      const dt = Math.min(delta, 0.05);
      const k = keys.current;
      const vel = velocity.current;

      // Direction vectors from yaw
      const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
      const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

      // Apply input
      if (k['KeyW'] || k['ArrowUp']) vel.add(forward.clone().multiplyScalar(SPEED * dt));
      if (k['KeyS'] || k['ArrowDown']) vel.add(forward.clone().multiplyScalar(-SPEED * dt));
      if (k['KeyA'] || k['ArrowLeft']) vel.add(right.clone().multiplyScalar(-SPEED * dt));
      if (k['KeyD'] || k['ArrowRight']) vel.add(right.clone().multiplyScalar(SPEED * dt));

      // Friction
      vel.multiplyScalar(FRICTION);

      // Apply velocity to camera
      camera.position.add(vel);
      camera.position.y = PLAYER_Y;

      // World bounds
      camera.position.x = Math.max(-BOUND, Math.min(BOUND, camera.position.x));
      camera.position.z = Math.max(-BOUND, Math.min(BOUND, camera.position.z));

      // Apply rotation
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;

      // Sync to store
      updatePlayerPosition(camera.position.x, camera.position.y, camera.position.z);
      updatePlayerRotation(yaw.current, pitch.current);
    },
    [camera, updatePlayerPosition, updatePlayerRotation],
  );

  return { update, yaw, pitch, isLocked };
}
