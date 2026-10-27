import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { buildSystemPrompt } from '@/data/ai-context';

const MODEL = 'claude-opus-5-5';
const MAX_HISTORY = 20;
const MAX_CONTENT_LENGTH = 1000;

// ── Rate limiting ────────────────────────────────────────────
// Uses Upstash Redis when configured so the limit is shared across
// serverless instances; falls back to in-memory for local dev.
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000; // 1 minute

const rateLimitMap = new Map<string, number[]>();

function isRateLimitedInMemory(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);

  if (recent.length >= RATE_LIMIT) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function isRateLimited(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return isRateLimitedInMemory(ip);

  try {
    // Fixed one-minute window per IP
    const key = `forge:chat-rl:${ip}:${Math.floor(Date.now() / RATE_WINDOW)}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, Math.ceil(RATE_WINDOW / 1000));
    return count > RATE_LIMIT;
  } catch (error) {
    console.error('[Chat] Redis rate limit error:', error);
    return isRateLimitedInMemory(ip);
  }
}

// ── Validation ───────────────────────────────────────────────

type ChatMessage = Anthropic.Beta.BetaMessageParam & { content: string };

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const messages: ChatMessage[] = [];
  for (const m of input.slice(-MAX_HISTORY)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      return null;
    }
    const content = m.content.trim().slice(0, MAX_CONTENT_LENGTH);
    if (content) messages.push({ role: m.role, content });
  }

  // The conversation must start and end with the visitor
  while (messages.length > 0 && messages[0].role !== 'user') messages.shift();
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') return null;

  return messages;
}

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Claude client ────────────────────────────────────────────
let client: Anthropic | null = null;

function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[Chat] ANTHROPIC_API_KEY is not set');
      return jsonError('The forge spirit is sleeping. Please try again later.', 503);
    }

    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (await isRateLimited(ip)) {
      return jsonError('The forge spirit needs a moment to rest. Try again shortly.', 429);
    }

    const body = await req.json().catch(() => null);
    const messages = sanitizeMessages(body?.messages);
    if (!messages) {
      return jsonError('Invalid messages.', 400);
    }

    // Opus 5.5 always thinks; low effort keeps short chat replies fast.
    // `fallbacks: 'default'` reroutes the request if a safety classifier declines it.
    // The installed SDK predates the fallbacks types, so the params are widened here.
    const params: Anthropic.Beta.MessageCreateParamsStreaming & { fallbacks: 'default' } = {
      model: MODEL,
      max_tokens: 16000,
      stream: true,
      system: buildSystemPrompt(),
      messages,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    };
    const stream = getClient().beta.messages.stream(params);

    // Convert to an SSE ReadableStream for the client
    const encoder = new TextEncoder();
    const send = (data: unknown) => encoder.encode(`data: ${JSON.stringify(data)}\n\n`);

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(send({ text: event.delta.text }));
            } else if (event.type === 'message_delta' && event.delta.stop_reason === 'refusal') {
              controller.enqueue(
                send({
                  error:
                    "That's beyond what the forge spirit can speak to. Try asking about Robert's work.",
                }),
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('[Chat] Stream error:', error);
          controller.enqueue(send({ error: 'The forge spirit lost its spark. Please try again.' }));
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Chat] Request error:', error);
    return jsonError('The forge spirit is unreachable right now.', 500);
  }
}
