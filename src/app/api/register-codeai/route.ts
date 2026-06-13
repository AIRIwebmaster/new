import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizeObject } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

const registrationSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters').max(200),
  studentAge: z.number().min(10).max(18),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters').max(200),
  parentEmail: z.string().email('Please enter a valid email address').max(255),
  parentPhone: z.string().min(7, 'Please enter a valid phone number').max(50),
  experienceLevel: z.string().min(1, 'Please select experience level').max(100),
  howHeard: z.string().max(200).optional().or(z.literal('')),
  // turnstileToken: z.string().min(1, 'Please complete the verification'),
  turnstileToken: z.string().optional(),
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
    const { turnstileToken, ...raw } = registrationSchema.parse(body);
    const clean = sanitizeObject(raw);

    // const verified = await verifyTurnstile(turnstileToken);
    // if (!verified) {
    //   return NextResponse.json(
    //     { success: false, message: 'Verification failed. Please try again.' },
    //     { status: 403 }
    //   );
    // }

    // const clean = sanitizeObject(data);

    await sql`
  INSERT INTO codeai_registrations (
    student_name,
    student_age,
    parent_name,
    parent_email,
    parent_phone,
    experience_level,
    how_heard
  )
  VALUES (
    ${clean.studentName},
    ${clean.studentAge},
    ${clean.parentName},
    ${clean.parentEmail},
    ${clean.parentPhone},
    ${clean.experienceLevel},
    ${clean.howHeard || null}
  )
`;

    return NextResponse.json({
      success: true,
      message: 'Registration successful! We will send a confirmation email with next steps.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('CodeAI registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
