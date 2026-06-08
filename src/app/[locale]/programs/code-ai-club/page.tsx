import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Code & AI Club',
  description:
    'A free 12-week hands-on program for students in Grades 6–9 to master Python, explore Artificial Intelligence, and start building for the future.',
};

export default async function CodeAIClubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('codeAiClub');

  const details = [
    { label: t('schedule'), value: t('scheduleVal') },
    // { label: t('dates'), value: t('datesVal') },
    { label: t('time'), value: t('timeVal') },
    { label: t('location'), value: t('locationVal') },
    { label: t('ages'), value: t('agesVal') },
    { label: t('spots'), value: t('spotsVal') },
  ];

  const learnings = [
    t('learn1'),
    t('learn2'),
    t('learn3'),
    t('learn4'),
    t('learn5'),
    t('learn6'),
    t('learn7'),
    t('learn8'),
  ];

  const features = [
    t('feat1'),
    // t('feat2'),
    // t('feat3'),
    // t('feat4'),
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbPrograms'), href: '/programs' }, { label: t('breadcrumbClub') }]}
      />

      {/* Program details */}
      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('detailsTitle')}</h2>
          <div className="grid gap-px border border-grey-200 bg-grey-200 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.label} className="bg-white p-6 md:p-8">
                <p className="mb-1 text-sm font-medium text-primary">{detail.label}</p>
                <p className="text-body text-grey">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What students learn */}
      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('learnTitle')}</h2>
          <ul className="max-w-2xl space-y-4">
            {learnings.map((item) => (
              <li key={item} className="flex gap-3 text-body text-grey">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key features */}
      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('featuresTitle')}</h2>
          <ul className="max-w-2xl space-y-4">
            {features.map((item) => (
              <li key={item} className="flex gap-3 text-body text-grey">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2 text-white">{t('ctaTitle')}</h2>
          <p className="mb-8 max-w-xl text-body text-white/80">
            {t('ctaText')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register-codeaiclub"
              className="bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              {t('ctaRegister')}
            </Link>
            <a
              href="mailto:codeclub@airifoundation.org"
              className="border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('ctaContact')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
