'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { SkillCategoryConfig, SkillSubcategory } from '@/types';

interface SubcategoryOrbitProps {
  category: SkillCategoryConfig;
  onSelectSubcategory: (sub: SkillSubcategory) => void;
}

const ORBIT_RADIUS = 2.2;
const ENTRANCE_DURATION = 0.4;

export function SubcategoryOrbit({ category, onSelectSubcategory }: SubcategoryOrbitProps) {
  const [enterTime] = useState(() => performance.now());

  const nodes = useMemo(() => {
    const count = category.subcategories.length;
    return category.subcategories.map((sub, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      return {
        sub,
        x: Math.cos(angle) * ORBIT_RADIUS,
        z: Math.sin(angle) * ORBIT_RADIUS,
        y: 1.0,
        delay: i * 0.1,
      };
    });
  }, [category.subcategories]);

  const orbMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: category.color,
      emissive: category.color,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
      roughness: 0.3,
    }),
    [category.color],
  );

  return (
    <group>
      {nodes.map((node) => (
        <SubcategoryNode
          key={node.sub.id}
          node={node}
          orbMat={orbMat}
          categoryColor={category.color}
          enterTime={enterTime}
          onSelect={() => onSelectSubcategory(node.sub)}
        />
      ))}
    </group>
  );
}

// ── Individual orbit node ────────────────────────────────────

interface SubcategoryNodeProps {
  node: {
    sub: SkillSubcategory;
    x: number;
    y: number;
    z: number;
    delay: number;
  };
  orbMat: THREE.MeshStandardMaterial;
  enterTime: number;
  categoryColor: string;
  onSelect: () => void;
}

function SubcategoryNode({ node, orbMat, enterTime, categoryColor, onSelect }: SubcategoryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), node.delay * 1000);
    return () => clearTimeout(timer);
  }, [node.delay]);

  const linePoints = useMemo(
    () => [new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(node.x, node.y, node.z)] as [THREE.Vector3, THREE.Vector3],
    [node.x, node.y, node.z],
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const elapsed = (performance.now() - enterTime) / 1000 - node.delay;
    const entranceT = Math.min(Math.max(elapsed / ENTRANCE_DURATION, 0), 1);
    const scale = 1 - Math.pow(1 - entranceT, 3);

    meshRef.current.scale.setScalar(scale);
    meshRef.current.position.y = node.y + Math.sin(clock.getElapsedTime() * 1.5 + node.delay * 3) * 0.08;

    if (labelRef.current) {
      labelRef.current.style.opacity = String(scale);
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Connector line using Drei's Line */}
      <Line
        points={linePoints}
        color={categoryColor}
        lineWidth={1}
        transparent
        opacity={0.15}
      />

      {/* Orb */}
      <mesh
        ref={meshRef}
        position={[node.x, node.y, node.z]}
        material={orbMat}
        userData={{ interactable: true, name: node.sub.label }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[0.2, 12, 12]} />
      </mesh>

      {/* Label */}
      <Html center position={[node.x, node.y + 0.45, node.z]} style={{ pointerEvents: 'none' }}>
        <div
          ref={labelRef}
          style={{
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            className="font-rajdhani"
            style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: '#f5deb3',
              textShadow: '0 0 6px rgba(0,0,0,0.8)',
              letterSpacing: '0.05em',
            }}
          >
            {node.sub.label}
          </div>
          <div
            className="font-rajdhani"
            style={{
              fontSize: '0.5rem',
              fontWeight: 400,
              color: categoryColor,
              letterSpacing: '0.1em',
            }}
          >
            {node.sub.skills.length} skills
          </div>
        </div>
      </Html>
    </group>
  );
}
