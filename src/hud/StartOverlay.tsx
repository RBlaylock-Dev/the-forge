'use client';

import { useCallback } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

export function StartOverlay() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const startGame = useForgeStore((s) => s.startGame);

  const handleClick = useCallback(() => {
    startGame();
  }, [startGame]);

  return (
    <div
      role="button"
      tabIndex={isStarted ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label="Enter The Forge — click or press Enter to begin"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(10, 8, 6, 0.95)',
        cursor: 'pointer',
        opacity: isStarted ? 0 : 1,
        pointerEvents: isStarted ? 'none' : 'auto',
        transition: 'opacity 1s ease',
        outline: 'none',
      }}
    >
      <h1
        className="font-cinzel"
        style={{
          fontWeight: 900,
          fontSize: 'clamp(32px, 5vw, 60px)',
          color: '#f5deb3',
          textShadow:
            '0 0 40px rgba(232,165,75,0.4), 0 2px 20px rgba(0,0,0,0.8)',
          marginBottom: 8,
          letterSpacing: '4px',
        }}
      >
        THE FORGE
      </h1>

      <div
        className="font-rajdhani"
        style={{
          fontWeight: 300,
          fontSize: 'clamp(13px, 2vw, 18px)',
          color: '#c4813a',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          marginBottom: 40,
        }}
      >
        Robert Blaylock — Senior Full Stack & 3D Engineer
      </div>

      <div
        className="font-rajdhani animate-pulse-glow"
        style={{
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '3px',
          color: '#6a5a4a',
          textTransform: 'uppercase',
          border: '1px solid rgba(196,129,58,0.2)',
          padding: '12px 32px',
          borderRadius: 4,
        }}
      >
        Click to Enter the Forge
      </div>
    </div>
  );
}
