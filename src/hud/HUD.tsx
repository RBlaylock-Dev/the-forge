'use client';

import { StartOverlay } from './StartOverlay';
import { TopBar } from './TopBar';
import { XPBar } from './XPBar';
import { ZoneFlash } from './ZoneFlash';
import { Crosshair } from './Crosshair';
import { InteractPrompt } from './InteractPrompt';
import { DetailPanel } from './DetailPanel';
import { Minimap } from './Minimap';
import { ControlsHUD } from './ControlsHUD';
import { QuickNav } from './QuickNav';

/**
 * HUD — single compositor component that renders all overlay elements.
 * Manages the full z-index stack for the 2D HUD layer:
 *
 *   z-2:   CSS vignette overlay (cinematic edge darkening)
 *   z-3:   CSS scanlines overlay (subtle CRT effect)
 *   z-10:  Static overlays (TopBar, XPBar, Minimap, ControlsHUD)
 *   z-10:  QuickNav (interactive, pointer-events: auto)
 *   z-20:  Dynamic prompts (Crosshair, InteractPrompt)
 *   z-50:  Notifications (ZoneFlash)
 *   z-60:  DetailPanel (slide-in panel)
 *   z-100: Modal overlays (StartOverlay)
 *
 * The wrapper div has pointer-events: none so clicks pass through
 * to the 3D canvas. Interactive children set pointer-events: auto
 * on themselves individually.
 */
export function HUD() {
  return (
    <div
      id="hud-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {/* ── z-2/3: CSS post-processing overlays ──────────────── */}
      <div className="forge-vignette" aria-hidden="true" />
      <div className="forge-scanlines" aria-hidden="true" />

      {/* ── z-10: Static overlays ────────────────────────────── */}
      <TopBar />
      <XPBar />
      <Minimap />
      <ControlsHUD />
      <QuickNav />

      {/* ── z-20: Dynamic prompts ────────────────────────────── */}
      <Crosshair />
      <InteractPrompt />

      {/* ── z-50: Notifications ──────────────────────────────── */}
      <ZoneFlash />

      {/* ── z-60: Detail panel ───────────────────────────────── */}
      <DetailPanel />

      {/* ── z-100: Modal overlays ────────────────────────────── */}
      <StartOverlay />
    </div>
  );
}
