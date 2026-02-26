'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKILL_DATA } from '@/data/skills';
import type { DetailData } from '@/types';

// ── Materials ───────────────────────────────────────────────
const trunkMat = new THREE.MeshStandardMaterial({
  color: 0x44aa88,
  emissive: 0x44aa88,
  emissiveIntensity: 0.2,
  roughness: 0.4,
  metalness: 0.7,
});

const platformMat = new THREE.MeshStandardMaterial({
  color: 0x1a2a22,
  roughness: 0.5,
  metalness: 0.7,
});

// ── Category layout ─────────────────────────────────────────
const CATEGORY_LAYOUT = [
  { angle: 0, height: 5.5 },
  { angle: 2.1, height: 4.8 },
  { angle: 4.2, height: 4.2 },
];

// ── Connector helper ────────────────────────────────────────
function Connector({
  from,
  to,
  color,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const dummy = new THREE.Object3D();
    dummy.position.copy(mid);
    dummy.lookAt(to);
    dummy.rotateX(Math.PI / 2);
    dummy.updateMatrix();
    return { position: mid, quaternion: dummy.quaternion.clone(), length: len };
  }, [from, to]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.4,
      }),
    [color],
  );

  return (
    <mesh position={position} quaternion={quaternion} material={mat}>
      <cylinderGeometry args={[0.015, 0.015, length, 3]} />
    </mesh>
  );
}

// ── Category Node (interactable) ────────────────────────────
function CategoryNode({
  category,
  catIndex,
  nodesRef,
}: {
  category: (typeof SKILL_DATA)[number];
  catIndex: number;
  nodesRef: React.MutableRefObject<THREE.Mesh[]>;
}) {
  const layout = CATEGORY_LAYOUT[catIndex];
  const bx = Math.cos(layout.angle) * 2;
  const bz = Math.sin(layout.angle) * 2;

  const catMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: category.color,
        emissive: category.color,
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.6,
      }),
    [category.color],
  );

  const catPos = new THREE.Vector3(bx, layout.height, bz);

  const detailData: DetailData = {
    type: 'skill-category',
    data: category,
  };

  const subNodes = useMemo(() => {
    return category.skills.map((skill, si) => {
      const subAngle = layout.angle + (si - category.skills.length / 2) * 0.4;
      const subR = 3 + si * 0.3;
      const sx = Math.cos(subAngle) * subR;
      const sz = Math.sin(subAngle) * subR;
      const sy = layout.height - 0.5 + si * 0.3;
      const size = 0.12 + skill.level * 0.03;
      const emissiveIntensity = 0.3 + skill.level * 0.12;
      return { sx, sy, sz, size, emissiveIntensity, phase: si * 0.8 + catIndex * 2 };
    });
  }, [category.skills, layout.angle, layout.height, catIndex]);

  const subMats = useMemo(
    () =>
      subNodes.map((sn) =>
        new THREE.MeshStandardMaterial({
          color: category.color,
          emissive: category.color,
          emissiveIntensity: sn.emissiveIntensity,
          roughness: 0.3,
          metalness: 0.5,
        }),
      ),
    [category.color, subNodes],
  );

  return (
    <group>
      {/* Branch line from trunk to category */}
      <mesh position={[bx * 0.5, layout.height - 1, bz * 0.5]} material={trunkMat}>
        <cylinderGeometry args={[0.06, 0.1, 3, 4]} />
      </mesh>

      {/* Category node (interactable) */}
      <mesh
        ref={(el) => {
          if (el) nodesRef.current[catIndex] = el;
        }}
        position={[bx, layout.height, bz]}
        material={catMat}
        userData={{
          interactable: true,
          type: 'skill-category',
          name: category.name,
          detailData,
          baseY: layout.height,
          phase: catIndex * 1.5,
        }}
      >
        <icosahedronGeometry args={[0.4, 1]} />
      </mesh>

      {/* Sub-nodes */}
      {subNodes.map((sn, si) => (
        <group key={si}>
          <mesh
            ref={(el) => {
              if (el) nodesRef.current[3 + catIndex * 10 + si] = el;
            }}
            position={[sn.sx, sn.sy, sn.sz]}
            material={subMats[si]}
            userData={{ baseY: sn.sy, phase: sn.phase }}
          >
            <icosahedronGeometry args={[sn.size, 0]} />
          </mesh>
          <Connector
            from={catPos}
            to={new THREE.Vector3(sn.sx, sn.sy, sn.sz)}
            color={category.color}
          />
        </group>
      ))}
    </group>
  );
}

// ── Main Component ──────────────────────────────────────────

export function SkillTree() {
  const nodesRef = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const node of nodesRef.current) {
      if (!node) continue;
      const ud = node.userData;
      if (ud.baseY !== undefined) {
        node.position.y = ud.baseY + Math.sin(t * 1.3 + (ud.phase || 0)) * 0.15;
      }
      node.rotation.y = t * 0.7 + (ud.phase || 0);
    }
  });

  return (
    <group position={[-22, 0, 0]}>
      {/* Platform */}
      <mesh position={[0, 0.15, 0]} material={platformMat}>
        <cylinderGeometry args={[4, 4.5, 0.3, 16]} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0, 3, 0]} material={trunkMat} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 6, 8]} />
      </mesh>

      {/* Categories */}
      {SKILL_DATA.map((cat, i) => (
        <CategoryNode
          key={cat.name}
          category={cat}
          catIndex={i}
          nodesRef={nodesRef}
        />
      ))}
    </group>
  );
}
