import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';

type SeniorsProgramContentProps = {
  showHero?: boolean;
};

export async function SeniorsProgramContent({
  showHero = true,
}: SeniorsProgramContentProps) {
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
      {showHero && (
        <PageHero
          title={t('heroTitle')}
          subtitle={t('heroSubtitle')}
          breadcrumbs={[
            { label: t('breadcrumbPrograms'), href: '/programs' },
            { label: t('breadcrumbSeniors') },
          ]}
        />
      )}

      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-4 text-h2">{t('learnTitle')}</h2>

          <div className="grid gap-px border border-grey-200 bg-grey-200 sm:grid-cols-3">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-white p-8 md:p-10">
                <h3 className="mb-3 text-h4">{topic.title}</h3>
                <p className="text-sm leading-relaxed text-grey">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>

          <br />

          <h2 className="mb-4 text-h2 text-dark">
            See our Seniors program brochure
          </h2>

          <Link
            href="https://drive.google.com/file/d/1uAru5zaJOybWDsgYsSSFnBU-fLRpWc8Y/view?usp=sharing"
            className="bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark/90"
          >
            Preview
          </Link>
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