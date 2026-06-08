import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { CodeAIRegistrationForm } from '@/components/forms/codeai-form';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Code & AI Club Registration',
  description: 'Register for AIRI Foundation free Code & AI Club for youth aged 10-18.',
};

export default async function RegisterCodeAIClubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('registerCodeAi');

  const details = [
    { label: t('schedule'), value: t('scheduleVal') },
    { label: t('time'), value: t('timeVal') },
    // { label: t('dates'), value: t('datesVal') },
    { label: t('location'), value: t('locationVal') },
    // { label: t('duration'), value: t('durationVal') },
    { label: t('ages'), value: t('agesVal') },
    { label: t('spots'), value: t('spotsVal') },
    // { label: t('cost'), value: t('costVal') },
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        // subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbPrograms'), href: '/programs' }, { label: t('breadcrumbClub') }]}
      />

      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-20">
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-h3">{t('detailsTitle')}</h2>
              <div className="space-y-4">
                {details.map((detail) => (
                  <div key={detail.label} className="border-t border-grey-200 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-grey">{detail.label}</p>
                    <p className="mt-1 text-sm font-semibold">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3">
              <h2 className="mb-4 text-h3">{t('registerTitle')}</h2>
              <p className="mb-8 text-sm text-grey">
                {t('registerText')}
              </p>
              <CodeAIRegistrationForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
