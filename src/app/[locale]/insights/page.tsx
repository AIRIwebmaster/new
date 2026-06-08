import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';
import { getVisibleInsights, getVisibleInsightsCount } from '@/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'News, updates, and stories from AIRI Foundation.',
};

const PER_PAGE = 10;

function formatInsightDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  const loc = locale === 'fr' ? 'fr-CA' : 'en-CA';
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString(loc, { month: 'short' }),
    year: d.getFullYear().toString(),
  };
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (current <= 3) {
    pages.push(2, 3, 4, 'ellipsis', total);
  } else if (current >= total - 2) {
    pages.push('ellipsis', total - 3, total - 2, total - 1, total);
  } else {
    pages.push('ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }
  return pages;
}

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('insights');

  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const offset = (currentPage - 1) * PER_PAGE;

  const [dbInsights, totalCount] = await Promise.all([
    getVisibleInsights(PER_PAGE, offset),
    getVisibleInsightsCount(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const insights = dbInsights && dbInsights.length > 0
    ? dbInsights.map((i) => ({
        ...formatInsightDate(i.published_date, locale),
        headline: i.headline,
        slug: i.slug,
        excerpt: i.excerpt || '',
        href: i.slug ? `/insights/${i.slug}` : i.href,
      }))
    : [];

  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <>
      <PageHero
        title={t('title')}
        // subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('title') }]}
      />

      <section className="container py-16 md:py-20">
        {insights.length === 0 && safePage === 1 ? (
          <div className="py-12 text-center">
            <p className="text-body text-grey">{t('noInsights')}</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-body text-grey">{t('noArticlesOnPage')}</p>
            <Link
              href="/insights"
              className="inline-block text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              {t('goToFirstPage')}
            </Link>
          </div>
        ) : (
          <div className="border-t border-grey-200">
            {insights.map((item) => (
              <Link
                key={item.headline}
                href={item.href}
                className="group flex flex-col gap-4 border-b border-grey-200 px-4 py-6 transition-colors hover:bg-grey-50 sm:flex-row sm:items-start sm:gap-8 md:px-8 md:py-8"
              >
                <div className="flex items-baseline gap-3 sm:w-40 sm:flex-shrink-0 sm:flex-col sm:items-start sm:gap-0">
                  <span className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-foreground">{item.day}</span>
                  <span className="text-sm text-grey">{item.month} {item.year}</span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-body font-medium text-foreground group-hover:text-primary">{item.headline}</p>
                    <span className="hidden flex-shrink-0 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:inline">→</span>
                  </div>
                  {item.excerpt && (
                    <p className="text-sm text-grey line-clamp-2">{item.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-between gap-3" aria-label="Pagination">
            {/* Previous */}
            {safePage > 1 ? (
              <Link
                href={safePage === 2 ? '/insights' : `/insights?page=${safePage - 1}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50 hover:text-foreground sm:px-4"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="hidden sm:inline">{t('previous')}</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-grey-light opacity-40 sm:px-4">
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="hidden sm:inline">{t('previous')}</span>
              </span>
            )}

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((item, idx) =>
                item === 'ellipsis' ? (
                  <span key={`e-${idx}`} className="flex h-9 w-6 items-center justify-center text-[13px] text-grey-light select-none">
                    &hellip;
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={item === 1 ? '/insights' : `/insights?page=${item}`}
                    className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                      item === safePage
                        ? 'bg-primary text-white'
                        : 'text-grey hover:bg-grey-100 hover:text-foreground'
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}
            </div>

            {/* Next */}
            {safePage < totalPages ? (
              <Link
                href={`/insights?page=${safePage + 1}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50 hover:text-foreground sm:px-4"
              >
                <span className="hidden sm:inline">{t('next')}</span>
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-grey-light opacity-40 sm:px-4">
                <span className="hidden sm:inline">{t('next')}</span>
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
