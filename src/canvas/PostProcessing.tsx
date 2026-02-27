'use client';

import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

/**
 * PostProcessing — cinematic effects layer for the forge scene.
 *
 * - Bloom: subtle glow on emissive materials (fire, torches, embers)
 * - Vignette: darkened edges for dramatic framing
 *
 * Respects `prefers-reduced-motion` — renders Vignette-only when
 * the user prefers reduced motion (no bloom animation). If perf
 * issues are detected, the component can be conditionally disabled
 * from the parent ForgeCanvas.
 */
export function PostProcessing() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // When reduced motion is preferred, skip Bloom entirely
  if (reducedMotion) {
    return (
      <EffectComposer multisampling={0}>
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        intensity={0.3}
        mipmapBlur
      />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}
