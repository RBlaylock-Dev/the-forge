import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const VISITOR_KEY = 'forge:visitor_count';

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// ── GET — fetch current visitor count ────────────────────────
export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ count: 0, configured: false });
    }

    const count = (await redis.get<number>(VISITOR_KEY)) ?? 0;
    return NextResponse.json({ count, configured: true });
  } catch (error) {
    console.error('[Visitors] GET error:', error);
    return NextResponse.json({ count: 0, configured: false });
  }
}

// ── POST — increment visitor count ───────────────────────────
export async function POST() {
  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ count: 0, configured: false });
    }

    const count = await redis.incr(VISITOR_KEY);
    return NextResponse.json({ count, configured: true });
  } catch (error) {
    console.error('[Visitors] POST error:', error);
    return NextResponse.json({ count: 0, configured: false });
  }
}
