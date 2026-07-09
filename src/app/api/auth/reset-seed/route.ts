import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    
    const hash = await hashPassword('pK9$vX!2mQ*5rB#8');

    const existing = await sql`SELECT id FROM admin_users WHERE email = 'frank@airifoundation.org'`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO admin_users (email, password_hash, name)
        VALUES ('frank@airifoundation.org', ${hash}, 'Frank Onuh')
      `;
      return NextResponse.json({ success: true, message: 'Admin user created.' });
    }

    await sql`
      UPDATE admin_users SET password_hash = ${hash} WHERE email = 'frank@airifoundation.org'
    `;
    return NextResponse.json({ success: true, message: 'Password reset.' });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
