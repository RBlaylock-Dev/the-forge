import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// ── Rate limiting (in-memory, resets on cold start) ──────────
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];

  // Remove expired entries
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT) return true;

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// ── Validation ───────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SUBJECTS = [
  'Hiring Inquiry',
  'Freelance Project',
  'Collaboration',
  'Just Saying Hi',
  'Other',
];

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

function validateBody(body: ContactBody): string | null {
  if (!body.name || typeof body.name !== 'string' || stripHtml(body.name).length === 0) {
    return 'Name is required';
  }
  if (stripHtml(body.name).length > 100) {
    return 'Name must be under 100 characters';
  }
  if (!body.email || typeof body.email !== 'string' || !EMAIL_REGEX.test(body.email.trim())) {
    return 'A valid email is required';
  }
  if (!body.subject || !VALID_SUBJECTS.includes(body.subject)) {
    return 'Please select a valid subject';
  }
  if (!body.message || typeof body.message !== 'string') {
    return 'Message is required';
  }
  const msg = stripHtml(body.message);
  if (msg.length < 10) {
    return 'Message must be at least 10 characters';
  }
  if (msg.length > 2000) {
    return 'Message must be under 2000 characters';
  }
  return null;
}

// ── POST handler ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown';

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    const body = (await request.json()) as ContactBody;

    // Honeypot check — bots fill hidden fields
    if (body.website && body.website.length > 0) {
      // Silently accept to not tip off bots
      return NextResponse.json({ success: true });
    }

    // Validate
    const validationError = validateBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Sanitize
    const name = stripHtml(body.name);
    const email = body.email.trim().toLowerCase();
    const subject = body.subject;
    const message = stripHtml(body.message);

    // Send email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL_TO;

    if (!apiKey || !toEmail) {
      console.error('[Contact] Missing RESEND_API_KEY or CONTACT_EMAIL_TO env vars');
      return NextResponse.json(
        { error: 'Contact form is not configured yet. Please try again later.' },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const timestamp = new Date().toISOString();

    await resend.emails.send({
      from: 'The Forge <onboarding@resend.dev>',
      to: [toEmail],
      subject: `[The Forge] ${subject} from ${name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #1a1511; color: #f5deb3; border-radius: 8px;">
          <h2 style="color: #e8a54b; margin: 0 0 20px; font-size: 20px; border-bottom: 1px solid rgba(196, 129, 58, 0.3); padding-bottom: 12px;">
            New Message from The Forge
          </h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 12px; color: #c4813a; font-weight: 600; width: 100px; vertical-align: top;">Name</td>
              <td style="padding: 8px 12px; color: #f5deb3;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; color: #c4813a; font-weight: 600; vertical-align: top;">Email</td>
              <td style="padding: 8px 12px; color: #f5deb3;"><a href="mailto:${email}" style="color: #e8a54b;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; color: #c4813a; font-weight: 600; vertical-align: top;">Subject</td>
              <td style="padding: 8px 12px; color: #f5deb3;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; color: #c4813a; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 8px 12px; color: #f5deb3; white-space: pre-wrap; line-height: 1.5;">${message}</td>
            </tr>
          </table>
          <p style="margin: 20px 0 0; font-size: 11px; color: rgba(245, 222, 179, 0.4); border-top: 1px solid rgba(196, 129, 58, 0.15); padding-top: 12px;">
            Sent from The Forge at ${timestamp}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 },
    );
  }
}
