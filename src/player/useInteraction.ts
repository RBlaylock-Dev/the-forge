'use client';

import { useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

const MAX_DISTANCE = 6;
const GLOW_DISTANCE = 5;
const HOVER_SCALE = 1.05;
const SCALE_LERP = 0.1;

// ── Reusable objects (avoid per-frame allocations) ──────────
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);
const _worldPos = new THREE.Vector3();
const _targetScale = new THREE.Vector3();

/**
 * Interaction hook — raycasts from camera center to detect
 * interactable objects and adjusts proximity glow + hover scale.
 * Click-to-interact is handled by onClick on individual meshes.
 *
 * Performance: caches the interactable mesh list and rebuilds
 * it only when the scene children change. Reuses a single
 * Vector3 for world position calculations in the hot loop.
 */
export function useInteraction() {
  const { camera, scene, gl } = useThree();
  const prevTarget = useRef<string | null>(null);
  const cachedInteractables = useRef<THREE.Mesh[]>([]);
  const lastChildCount = useRef(0);

  const setInteractTarget = useForgeStore((s) => s.setInteractTarget);

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

    const canvas = gl.domElement;

    const hitMesh = hit && hit.object.userData.interactable
      ? (hit.object as THREE.Mesh)
      : null;

    if (hitMesh) {
      const ud = hitMesh.userData;
      const name = ud.name as string;
      if (name !== prevTarget.current) {
        prevTarget.current = name;
        setInteractTarget({ name, userData: ud.detailData });
      }
      // Show pointer cursor for interactables (unless mid-drag)
      if (canvas.style.cursor !== 'grabbing') {
        canvas.style.cursor = 'pointer';
      }
    } else {
      if (prevTarget.current !== null) {
        prevTarget.current = null;
        setInteractTarget(null);
      }
      // Reset to grab cursor (unless mid-drag)
      if (canvas.style.cursor === 'pointer') {
        canvas.style.cursor = 'grab';
      }
    }

    // ── Hover scale — lerp interactables toward target scale ──
    for (let i = 0; i < interactables.length; i++) {
      const mesh = interactables[i];

      // Store base scale on first encounter
      if (mesh.userData.baseScale === undefined) {
        mesh.userData.baseScale = mesh.scale.x;
      }

      const base = mesh.userData.baseScale as number;
      const target = mesh === hitMesh ? base * HOVER_SCALE : base;
      _targetScale.set(target, target, target);
      mesh.scale.lerp(_targetScale, SCALE_LERP);
    }
  }, [camera, scene, gl, setInteractTarget]);

  return { update };
}
