'use client';

import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerController } from '@/player/PlayerController';
import { Hearth } from '@/zones/Hearth';
import { SkillTree } from '@/zones/SkillTree';
import { ProjectVault } from '@/zones/ProjectVault';
import { Timeline } from '@/zones/Timeline';
import { WarRoom } from '@/zones/WarRoom';
import { HiddenForge } from '@/zones/HiddenForge';
import { EmberParticles } from '@/objects/EmberParticles';
import { ForgeEmbers } from '@/objects/ForgeEmbers';
import { BreadcrumbParticles } from '@/objects/BreadcrumbParticles';
import { ForgeEvents } from '@/objects/ForgeEvents';
import { PathStrip } from '@/objects/PathStrip';
import { getTimeOfDayPreset } from '@/utils/timeOfDay';

function Fog({ color }: { color: number }) {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.FogExp2(color, 0.014);
    scene.background = new THREE.Color(color);
  }, [scene, color]);
  return null;
}

function Ground({ emissive, emissiveIntensity }: { emissive: number; emissiveIntensity: number }) {
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
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial
        color={0x1a1210}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.95}
        metalness={0.1}
      />
    </mesh>
  );
}

export function SceneManager() {
  // Compute time-of-day lighting once on mount
  const tod = useMemo(() => getTimeOfDayPreset(), []);

  return (
    <>
      <Fog color={tod.fogColor} />

      {/* Ambient */}
      <ambientLight color={tod.ambientColor} intensity={tod.ambientIntensity} />

      {/* Fill light A */}
      <pointLight
        color={tod.fillAColor}
        intensity={tod.fillAIntensity}
        distance={35}
        decay={2}
        position={[-15, 5, -8]}
      />

      {/* Fill light B */}
      <pointLight
        color={tod.fillBColor}
        intensity={tod.fillBIntensity}
        distance={35}
        decay={2}
        position={[15, 4, 8]}
      />

      {/* Zone lights (unchanged — zone identity colors) */}
      <pointLight color={0x44aa88} intensity={2} distance={18} decay={2} position={[-22, 5, 0]} />
      <pointLight color={0xaa6622} intensity={2} distance={20} decay={2} position={[22, 5, 0]} />
      <pointLight color={0x6644aa} intensity={2} distance={18} decay={2} position={[0, 5, -24]} />
      <pointLight color={0x22aacc} intensity={2} distance={18} decay={2} position={[0, 5, 24]} />

      {/* Ground */}
      <Ground emissive={tod.groundEmissive} emissiveIntensity={tod.groundEmissiveIntensity} />

      {/* Paths */}
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: -22, z: 0 }} color={0x44aa88} />
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: 22, z: 0 }} color={0xaa6622} />
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: 0, z: -24 }} color={0x6644aa} />
      <PathStrip from={{ x: 0, z: 0 }} to={{ x: 0, z: 24 }} color={0x22aacc} />

      {/* Particles */}
      <EmberParticles />
      <ForgeEmbers />
      <BreadcrumbParticles />
      <ForgeEvents />

      {/* Zones */}
      <Hearth />
      <SkillTree />
      <ProjectVault />
      <Timeline />
      <WarRoom />
      <HiddenForge />

      {/* Player */}
      <PlayerController />
    </>
  );
}
