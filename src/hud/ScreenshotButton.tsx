'use client';

import { useEffect } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * Keyboard shortcut (P) to toggle screenshot mode. Called from the HUD root
 * so it keeps working while screenshot mode hides every HUD element.
 */
export function useScreenshotHotkey() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isScreenshotMode = useForgeStore((s) => s.isScreenshotMode);
  const toggleScreenshotMode = useForgeStore((s) => s.toggleScreenshotMode);
  const showContact = useForgeStore((s) => s.showContact);
  const showResume = useForgeStore((s) => s.showResume);
  const showCodex = useForgeStore((s) => s.showCodex);
  const showDetail = useForgeStore((s) => s.showDetail);
  const isCinematicActive = useForgeStore((s) => s.isCinematicActive);

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
}

/**
 * ScreenshotButton — tool rail button to enter screenshot mode.
 */
export function ScreenshotButton() {
  const toggleScreenshotMode = useForgeStore((s) => s.toggleScreenshotMode);

  return (
    <button
      onClick={toggleScreenshotMode}
      aria-label="Screenshot mode (P)"
      title="Screenshot mode (P)"
      className="hud-tool"
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
        aria-hidden="true"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </button>
  );
}
