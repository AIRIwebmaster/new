import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'AI for Seniors',
  description:
    'Accessible, jargon-free AI education for seniors — from using AI assistants to navigating digital services with confidence.',
};

export default async function SeniorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('seniors');

  const topics = [
    t('topic1'),
    t('topic2'),
    t('topic3'),
    t('topic4'),
    t('topic5'),
    t('topic6'),
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbPrograms'), href: '/programs' }, { label: t('breadcrumbSeniors') }]}
      />

      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('learnTitle')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {topics.map((topic) => (
              <div key={topic} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <p className="text-body text-grey">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-4 text-h2">{t('howTitle')}</h2>
          <p className="mb-6 max-w-3xl text-body-lg text-grey">
            {t('howText')}
          </p>
          <p className="max-w-3xl text-body text-grey">
            {t('partnerText')}
          </p>
        </div>
      </section>

      <section className="bg-primary">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2 text-white">{t('ctaTitle')}</h2>
          <p className="mb-8 max-w-xl text-body text-white/80">
            {t('ctaText')}
          </p>
          <Link
            href="/contact"
            className="bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </>
  );
}
