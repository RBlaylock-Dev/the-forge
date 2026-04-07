import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/data/ai-context';

// ── Rate limiting (in-memory, resets on cold start) ──────────
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT) return true;

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// ── Claude client ────────────────────────────────────────────
const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'The forge spirit needs a moment to rest. Try again shortly.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = await req.json();
    const messages: { role: 'user' | 'assistant'; content: string }[] = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize — only keep recent messages, trim content
    const sanitized = messages.slice(-20).map((m) => ({
      role: m.role,
      content: String(m.content).slice(0, 1000),
    }));

    // Stream response from Claude
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: buildSystemPrompt(),
      messages: sanitized,
    });

    // Convert to ReadableStream for the client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'The forge spirit lost its spark. Please try again.' })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'The forge spirit is unreachable right now.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
