'use client';

import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { SceneManager } from './SceneManager';
import { PostProcessing } from './PostProcessing';

export function ForgeCanvas() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ fov: 65, near: 0.1, far: 250, position: [0, 1.7, 0] }}
        shadows={{ type: PCFSoftShadowMap }}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 0.85,
        }}
        dpr={[1, 2]}
      >
        <SceneManager />
        <PostProcessing />
      </Canvas>
    </div>
  );
}
