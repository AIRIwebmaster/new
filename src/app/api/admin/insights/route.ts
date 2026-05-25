import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSQL } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sanitizeObject } from '@/lib/sanitize';

const insightSchema = z.object({
  headline: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  href: z.string().max(500).optional().default(''),
  excerpt: z.string().max(2000).optional().default(''),
  content: z.string().optional().default(''),
  published_date: z.string().min(1),
  visible: z.boolean().optional().default(true),
});

const updateSchema = insightSchema.extend({
  id: z.number().int(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const insights = await getSQL()`SELECT * FROM insights ORDER BY published_date DESC, id DESC`;
  return NextResponse.json(insights);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = insightSchema.parse(body);

    const clean = sanitizeObject({
      headline: data.headline,
      slug: data.slug,
      href: data.href,
      excerpt: data.excerpt,
    });

    const result = await getSQL()`
      INSERT INTO insights (headline, slug, href, excerpt, content, published_date, visible)
      VALUES (
        ${clean.headline}, ${clean.slug}, ${clean.href}, ${clean.excerpt},
        ${data.content}, ${data.published_date}, ${data.visible}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Insight create error:', error);
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
    const { id, ...data } = updateSchema.parse(body);

    const clean = sanitizeObject({
      headline: data.headline,
      slug: data.slug,
      href: data.href,
      excerpt: data.excerpt,
    });

    const result = await getSQL()`
      UPDATE insights
      SET headline = ${clean.headline}, slug = ${clean.slug}, href = ${clean.href},
          excerpt = ${clean.excerpt}, content = ${data.content},
          published_date = ${data.published_date}, visible = ${data.visible},
          updated_at = NOW()
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
    console.error('Insight update error:', error);
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
    await getSQL()`DELETE FROM insights WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
