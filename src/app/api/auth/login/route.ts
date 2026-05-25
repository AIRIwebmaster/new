import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSQL } from '@/lib/db';
import { verifyPassword, createToken, sessionCookieOptions } from '@/lib/auth';
import { verifyTurnstile } from '@/lib/turnstile';
import { rateLimit } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
  turnstileToken: z.string().optional().default(''),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many attempts. Please wait.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, turnstileToken } = loginSchema.parse(body);

    if (turnstileToken) {
      const verified = await verifyTurnstile(turnstileToken);
      if (!verified) {
        return NextResponse.json(
          { success: false, message: 'Verification failed.' },
          { status: 403 }
        );
      }
    }

    const users = await getSQL()`
      SELECT id, email, password_hash, name FROM admin_users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const user = users[0];
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const token = await createToken({ id: user.id, email: user.email, name: user.name });
    const response = NextResponse.json({ success: true });
    const cookie = sessionCookieOptions(token);
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Invalid input.' }, { status: 400 });
    }
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong.' }, { status: 500 });
  }
}
