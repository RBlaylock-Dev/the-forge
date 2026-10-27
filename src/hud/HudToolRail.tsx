'use client';

import { useForgeStore } from '@/store/useForgeStore';
import { useIsMobile } from '@/utils/mobile';
import { MINIMAP_SIZE } from './Minimap';
import { SoundToggle } from './SoundToggle';
import { CodexButton } from './CodexButton';
import { AchievementButton } from './AchievementButton';
import { ScreenshotButton } from './ScreenshotButton';

const EDGE = 16;
const GAP = 8;

/**
 * HudToolRail — slim vertical rail of icon tools docked to the left edge
 * of the minimap, so nothing ever sits on top of the map. On mobile the
 * minimap is hidden and the rail takes its corner.
 */
export function HudToolRail() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const mobile = useIsMobile();

  if (!isStarted || isTourActive) return null;

  return (
    <div
      role="toolbar"
      aria-label="Forge tools"
      aria-orientation="vertical"
      style={{
        position: 'fixed',
        bottom: EDGE,
        right: mobile ? EDGE : EDGE + MINIMAP_SIZE + GAP,
        height: mobile ? undefined : MINIMAP_SIZE,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 2,
        padding: 2,
        background: 'rgba(10, 8, 6, 0.6)',
        border: '1px solid rgba(196, 129, 58, 0.2)',
        borderRadius: 10,
        pointerEvents: 'auto',
      }}
    >
      <SoundToggle />
      <CodexButton />
      <AchievementButton />
      <ScreenshotButton />
    </div>
  );
}
