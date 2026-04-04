'use client';

import { useEffect } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * ScreenshotButton — HUD button + keyboard shortcut (P) to toggle screenshot mode.
 * Hides itself when screenshot mode is active (all UI gets hidden).
 */
export function ScreenshotButton() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const isScreenshotMode = useForgeStore((s) => s.isScreenshotMode);
  const toggleScreenshotMode = useForgeStore((s) => s.toggleScreenshotMode);
  const showContact = useForgeStore((s) => s.showContact);
  const showResume = useForgeStore((s) => s.showResume);
  const showCodex = useForgeStore((s) => s.showCodex);
  const showDetail = useForgeStore((s) => s.showDetail);
  const isCinematicActive = useForgeStore((s) => s.isCinematicActive);

  // Keyboard shortcut: P to toggle
  useEffect(() => {
    if (!isStarted) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'p' || e.key === 'P') {
        // Don't enter screenshot mode when modals are open
        if (
          !isScreenshotMode &&
          (showContact || showResume || showCodex || showDetail || isCinematicActive)
        ) {
          return;
        }
        toggleScreenshotMode();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isStarted,
    isScreenshotMode,
    toggleScreenshotMode,
    showContact,
    showResume,
    showCodex,
    showDetail,
    isCinematicActive,
  ]);

  // Hide button when not started, during tour, or in screenshot mode
  if (!isStarted || isTourActive || isScreenshotMode) return null;

  return (
    <button
      onClick={toggleScreenshotMode}
      aria-label="Screenshot mode (P)"
      title="Screenshot mode (P)"
      className="font-rajdhani"
      style={{
        position: 'fixed',
        bottom: 80,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid rgba(196,129,58,0.4)',
        background: 'rgba(10,8,6,0.7)',
        color: 'rgba(245,222,179,0.6)',
        fontSize: 16,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#e8a54b';
        e.currentTarget.style.borderColor = 'rgba(196,129,58,0.6)';
        e.currentTarget.style.background = 'rgba(196,129,58,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(245,222,179,0.6)';
        e.currentTarget.style.borderColor = 'rgba(196,129,58,0.4)';
        e.currentTarget.style.background = 'rgba(10,8,6,0.7)';
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </button>
  );
}
