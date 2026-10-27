import { ZONE_DEFS } from '@/data/zones';

// ── SSE parsing ─────────────────────────────────────────────

export type ChatStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'error'; error: string }
  | { type: 'done' };

/**
 * Creates a stateful parser for the /api/chat Server-Sent Events stream.
 * Network chunks can split a `data:` line in half, so incomplete lines are
 * buffered until the next chunk arrives instead of being dropped.
 */
export function createChatStreamParser() {
  let buffer = '';

  function parseLine(line: string): ChatStreamEvent | null {
    if (!line.startsWith('data: ')) return null;
    const payload = line.slice(6).trim();
    if (payload === '[DONE]') return { type: 'done' };

    try {
      const parsed = JSON.parse(payload);
      if (typeof parsed.error === 'string') return { type: 'error', error: parsed.error };
      if (typeof parsed.text === 'string') return { type: 'text', text: parsed.text };
    } catch {
      // Malformed payload — ignore
    }
    return null;
  }

  return {
    /** Feed a decoded chunk; returns every complete event it contained. */
    push(chunk: string): ChatStreamEvent[] {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      return lines.map(parseLine).filter((e): e is ChatStreamEvent => e !== null);
    },
    /** Flush whatever is left once the stream closes. */
    flush(): ChatStreamEvent[] {
      const rest = buffer;
      buffer = '';
      const event = parseLine(rest);
      return event ? [event] : [];
    },
  };
}

// ── Action tokens ───────────────────────────────────────────

type ZoneId = keyof typeof ZONE_DEFS;

export type ChatAction =
  | { type: 'zone'; value: ZoneId }
  | { type: 'contact' | 'resume'; value: string };

const ACTION_TYPES = new Set(['contact', 'resume']);

/**
 * Strips [[zone:xxx]] and [[action:xxx]] tokens from an assistant message,
 * replacing zone tokens with the zone's display name and collecting the
 * actions so the UI can render them as buttons. Unknown tokens are removed.
 */
export function parseActions(text: string): { cleanText: string; actions: ChatAction[] } {
  const actions: ChatAction[] = [];

  const cleanText = text.replace(
    /\[\[(zone|action):([^\]]+)\]\]/g,
    (_, type: string, value: string) => {
      if (type === 'zone') {
        const zone = ZONE_DEFS[value as ZoneId];
        if (zone) {
          actions.push({ type: 'zone', value: value as ZoneId });
          return zone.name;
        }
      } else if (ACTION_TYPES.has(value)) {
        actions.push({ type: value as 'contact' | 'resume', value });
      }
      return '';
    },
  );

  return { cleanText, actions };
}
