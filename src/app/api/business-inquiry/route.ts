import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizeObject } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

const businessSchema = z.object({
  organizationName: z.string().min(2).max(255),
  yourName: z.string().min(2).max(200),
  workEmail: z.string().email().max(255),
  whatToImprove: z.string().min(10).max(500),
  organizationType: z.string().max(100).optional().or(z.literal('')),
  biggestChallenge: z.string().max(500).optional().or(z.literal('')),
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
    const { turnstileToken, ...data } = businessSchema.parse(body);

    const verified = await verifyTurnstile(turnstileToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Verification failed. Please try again.' },
        { status: 403 }
      );
    }

    const clean = sanitizeObject(data);
    const sql = sql;

    await sql`
      CREATE TABLE IF NOT EXISTS business_inquiries (
        id SERIAL PRIMARY KEY,
        organization_name VARCHAR(255) NOT NULL,
        your_name VARCHAR(255) NOT NULL,
        work_email VARCHAR(255) NOT NULL,
        what_to_improve TEXT NOT NULL,
        organization_type VARCHAR(100),
        biggest_challenge TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO business_inquiries (organization_name, your_name, work_email, what_to_improve, organization_type, biggest_challenge)
      VALUES (${clean.organizationName}, ${clean.yourName}, ${clean.workEmail}, ${clean.whatToImprove}, ${clean.organizationType || null}, ${clean.biggestChallenge || null})
    `;

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry. Our team will be in touch shortly to schedule a call.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Business inquiry error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
