'use client';

import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerController } from '@/player/PlayerController';
import { Hearth } from '@/zones/Hearth';
import { EmberParticles } from '@/objects/EmberParticles';
import { ForgeEmbers } from '@/objects/ForgeEmbers';
import { PathStrip } from '@/objects/PathStrip';

function Fog() {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.FogExp2(0x0a0806, 0.018);
  }, [scene]);
  return null;
}

function Ground() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 120, 80, 80);
    const posArr = geo.getAttribute('position');
    for (let i = 0; i < posArr.count; i++) {
      const x = posArr.getX(i);
      const z = posArr.getY(i);
      posArr.setZ(i, Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.4);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={0x1a1210}
        roughness={0.95}
        metalness={0.1}
      />
    </mesh>
  );
}

export function SceneManager() {
  return (
    <>
      <Fog />

      {/* Ambient */}
      <ambientLight color={0x1a0e06} intensity={0.35} />

      {/* Fill light A */}
      <pointLight
        color={0xc4813a}
        intensity={1}
        distance={35}
        decay={2}
        position={[-15, 5, -8]}
      />

      {/* Fill light B */}
      <pointLight
        color={0x8b4513}
        intensity={0.7}
        distance={35}
        decay={2}
        position={[15, 4, 8]}
      />

      {/* Zone lights */}
      <pointLight
        color={0x44aa88}
        intensity={2}
        distance={18}
        decay={2}
        position={[-22, 5, 0]}
      />
      <pointLight
        color={0xaa6622}
        intensity={2}
        distance={20}
        decay={2}
        position={[22, 5, 0]}
      />
      <pointLight
        color={0x6644aa}
        intensity={2}
        distance={18}
        decay={2}
        position={[0, 5, -24]}
      />
      <pointLight
        color={0x22aacc}
        intensity={2}
        distance={18}
        decay={2}
        position={[0, 5, 24]}
      />

      {/* Ground */}
      <Ground />

      {/* Paths */}
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: -22, z: 0 }} color={0x44aa88} />
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: 22, z: 0 }} color={0xaa6622} />
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: 0, z: -24 }} color={0x6644aa} />
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: 0, z: 24 }} color={0x22aacc} />

      {/* Particles */}
      <EmberParticles />
      <ForgeEmbers />

      {/* Zones */}
      <Hearth />

      {/* Player */}
      <PlayerController />
    </>
  );
}
