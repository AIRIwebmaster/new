import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSQL } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizeObject } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().email('Please enter a valid email address').max(255),
  phone: z.string().max(50).optional().or(z.literal('')),
  organization: z.string().max(255).optional().or(z.literal('')),
  enquiryType: z.string().min(1, 'Please select an enquiry type').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
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
    const { turnstileToken, ...data } = contactSchema.parse(body);

    const verified = await verifyTurnstile(turnstileToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Verification failed. Please try again.' },
        { status: 403 }
      );
    }

    const clean = sanitizeObject(data);

    await getSQL()`
      INSERT INTO contact_submissions (full_name, email, phone, organization, enquiry_type, message)
      VALUES (${clean.fullName}, ${clean.email}, ${clean.phone || null}, ${clean.organization || null}, ${clean.enquiryType}, ${clean.message})
    `;

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent. We will get back to you shortly.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
