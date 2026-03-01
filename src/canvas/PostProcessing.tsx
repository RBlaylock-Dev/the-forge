'use client';

import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { isMobile } from '@/utils/mobile';

/**
 * PostProcessing — cinematic effects layer for the forge scene.
 *
 * - Bloom: subtle glow on emissive materials (fire, torches, embers)
 * - Vignette: darkened edges for dramatic framing
 *
 * Respects `prefers-reduced-motion` — renders Vignette-only when
 * the user prefers reduced motion (no bloom animation).
 * Disables bloom on mobile for performance.
 */
export function PostProcessing() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile] = useState(() => isMobile());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Skip bloom on mobile or reduced-motion
  if (reducedMotion || mobile) {
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
