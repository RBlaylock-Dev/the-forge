'use client';

import { useState, useEffect } from 'react';
import { ForgeCanvas } from '@/canvas/ForgeCanvas';
import { HUD } from '@/hud/HUD';
import { Fallback2D } from '@/components/Fallback2D';

/**
 * Detects WebGL support by attempting to create a canvas context.
 * Returns false if WebGL is unavailable (old browsers, disabled GPU).
 */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

export default function Home() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLSupported(detectWebGL());
  }, []);

  // Still detecting — show nothing (prevents flash)
  if (webGLSupported === null) return null;

  // No WebGL — show the accessible 2D fallback
  if (!webGLSupported) return <Fallback2D />;

  // WebGL available — show the full 3D experience
  return (
    <>
      <ForgeCanvas />
      <HUD />
    </>
  );
}
