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
import { ZoneEntryTransition } from './ZoneEntryTransition';
import { SoundToggle } from './SoundToggle';
import { ScreenshotButton } from './ScreenshotButton';
import { ScreenshotWatermark } from './ScreenshotWatermark';
import { KonamiOverlay } from './KonamiOverlay';
import { AchievementButton } from './AchievementButton';
import { AchievementToast } from './AchievementToast';
import { AchievementGallery } from './AchievementGallery';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';
import { ResumeBuilder } from './ResumeBuilder';
import { useSoundscape } from '@/audio/useSoundscape';
import { useVisitorCount } from '@/utils/useVisitorCount';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useAchievementTracker } from '@/hooks/useAchievementTracker';
import { useForgeStore } from '@/store/useForgeStore';

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
  useSoundscape();
  useVisitorCount();
  useKonamiCode();
  useAchievementTracker();

  const isScreenshotMode = useForgeStore((s) => s.isScreenshotMode);

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
      {/* ── z-95: Konami easter egg overlay ───────────────────── */}
      <KonamiOverlay />

      {/* ── Screenshot watermark (visible only in screenshot mode) ── */}
      <ScreenshotWatermark />

      {/* ── Screenshot button + P key listener (always mounted for keyboard) ── */}
      <ScreenshotButton />

      {/* Hide all HUD elements in screenshot mode */}
      {!isScreenshotMode && (
        <>
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
          <SoundToggle />
          <CodexButton />
          <AchievementButton />
          <ChatButton />
          <ResumeBuilder />
          <ContextualCTA />

          {/* ── z-20: Dynamic prompts ────────────────────────────── */}
          <CursorTooltip />

          {/* ── z-45: Zone entry transition ────────────────────────── */}
          <ZoneEntryTransition />

          {/* ── z-50: Notifications ──────────────────────────────── */}
          <ZoneFlash />

          {/* ── z-55: Achievement toasts ───────────────────────── */}
          <AchievementToast />

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

          {/* ── z-75: Achievement gallery ─────────────────────── */}
          <AchievementGallery />

          {/* ── z-85: Forge Spirit chat panel ────────────────────── */}
          <ChatPanel />

          {/* ── z-90: Cinematic cold open ────────────────────────── */}
          <CinematicOverlay />

          {/* ── z-100: Modal overlays ────────────────────────────── */}
          <StartOverlay />
        </>
      )}
    </div>
  );
}
