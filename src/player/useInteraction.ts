'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';

const MAX_DISTANCE = 6;
const GLOW_DISTANCE = 5;
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

export function useInteraction() {
  const { camera, scene } = useThree();
  const prevTarget = useRef<string | null>(null);

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

    // Collect interactable meshes
    const interactables: THREE.Mesh[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh && obj.userData.interactable) {
        interactables.push(obj as THREE.Mesh);
      }
    });

    // Proximity glow — adjust emissiveIntensity based on distance
    const camPos = camera.position;
    for (const mesh of interactables) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat.emissive) continue;
      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);
      const dist = camPos.distanceTo(worldPos);
      const baseIntensity = mesh.userData.baseEmissive ?? mat.emissiveIntensity;
      // Store original emissive intensity on first encounter
      if (mesh.userData.baseEmissive === undefined) {
        mesh.userData.baseEmissive = mat.emissiveIntensity;
      }
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
