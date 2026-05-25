import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getInsightBySlug } from '@/lib/data';
import { ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);
  if (!article) return { title: 'Article not found' };
  return {
    title: article.headline,
    description: article.excerpt || `Read "${article.headline}" on AIRI Foundation.`,
  };
}

function formatArticleDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  const loc = locale === 'fr' ? 'fr-CA' : 'en-GB';
  return d.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('insights');

  const article = await getInsightBySlug(slug);
  if (!article) notFound();

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b border-grey-200 bg-grey-50">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-[13px] text-grey">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t('breadcrumbHome')}
            </Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-foreground transition-colors">
              {t('title')}
            </Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{article.headline}</span>
          </nav>
        </div>
      </div>

      <article className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-10">
            <time className="text-sm text-grey" dateTime={article.published_date}>
              {formatArticleDate(article.published_date, locale)}
            </time>
            <h1 className="mt-3 text-h2 font-bold text-foreground md:text-h1">
              {article.headline}
            </h1>
            {article.excerpt && (
              <p className="mt-4 text-lg text-grey leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Article content */}
          {article.content && (
            <div
              className={
                'prose prose-lg max-w-none text-foreground ' +
                'prose-headings:text-foreground prose-headings:font-bold ' +
                'prose-h2:text-h3 prose-h2:mt-10 prose-h2:mb-4 ' +
                'prose-h3:text-h4 prose-h3:mt-8 prose-h3:mb-3 ' +
                'prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-5 ' +
                'prose-a:text-primary prose-a:underline hover:prose-a:text-primary-600 ' +
                'prose-strong:text-foreground ' +
                'prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:text-grey prose-blockquote:italic ' +
                'prose-ul:text-foreground prose-ol:text-foreground ' +
                'prose-img:rounded prose-img:w-full'
              }
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}

          {/* Back link */}
          <div className="mt-12 border-t border-grey-200 pt-8">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('backToInsights')}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
