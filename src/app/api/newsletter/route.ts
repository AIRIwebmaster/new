import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitize } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().email('Please enter a valid email address').max(255),
  turnstileToken: z.string().min(1, 'Please complete the verification'),
});

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    if (origin && !origin.endsWith('airifoundation.org') && !origin.includes('localhost')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ success: false, message: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body = await request.json();
    const { email, turnstileToken } = schema.parse(body);

    const verified = await verifyTurnstile(turnstileToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Verification failed. Please try again.' },
        { status: 403 }
      );
    }

    const cleanEmail = sanitize(email);
    const sql = sql;

    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO newsletter_subscribers (email)
      VALUES (${cleanEmail})
      ON CONFLICT (email) DO NOTHING
    `;

    return NextResponse.json({
      success: true,
      message: 'You have been subscribed to our newsletter.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
