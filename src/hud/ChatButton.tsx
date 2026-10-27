'use client';

import { useChatStore } from '@/store/useChatStore';

/**
 * ChatButton — primary action dock button that opens the Forge Spirit chat.
 */
export function ChatButton() {
  const isOpen = useChatStore((s) => s.isOpen);
  const openChat = useChatStore((s) => s.openChat);
  const closeChat = useChatStore((s) => s.closeChat);

  return (
    <button
      onClick={() => (isOpen ? closeChat() : openChat())}
      className="hud-dock-btn hud-dock-btn-primary font-rajdhani"
      aria-label={isOpen ? 'Close Forge Spirit chat' : 'Talk to the Forge Spirit'}
      aria-expanded={isOpen}
      title="Talk to the Forge Spirit"
    >
      <span
        aria-hidden="true"
        className="animate-pulse"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffeedd 0%, #ff8833 60%, #ff6600 100%)',
          boxShadow: '0 0 8px 2px rgba(255, 136, 51, 0.6)',
          flexShrink: 0,
        }}
      />
      <span className="hud-dock-label">Ask the Forge Spirit</span>
    </button>
  );
}
