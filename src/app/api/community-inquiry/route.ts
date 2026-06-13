import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizeObject } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

const communitySchema = z.object({
  organizationName: z.string().min(2).max(255),
  yourName: z.string().min(2).max(200),
  role: z.string().min(2).max(200),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().or(z.literal('')),
  whoServed: z.string().min(1).max(100),
  lookingFor: z.string().min(1).max(100),
  participantCount: z.string().min(1).max(50),
  preferredTiming: z.string().min(1).max(100),
  additionalInfo: z.string().max(500).optional().or(z.literal('')),
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
    const { turnstileToken, ...data } = communitySchema.parse(body);

    const verified = await verifyTurnstile(turnstileToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Verification failed. Please try again.' },
        { status: 403 }
      );
    }

    const clean = sanitizeObject(data);
    

    await sql`
      CREATE TABLE IF NOT EXISTS community_inquiries (
        id SERIAL PRIMARY KEY,
        organization_name VARCHAR(255) NOT NULL,
        your_name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        who_served VARCHAR(100) NOT NULL,
        looking_for VARCHAR(100) NOT NULL,
        participant_count VARCHAR(50) NOT NULL,
        preferred_timing VARCHAR(100) NOT NULL,
        additional_info TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO community_inquiries (organization_name, your_name, role, email, phone, who_served, looking_for, participant_count, preferred_timing, additional_info)
      VALUES (${clean.organizationName}, ${clean.yourName}, ${clean.role}, ${clean.email}, ${clean.phone || null}, ${clean.whoServed}, ${clean.lookingFor}, ${clean.participantCount}, ${clean.preferredTiming}, ${clean.additionalInfo || null})
    `;

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. We will be in touch to discuss how we can support your community.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Community inquiry error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
