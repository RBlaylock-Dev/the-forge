'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

const CINEMATIC_DURATION = 3000; // ms
const TITLE_REVEAL_AT = 2500;   // ms — title starts appearing

export function CinematicOverlay() {
  const isCinematicActive = useForgeStore((s) => s.isCinematicActive);
  const endCinematic = useForgeStore((s) => s.endCinematic);
  const startTour = useForgeStore((s) => s.startTour);

  const [showTitle, setShowTitle] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const finishCinematic = useCallback(() => {
    endCinematic();
    setShowTitle(false);
    setShowSkip(false);

    // Launch tour if first visit
    if (typeof window !== 'undefined' && !localStorage.getItem('forge-tour-done')) {
      startTour();
    }
  }, [endCinematic, startTour]);

  // Timers for title reveal and auto-finish
  useEffect(() => {
    if (!isCinematicActive) return;

    setShowTitle(false);
    setShowSkip(false);

    const skipTimer = setTimeout(() => setShowSkip(true), 500);
    const titleTimer = setTimeout(() => setShowTitle(true), TITLE_REVEAL_AT);
    const endTimer = setTimeout(finishCinematic, CINEMATIC_DURATION + 1500); // Extra 1.5s for title to display

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(titleTimer);
      clearTimeout(endTimer);
    };
  }, [isCinematicActive, finishCinematic]);

  // ESC to skip
  useEffect(() => {
    if (!isCinematicActive) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') finishCinematic();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCinematicActive, finishCinematic]);

  if (!isCinematicActive) return null;

  return (
    <div
      onClick={finishCinematic}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        pointerEvents: 'auto',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Title burn-in */}
      {showTitle && (
        <div style={{ textAlign: 'center' }}>
          <h1
            className="font-cinzel"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(36px, 6vw, 72px)',
              color: '#f5deb3',
              textShadow:
                '0 0 60px rgba(232,165,75,0.5), 0 0 120px rgba(232,165,75,0.2), 0 2px 20px rgba(0,0,0,0.8)',
              letterSpacing: '8px',
              margin: 0,
              opacity: 0,
              animation: 'cinematic-title-in 1.2s ease forwards',
            }}
          >
            THE FORGE
          </h1>
          <div
            className="font-rajdhani"
            style={{
              fontWeight: 300,
              fontSize: 'clamp(12px, 2vw, 18px)',
              color: '#c4813a',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              marginTop: 12,
              opacity: 0,
              animation: 'cinematic-subtitle-in 1s ease 0.4s forwards',
            }}
          >
            Robert Blaylock — Senior Full Stack & 3D Engineer
          </div>
        </div>
      )}

      {/* Skip hint */}
      {showSkip && (
        <div
          className="font-rajdhani"
          style={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '2px',
            color: '#4a3d30',
            textTransform: 'uppercase',
            opacity: 0,
            animation: 'tooltip-fade-in 0.5s ease forwards',
          }}
        >
          Click or press ESC to skip
        </div>
      )}
    </div>
  );
}
