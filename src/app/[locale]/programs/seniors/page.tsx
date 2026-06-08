import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';
import { Document, Page } from 'react-pdf';
import SeniorsPdf from '@/components/sections/SeniorsPdf';


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
    {
      title: t('topic1Title'),
      description: t('topic1Desc'),
    },
    {
      title: t('topic2Title'),
      description: t('topic2Desc'),
    },
    {
      title: t('topic3Title'),
      description: t('topic3Desc'),
    },
    {
      title: t('topic4Title'),
      description: t('topic4Desc'),
    },
    {
      title: t('topic5Title'),
      description: t('topic5Desc'),
    },
    {
      title: t('topic6Title'),
      description: t('topic6Desc'),
    },
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbPrograms'), href: '/programs' }, { label: t('breadcrumbSeniors') }]}
      />

      {/* <section className="border-t border-grey-200">
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
      </section> */}

      {/* Values */}
      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-4 text-h2">{t('learnTitle')}</h2>
          {/* <p className="mb-10 text-body text-grey">{t('whySubtitle')}</p> */}
          <div className="grid gap-px border border-grey-200 bg-grey-200 sm:grid-cols-3">
            {topics.map((topic) => (
              <div key={topic} className="bg-white p-8 md:p-10">
                <h3 className="mb-3 text-h4">{topic.title}</h3>
                <p className="text-sm leading-relaxed text-grey">{topic.description}</p>
              </div>
            ))}
          </div> <br></br>
          <h2 className="mb-4 text-h2 text-dark">Click the button below to view our Profile</h2>
          {/* <p className="mb-8 max-w-xl text-body text-white/80">
            {t('ctaText')}
          </p> */}
          <Link
            href="https://drive.google.com/file/d/1uAru5zaJOybWDsgYsSSFnBU-fLRpWc8Y/view?usp=sharing"
            className="bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark/90"
          >
            Preview
          </Link>
        </div>
        {/* <SeniorsPdf /> */}
        
      </section>

      
      {/* <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-4 text-h2">{t('howTitle')}</h2>
          <p className="mb-6 max-w-3xl text-body-lg text-grey">
            {t('howText')}
          </p>
          <p className="max-w-3xl text-body text-grey">
            {t('partnerText')}
          </p>
        </div>
      </section> */}

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
