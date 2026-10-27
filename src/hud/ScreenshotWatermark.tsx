'use client';

import { useEffect } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * ScreenshotWatermark — shown only in screenshot mode.
 * Displays a subtle watermark with the portfolio URL and an exit hint.
 * Press P to exit screenshot mode.
 */
export function ScreenshotWatermark() {
  const isScreenshotMode = useForgeStore((s) => s.isScreenshotMode);
  const toggleScreenshotMode = useForgeStore((s) => s.toggleScreenshotMode);

  // ESC also exits screenshot mode
  useEffect(() => {
    if (!isScreenshotMode) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleScreenshotMode();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isScreenshotMode, toggleScreenshotMode]);

  if (!isScreenshotMode) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      {/* Watermark — bottom right */}
      <div
        className="font-cinzel"
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'rgba(245,222,179,0.25)',
            textTransform: 'uppercase',
          }}
        >
          Screenshot Mode
        </span>
        <span
          style={{
            fontSize: 14,
            letterSpacing: '0.05em',
            color: 'rgba(232,165,75,0.35)',
            fontWeight: 600,
          }}
        >
          rblaylock.dev
        </span>
      </div>

      {/* Exit hint — top center, fades after a few seconds */}
      <div
        className="font-rajdhani"
        style={{
          position: 'absolute',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 13,
          color: 'rgba(245,222,179,0.4)',
          letterSpacing: '0.05em',
          animation: 'screenshotHintFade 4s ease forwards',
        }}
      >
        Press <strong style={{ color: 'rgba(232,165,75,0.6)' }}>P</strong> or{' '}
        <strong style={{ color: 'rgba(232,165,75,0.6)' }}>ESC</strong> to exit
      </div>

      {/* Keyframe animation for the hint */}
      <style>{`
        @keyframes screenshotHintFade {
          0% { opacity: 1; }
          60% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
