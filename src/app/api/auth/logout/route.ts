import { NextResponse } from 'next/server';
import { COOKIE_DELETE } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_DELETE.name, COOKIE_DELETE.value, {
    maxAge: COOKIE_DELETE.maxAge,
    path: COOKIE_DELETE.path,
  });
  return response;
}
