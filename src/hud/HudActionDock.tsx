'use client';

import { useForgeStore } from '@/store/useForgeStore';
import { ChatButton } from './ChatButton';
import { ContactButton } from './ContactButton';
import { ResumeButton } from './ResumeButton';

/**
 * HudActionDock — the visitor's primary actions (Forge Spirit, Contact,
 * Resume), stacked in the bottom-left corner opposite the minimap.
 * Labels collapse to icons on narrower screens (see globals.css).
 */
export function HudActionDock() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);

  if (!isStarted || isTourActive) return null;

  return (
    <div
      role="group"
      aria-label="Quick actions"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <ChatButton />
      <ContactButton />
      <ResumeButton />
    </div>
  );
}
