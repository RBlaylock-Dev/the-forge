'use client';

import { useState, useEffect } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * KonamiOverlay — Neon wireframe visual effect triggered by the Konami code.
 * Renders a full-screen overlay with neon grid lines, scanlines, and
 * color-shifting effect that makes the scene look retro/wireframe.
 * Fades in on activation, holds for ~5s, then the hook deactivates it.
 */
export function KonamiOverlay() {
  const isKonamiActive = useForgeStore((s) => s.isKonamiActive);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (isKonamiActive) {
      setVisible(true);
      setFading(false);
    } else if (visible) {
      // Fade out
      setFading(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setFading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isKonamiActive, visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        pointerEvents: 'none',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
      }}
    >
      {/* Neon color wash — cyan/magenta tint over the scene */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(0,255,255,0.08) 0%, rgba(255,0,255,0.06) 50%, rgba(0,255,128,0.05) 100%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Horizontal scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
          animation: 'konamiScanScroll 3s linear infinite',
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'konamiGridPulse 2s ease-in-out infinite',
        }}
      />

      {/* Edge glow — neon border */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 80px rgba(0,255,255,0.15), inset 0 0 160px rgba(255,0,255,0.08)',
        }}
      />

      {/* "KONAMI" flash text */}
      <div
        className="font-cinzel"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 48,
          fontWeight: 900,
          letterSpacing: '0.3em',
          color: 'rgba(0,255,255,0.9)',
          textShadow:
            '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4), 0 0 80px rgba(255,0,255,0.3)',
          textTransform: 'uppercase',
          animation: 'konamiTextFlash 0.6s ease-out forwards',
        }}
      >
        &#x2191;&#x2191;&#x2193;&#x2193;&#x2190;&#x2192;&#x2190;&#x2192;BA
      </div>

      {/* Retro CRT flicker */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          animation: 'konamiFlicker 0.15s steps(2) infinite',
          background: 'rgba(0,255,255,0.02)',
        }}
      />

      <style>{`
        @keyframes konamiScanScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes konamiGridPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes konamiTextFlash {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          30% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes konamiFlicker {
          0% { opacity: 1; }
          50% { opacity: 0.97; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
