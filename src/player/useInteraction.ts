'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

const MAX_DISTANCE = 6;
const GLOW_DISTANCE = 5;

// ── Reusable objects (avoid per-frame allocations) ──────────
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);
const _worldPos = new THREE.Vector3();

/**
 * Interaction hook — raycasts from camera center to detect
 * interactable objects, adjusts proximity glow, and handles
 * the E key to open the detail panel.
 *
 * Performance: caches the interactable mesh list and rebuilds
 * it only when the scene children change. Reuses a single
 * Vector3 for world position calculations in the hot loop.
 */
export function useInteraction() {
  const { camera, scene } = useThree();
  const prevTarget = useRef<string | null>(null);
  const cachedInteractables = useRef<THREE.Mesh[]>([]);
  const lastChildCount = useRef(0);

  const setInteractTarget = useForgeStore((s) => s.setInteractTarget);
  const showDetailPanel = useForgeStore((s) => s.showDetailPanel);

  // ── E key handler ─────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return;
      const { interactTarget } = useForgeStore.getState();
      if (interactTarget) {
        showDetailPanel(interactTarget.userData);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDetailPanel]);

  // ── Per-frame raycast + proximity glow ────────────────────
  const update = useCallback(() => {
    raycaster.setFromCamera(center, camera);
    raycaster.far = MAX_DISTANCE;

    // Rebuild interactable cache when scene structure changes.
    // Comparing child count is a cheap heuristic that avoids
    // a full traverse every frame.
    const childCount = scene.children.length;
    if (childCount !== lastChildCount.current || cachedInteractables.current.length === 0) {
      lastChildCount.current = childCount;
      const list: THREE.Mesh[] = [];
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh && obj.userData.interactable) {
          list.push(obj as THREE.Mesh);
        }
      });
      cachedInteractables.current = list;
    }

    const interactables = cachedInteractables.current;
    const camPos = camera.position;

    // Proximity glow — adjust emissiveIntensity based on distance.
    // Reuses a single Vector3 (_worldPos) to avoid GC pressure.
    for (let i = 0; i < interactables.length; i++) {
      const mesh = interactables[i];
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat.emissive) continue;

      mesh.getWorldPosition(_worldPos);
      const dist = camPos.distanceTo(_worldPos);

      // Store original emissive intensity on first encounter
      if (mesh.userData.baseEmissive === undefined) {
        mesh.userData.baseEmissive = mat.emissiveIntensity;
      }

      const baseIntensity = mesh.userData.baseEmissive;
      if (dist < GLOW_DISTANCE) {
        const proximity = 1 - dist / GLOW_DISTANCE;
        mat.emissiveIntensity = baseIntensity + proximity * 0.8;
      } else {
        mat.emissiveIntensity = baseIntensity;
      }
    }

    // Raycast for direct aim target
    const hits = raycaster.intersectObjects(interactables, false);
    const hit = hits.length > 0 ? hits[0] : null;

    if (hit && hit.object.userData.interactable) {
      const ud = hit.object.userData;
      const name = ud.name as string;
      if (name !== prevTarget.current) {
        prevTarget.current = name;
        setInteractTarget({ name, userData: ud.detailData });
      }
    } else {
      if (prevTarget.current !== null) {
        prevTarget.current = null;
        setInteractTarget(null);
      }
    }
  }, [camera, scene, setInteractTarget]);

  return { update };
}
