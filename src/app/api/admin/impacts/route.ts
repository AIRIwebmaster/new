import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizeObject } from '@/lib/sanitize';

const impactSchema = z.object({
  label: z.string().min(1).max(255),
  value: z.number().int().min(0),
  suffix: z.string().max(50).optional().default(''),
  sort_order: z.number().int().optional().default(0),
  featured: z.boolean().optional().default(false),
  description: z.string().max(500).optional().default(''),
  turnstileToken: z.string().optional().default(''),
});

const updateSchema = impactSchema.extend({
  id: z.number().int(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await sql`SELECT * FROM impact_stats ORDER BY sort_order ASC, id ASC`;
  return NextResponse.json(stats);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { turnstileToken, ...data } = impactSchema.parse(body);

    if (turnstileToken) {
      const verified = await verifyTurnstile(turnstileToken);
      if (!verified) {
        return NextResponse.json({ error: 'Verification failed.' }, { status: 403 });
      }
    }

    const clean = sanitizeObject(data);

    if (data.featured) {
      await sql`UPDATE impact_stats SET featured = false`;
    }

    const result = await sql`
      INSERT INTO impact_stats (label, value, suffix, sort_order, featured, description)
      VALUES (${clean.label}, ${data.value}, ${clean.suffix}, ${data.sort_order}, ${data.featured}, ${clean.description})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Impact create error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { turnstileToken, id, ...data } = updateSchema.parse(body);

    if (turnstileToken) {
      const verified = await verifyTurnstile(turnstileToken);
      if (!verified) {
        return NextResponse.json({ error: 'Verification failed.' }, { status: 403 });
      }
    }

    const clean = sanitizeObject(data);

    if (data.featured) {
      await sql`UPDATE impact_stats SET featured = false WHERE id != ${id}`;
    }

    const result = await sql`
      UPDATE impact_stats
      SET label = ${clean.label}, value = ${data.value}, suffix = ${clean.suffix},
          sort_order = ${data.sort_order}, featured = ${data.featured},
          description = ${clean.description}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Impact update error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await sql`DELETE FROM impact_stats WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong..' }, { status: 500 });
  }
}
