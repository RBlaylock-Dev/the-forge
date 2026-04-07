'use client';

import { useForgeStore } from '@/store/useForgeStore';
import { useChatStore } from '@/store/useChatStore';

/**
 * ChatButton — HUD button to open the Forge Spirit chat panel.
 * Appears as a glowing ember icon in the bottom bar.
 */
export function ChatButton() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isOpen = useChatStore((s) => s.isOpen);
  const openChat = useChatStore((s) => s.openChat);
  const closeChat = useChatStore((s) => s.closeChat);

  if (!isStarted) return null;

  return (
    <button
      onClick={() => (isOpen ? closeChat() : openChat())}
      className={`fixed bottom-4 right-4 z-[10] flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
        isOpen
          ? 'bg-[#c4813a]/30 border-[#c4813a] text-[#f5deb3]'
          : 'bg-[#0a0806]/80 border-[#c4813a]/40 text-[#c4813a] hover:border-[#c4813a]/70 hover:bg-[#c4813a]/10'
      }`}
      style={{
        pointerEvents: 'auto',
        fontFamily: 'Rajdhani, sans-serif',
        backdropFilter: 'blur(8px)',
      }}
      aria-label={isOpen ? 'Close Forge Spirit chat' : 'Talk to Forge Spirit'}
      title="Talk to the Forge Spirit"
    >
      <span className="text-lg leading-none">&#x1F525;</span>
      <span className="text-sm font-semibold hidden sm:inline">Forge Spirit</span>
    </button>
  );
}
