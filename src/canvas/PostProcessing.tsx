'use client';

import { useEffect, useState } from 'react';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import { isMobile } from '@/utils/mobile';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * PostProcessing — cinematic effects layer for the forge scene.
 *
 * - Bloom: subtle glow on emissive materials (fire, torches, embers)
 * - Vignette: darkened edges for dramatic framing
 * - DepthOfField: subtle bokeh in screenshot mode for cinematic captures
 *
 * Respects `prefers-reduced-motion` — renders Vignette-only when
 * the user prefers reduced motion (no bloom animation).
 * Disables bloom on mobile for performance.
 */
export function PostProcessing() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile] = useState(() => isMobile());
  const isScreenshotMode = useForgeStore((s) => s.isScreenshotMode);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const skipBloom = reducedMotion || mobile;

  // Screenshot mode + bloom
  if (isScreenshotMode && !skipBloom) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.3} intensity={0.3} mipmapBlur />
        <DepthOfField focusDistance={0.02} focalLength={0.06} bokehScale={3} />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    );
  }

  // Screenshot mode, no bloom
  if (isScreenshotMode && skipBloom) {
    return (
      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={0.02} focalLength={0.06} bokehScale={3} />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    );
  }

  // Normal mode, no bloom
  if (skipBloom) {
    return (
      <EffectComposer multisampling={0}>
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>
    );
  }

  // Normal mode + bloom
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.3} intensity={0.3} mipmapBlur />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}
