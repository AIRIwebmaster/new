import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';


async function queryTable(table: string, limit: number, offset: number) {
  switch (table) {
    case 'contact': {
      const rows = await sql`
        SELECT * FROM contact_submissions
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const countResult = await sql`
        SELECT COUNT(*)::int as count FROM contact_submissions
      `;
      return { rows, count: countResult[0]?.count ?? 0 };
    }

    case 'newsletter': {
      const rows = await sql`
        SELECT * FROM newsletter_subscribers
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const countResult = await sql`
        SELECT COUNT(*)::int as count FROM newsletter_subscribers
      `;
      return { rows, count: countResult[0]?.count ?? 0 };
    }

    case 'volunteer': {
      const rows = await sql`
        SELECT * FROM volunteer_applications
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const countResult = await sql`
        SELECT COUNT(*)::int as count FROM volunteer_applications
      `;
      return { rows, count: countResult[0]?.count ?? 0 };
    }

    // case 'workshop': {
    //   const rows = await sql`
    //     SELECT * FROM workshop_bookings
    //     ORDER BY created_at DESC
    //     LIMIT ${limit} OFFSET ${offset}
    //   `;
    //   const countResult = await sql`
    //     SELECT COUNT(*)::int as count FROM workshop_bookings
    //   `;
    //   return { rows, count: countResult[0]?.count ?? 0 };
    // }

    case 'codeai': {
      const rows = await sql`
        SELECT * FROM codeai_registrations
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const countResult = await sql`
        SELECT COUNT(*)::int as count FROM codeai_registrations
      `;
      return { rows, count: countResult[0]?.count ?? 0 };
    }

    case 'business': {
      const rows = await sql`
        SELECT * FROM business_inquiries
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const countResult = await sql`
        SELECT COUNT(*)::int as count FROM business_inquiries
      `;
      return { rows, count: countResult[0]?.count ?? 0 };
    }

    case 'community': {
      const rows = await sql`
        SELECT * FROM community_inquiries
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const countResult = await sql`
        SELECT COUNT(*)::int as count FROM community_inquiries
      `;
      return { rows, count: countResult[0]?.count ?? 0 };
    }

    default:
      return null;
  }
}

async function getCounts() {
  
  const [contact, newsletter, volunteer, workshop, codeai, business, community] = await Promise.all([
    sql`SELECT COUNT(*)::int as count FROM contact_submissions`,
    sql`SELECT COUNT(*)::int as count FROM newsletter_subscribers`,
    sql`SELECT COUNT(*)::int as count FROM volunteer_applications`,
    sql`SELECT COUNT(*)::int as count FROM workshop_bookings`,
    sql`SELECT COUNT(*)::int as count FROM codeai_registrations`,
    sql`SELECT COUNT(*)::int as count FROM business_inquiries`,
    sql`SELECT COUNT(*)::int as count FROM community_inquiries`,
  ]);
  return {
    contact: contact[0]?.count ?? 0,
    newsletter: newsletter[0]?.count ?? 0,
    volunteer: volunteer[0]?.count ?? 0,
    workshop: workshop[0]?.count ?? 0,
    codeai: codeai[0]?.count ?? 0,
    business: business[0]?.count ?? 0,
    community: community[0]?.count ?? 0,
  };
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get('type');

  if (type === 'counts') {
    const counts = await getCounts();
    return NextResponse.json(counts);
  }

  if (!type) {
    return NextResponse.json({ error: 'Missing type parameter.' }, { status: 400 });
  }

  const isExport = request.nextUrl.searchParams.get('export') === 'true';

  if (isExport) {
    const result = await queryTable(type, 10000, 0);
    if (!result) {
      return NextResponse.json({ error: 'Invalid type.' }, { status: 400 });
    }
    return NextResponse.json({ rows: result.rows });
  }

  const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  const result = await queryTable(type, limit, offset);
  if (!result) {
    return NextResponse.json({ error: 'Invalid type.' }, { status: 400 });
  }

  return NextResponse.json({
    rows: result.rows,
    total: result.count,
    page,
    pages: Math.ceil(result.count / limit),
  });
}
