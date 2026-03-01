'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { loadProgress } from '@/canvas/ProgressTracker';

export function StartOverlay() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const startGame = useForgeStore((s) => s.startGame);
  const startTour = useForgeStore((s) => s.startTour);

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showReassurance, setShowReassurance] = useState(false);
  const startTime = useRef(Date.now());

  // Poll the shared progress ref from ProgressTracker
  useEffect(() => {
    if (loaded) return;

    let raf: number;
    const poll = () => {
      const p = Math.round(loadProgress.value);
      setProgress(p);

      if (p >= 100 && !loadProgress.active) {
        setLoaded(true);
        return;
      }

      // Show reassurance after 5 seconds
      if (Date.now() - startTime.current > 5000) {
        setShowReassurance(true);
      }

      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [loaded]);

  const handleClick = useCallback(() => {
    if (!loaded) return;
    startGame();
    if (typeof window !== 'undefined' && !localStorage.getItem('forge-tour-done')) {
      startTour();
    }
  }, [loaded, startGame, startTour]);

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
        cursor: loaded ? 'pointer' : 'default',
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

      {/* Loading state */}
      {!loaded && (
        <div style={{ textAlign: 'center' }}>
          {/* Progress bar */}
          <div className="loading-bar">
            <div
              className="loading-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div
            className="font-rajdhani"
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '3px',
              color: '#6a5a4a',
              textTransform: 'uppercase',
              marginTop: 16,
            }}
          >
            Igniting the Forge...
          </div>

          {showReassurance && (
            <div
              className="font-rajdhani"
              style={{
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: '2px',
                color: '#4a3d30',
                textTransform: 'uppercase',
                marginTop: 8,
                opacity: 0,
                animation: 'tooltip-fade-in 0.5s ease forwards',
              }}
            >
              Loading 3D experience...
            </div>
          )}
        </div>
      )}

      {/* Ready state */}
      {loaded && (
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
            opacity: 0,
            animation: 'tooltip-fade-in 0.5s ease forwards',
          }}
        >
          Click to Enter the Forge
        </div>
      )}
    </div>
  );
}
