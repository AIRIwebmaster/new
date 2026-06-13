import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizeObject } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().email('Please enter a valid email address').max(255),
  phone: z.string().max(50).optional().or(z.literal('')),
  interest: z.string().min(1, 'Please select an area of interest').max(100),
  availability: z.string().min(1, 'Please select your availability').max(100),
  experience: z.string().max(1000).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
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
    const { turnstileToken, ...data } = volunteerSchema.parse(body);

    const verified = await verifyTurnstile(turnstileToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Verification failed. Please try again.' },
        { status: 403 }
      );
    }

    const clean = sanitizeObject(data);

    await sql`
      INSERT INTO volunteer_applications (full_name, email, phone, interest, availability, experience, message)
      VALUES (${clean.fullName}, ${clean.email}, ${clean.phone || null}, ${clean.interest}, ${clean.availability}, ${clean.experience || null}, ${clean.message || null})
    `;

    return NextResponse.json({
      success: true,
      message: 'Your application has been received. We will be in touch soon.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Volunteer form error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
