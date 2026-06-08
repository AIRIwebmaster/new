import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'AI for Professionals',
  description:
    'Workshops and training programs that equip working professionals and organizations with practical AI skills for workflow automation and industry-specific applications.',
};

export default async function ProfessionalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('professionals');

  const coverageLeft = [
    t('cover1'),
    t('cover2'),
    t('cover3'),
  ];

  const coverageRight = [
    t('cover4'),
    t('cover5'),
    t('cover6'),
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        // subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbPrograms'), href: '/programs' }, { label: t('breadcrumbProfessionals') }]}
      />

      {/* What we cover */}
      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('coverTitle')}</h2>
          <div className="grid gap-px border border-grey-200 bg-grey-200 md:grid-cols-2">
            <div className="space-y-0 bg-white">
              {coverageLeft.map((item) => (
                <div key={item} className="border-b border-grey-200 p-6 last:border-b-0">
                  <p className="text-body text-grey">{item}</p>
                </div>
              ))}
            </div>
            <div className="space-y-0 bg-white">
              {coverageRight.map((item) => (
                <div key={item} className="border-b border-grey-200 p-6 last:border-b-0">
                  <p className="text-body text-grey">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-4 text-h2">{t('approachTitle')}</h2>
          <p className="max-w-3xl text-body-lg text-grey">
            {t('approachText')}
          </p>
        </div>
      </section>

      {/* CTA */}
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
