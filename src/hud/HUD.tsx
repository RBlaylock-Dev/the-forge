'use client';

import { StartOverlay } from './StartOverlay';
import { TopBar } from './TopBar';
import { XPBar } from './XPBar';
import { ZoneFlash } from './ZoneFlash';
import { DetailPanel } from './DetailPanel';
import { Minimap } from './Minimap';
import { NavBar } from './NavBar';
import { ResumeButton } from './ResumeButton';
import { ResumePreview } from './ResumePreview';
import { ContactButton } from './ContactButton';
import { ContactModal } from './ContactModal';
import { IntroTour } from './IntroTour';
import { CinematicOverlay } from './CinematicOverlay';
import { CursorTooltip } from './CursorTooltip';
import { CodexButton } from './CodexButton';
import { CodexOverlay } from './CodexOverlay';
import { ContextualCTA } from './ContextualCTA';
import { ZoneUnlockCinematic } from './ZoneUnlockCinematic';

/**
 * HUD — single compositor component that renders all overlay elements.
 * Manages the full z-index stack for the 2D HUD layer:
 *
 *   z-2:   CSS vignette overlay (cinematic edge darkening)
 *   z-3:   CSS scanlines overlay (subtle CRT effect)
 *   z-10:  Static overlays (TopBar, XPBar, Minimap, ResumeButton, ContactButton)
 *   z-10:  NavBar (interactive, pointer-events: auto)
 *   z-20:  Dynamic prompts (CursorTooltip)
 *   z-50:  Notifications (ZoneFlash)
 *   z-60:  DetailPanel (slide-in panel)
 *   z-70:  IntroTour (first-visit flythrough)
 *   z-80:  ResumePreview (full-screen overlay)
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
      <NavBar />
      <ContactButton />
      <ResumeButton />
      <CodexButton />
      <ContextualCTA />

      {/* ── z-20: Dynamic prompts ────────────────────────────── */}
      <CursorTooltip />

      {/* ── z-50: Notifications ──────────────────────────────── */}
      <ZoneFlash />

      {/* ── z-60: Detail panel ───────────────────────────────── */}
      <DetailPanel />

      {/* ── z-65: Zone unlock cinematic ────────────────────────── */}
      <ZoneUnlockCinematic />

      {/* ── z-70: Intro tour ───────────────────────────────── */}
      <IntroTour />

      {/* ── z-80: Full-screen overlays ──────────────────────────── */}
      <ResumePreview />
      <ContactModal />

      {/* ── z-75: Codex overlay ───────────────────────────────── */}
      <CodexOverlay />

      {/* ── z-90: Cinematic cold open ────────────────────────── */}
      <CinematicOverlay />

      {/* ── z-100: Modal overlays ────────────────────────────── */}
      <StartOverlay />
    </div>
  );
}
