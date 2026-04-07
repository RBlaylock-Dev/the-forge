'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, type ChatMessage } from '@/store/useChatStore';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';

// ── Zone navigation helper ──────────────────────────────────

type ZoneId = keyof typeof ZONE_DEFS;

function parseActions(text: string): {
  cleanText: string;
  actions: { type: 'zone' | 'contact' | 'resume'; value: string }[];
} {
  const actions: { type: 'zone' | 'contact' | 'resume'; value: string }[] = [];

  // Match [[zone:xxx]] and [[action:xxx]]
  const cleaned = text.replace(/\[\[(zone|action):([^\]]+)\]\]/g, (_, type, value) => {
    if (type === 'zone') {
      const zoneId = value as ZoneId;
      const zone = ZONE_DEFS[zoneId];
      if (zone) {
        actions.push({ type: 'zone', value: zoneId });
        return zone.name;
      }
    } else if (type === 'action') {
      actions.push({ type: value as 'contact' | 'resume', value });
    }
    return '';
  });

  return { cleanText: cleaned, actions };
}

// ── Chat Bubble ─────────────────────────────────────────────

function ChatBubble({
  message,
  onAction,
}: {
  message: ChatMessage;
  onAction: (action: { type: 'zone' | 'contact' | 'resume'; value: string }) => void;
}) {
  const isUser = message.role === 'user';
  const { cleanText, actions } = parseActions(message.content);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#2a1f15] text-[#f5deb3] border border-[#3a2a1a]'
            : 'bg-[#1a1511] text-[#e8c898] border border-[#c4813a]/30'
        }`}
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        {!isUser && (
          <div className="text-[10px] uppercase tracking-wider text-[#c4813a] mb-1 font-semibold">
            Forge Spirit
          </div>
        )}
        <div className="whitespace-pre-wrap">{cleanText}</div>

        {/* Action buttons from AI response */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={() => onAction(action)}
                className="text-xs px-3 py-1 rounded border border-[#c4813a]/50 text-[#c4813a] hover:bg-[#c4813a]/20 transition-colors"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                {action.type === 'zone'
                  ? `Visit ${ZONE_DEFS[action.value as ZoneId]?.name ?? action.value}`
                  : action.value === 'contact'
                    ? 'Contact Robert'
                    : 'View Resume'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Typing Indicator ────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-[#1a1511] border border-[#c4813a]/30 rounded-lg px-4 py-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#c4813a]"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Chat Panel ─────────────────────────────────────────

export function ChatPanel() {
  const {
    messages,
    isOpen,
    isLoading,
    error,
    closeChat,
    addMessage,
    updateLastAssistant,
    setLoading,
    setError,
  } = useChatStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [lastAnnouncement, setLastAnnouncement] = useState('');

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Screen reader announcement when assistant finishes a message
  useEffect(() => {
    if (isLoading) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'assistant' && lastMsg.content) {
      setLastAnnouncement(lastMsg.content);
    }
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Focus trapping + Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChat();
        return;
      }

      // Focus trap: Tab cycles within panel
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeChat]);

  const handleAction = useCallback(
    (action: { type: 'zone' | 'contact' | 'resume'; value: string }) => {
      const store = useForgeStore.getState();
      if (action.type === 'zone') {
        const zone = ZONE_DEFS[action.value as ZoneId];
        if (zone) {
          store.flyToZone(zone.center.x, zone.center.z, 0);
          closeChat();
        }
      } else if (action.value === 'contact') {
        store.openContact();
        closeChat();
      } else if (action.value === 'resume') {
        store.openResume();
        closeChat();
      }
    },
    [closeChat],
  );

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    addMessage('user', trimmed);

    // Build messages array for the API
    const allMessages = [
      ...useChatStore.getState().messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    setLoading(true);
    setError(null);
    addMessage('assistant', '');

    // Abort any previous stream
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to reach the forge spirit.');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream.');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              fullText += parsed.text;
              updateLastAssistant(fullText);
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      // Remove empty assistant message on error
      const msgs = useChatStore.getState().messages;
      if (
        msgs.length > 0 &&
        msgs[msgs.length - 1].role === 'assistant' &&
        !msgs[msgs.length - 1].content
      ) {
        useChatStore.setState({ messages: msgs.slice(0, -1) });
      }
    } finally {
      setLoading(false);
    }
  }, [input, isLoading, addMessage, updateLastAssistant, setLoading, setError]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          ref={panelRef}
          className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] z-[85] flex flex-col"
          style={{
            pointerEvents: 'auto',
            background: 'linear-gradient(180deg, #0f0c09 0%, #1a1511 100%)',
            borderLeft: '1px solid rgba(196, 129, 58, 0.3)',
            fontFamily: 'Rajdhani, sans-serif',
          }}
          role="dialog"
          aria-label="Forge Spirit Chat"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#c4813a]/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff8833] animate-pulse" />
              <h2
                className="text-[#c4813a] text-lg font-semibold tracking-wide"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                Forge Spirit
              </h2>
            </div>
            <button
              onClick={closeChat}
              className="text-[#f5deb3]/50 hover:text-[#f5deb3] transition-colors text-xl leading-none px-2"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {/* Welcome message if empty */}
          {messages.length === 0 && (
            <div className="px-4 py-6 text-center text-[#f5deb3]/60 text-sm">
              <div className="text-2xl mb-2">&#x1F525;</div>
              <p>I am the Forge Spirit — a spark of the forge&apos;s memory.</p>
              <p className="mt-1">Ask me about Robert&apos;s skills, projects, or experience.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[
                  "What are Robert's top skills?",
                  'Tell me about the 3D projects',
                  'Is Robert available for hire?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#c4813a]/30 text-[#c4813a] hover:bg-[#c4813a]/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#c4813a]/30">
            {messages.map((msg) =>
              msg.content || msg.role === 'user' ? (
                <ChatBubble key={msg.id} message={msg} onAction={handleAction} />
              ) : null,
            )}
            {isLoading && !messages[messages.length - 1]?.content && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-2 text-xs text-red-400 bg-red-900/20 border-t border-red-800/30">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-[#c4813a]/20">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask the Forge Spirit..."
                className="flex-1 bg-[#0a0806] border border-[#c4813a]/30 rounded-lg px-3 py-2 text-sm text-[#f5deb3] placeholder-[#f5deb3]/30 outline-none focus:border-[#c4813a]/60 transition-colors"
                disabled={isLoading}
                aria-label="Type a message"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-[#c4813a]/20 border border-[#c4813a]/40 rounded-lg text-[#c4813a] hover:bg-[#c4813a]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
          </div>

          {/* Screen reader announcement for new messages */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {lastAnnouncement && `Forge Spirit says: ${lastAnnouncement}`}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
