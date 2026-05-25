import { getSQL } from '@/lib/db';

export async function getImpactStats() {
  try {
    const rows = await getSQL()`SELECT * FROM impact_stats ORDER BY sort_order ASC, id ASC`;
    return rows as { id: number; label: string; value: number; suffix: string; featured: boolean; description: string }[];
  } catch {
    return null;
  }
}

export interface InsightSummary {
  id: number;
  headline: string;
  slug: string;
  href: string;
  excerpt: string;
  published_date: string;
}

export async function getVisibleInsights(limit = 50, offset = 0) {
  try {
    const rows = await getSQL()`
      SELECT id, headline, slug, href, excerpt, published_date
      FROM insights
      WHERE visible = true
      ORDER BY published_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows as InsightSummary[];
  } catch {
    return null;
  }
}

export async function getVisibleInsightsCount() {
  try {
    const rows = await getSQL()`SELECT COUNT(*)::int as count FROM insights WHERE visible = true`;
    return rows[0]?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getInsightBySlug(slug: string) {
  try {
    const rows = await getSQL()`
      SELECT id, headline, slug, href, excerpt, content, published_date, visible
      FROM insights
      WHERE slug = ${slug} AND visible = true
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0] as {
      id: number;
      headline: string;
      slug: string;
      href: string;
      excerpt: string;
      content: string;
      published_date: string;
      visible: boolean;
    };
  } catch {
    return null;
  }
}
