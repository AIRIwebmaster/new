import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { PageHero } from '@/components/sections/page-hero';
import { Plus, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join AIRI Foundation. Explore career and fellowship opportunities in AI education and community development.',
};

export default async function CareerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('career');

  const artifacts = [
    t('artifact1'),
    t('artifact2'),
    t('artifact3'),
    t('artifact4'),
    t('artifact5'),
  ];

  const positions = [
    {
      title: t('pos1Title'),
      count: t('pos1Count'),
      description: t('pos1Desc'),
      gains: [
        t('pos1Gain1'),
        t('pos1Gain2'),
        t('pos1Gain3'),
        t('pos1Gain4'),
        t('pos1Gain5'),
        t('pos1Gain6'),
        t('pos1Gain7'),
        t('pos1Gain8'),
      ],
      thriveIf: [
        t('pos1Thrive1'),
        t('pos1Thrive2'),
        t('pos1Thrive3'),
        t('pos1Thrive4'),
        t('pos1Thrive5'),
      ],
    },
    {
      title: t('pos2Title'),
      count: t('pos2Count'),
      description: t('pos2Desc1') + '\n\n' + t('pos2Desc2'),
      gains: [
        t('pos2Gain1'),
        t('pos2Gain2'),
        t('pos2Gain3'),
        t('pos2Gain4'),
        t('pos2Gain5'),
        t('pos2Gain6'),
        t('pos2Gain7'),
      ],
    },
    {
      title: t('pos3Title'),
      count: t('pos3Count'),
      description: t('pos3Desc1') + '\n\n' + t('pos3Desc2'),
      gains: [
        t('pos3Gain1'),
        t('pos3Gain2'),
        t('pos3Gain3'),
        t('pos3Gain4'),
        t('pos3Gain5'),
        t('pos3Gain6'),
        t('pos3Gain7'),
      ],
    },
    {
      title: t('pos4Title'),
      count: t('pos4Count'),
      description: t('pos4Desc'),
      coreFunctions: [
        t('pos4CoreFunc1'),
        t('pos4CoreFunc2'),
        t('pos4CoreFunc3'),
        t('pos4CoreFunc4'),
        t('pos4CoreFunc5'),
      ],
      gains: [
        t('pos4Gain1'),
        t('pos4Gain2'),
        t('pos4Gain3'),
        t('pos4Gain4'),
        t('pos4Gain5'),
        t('pos4Gain6'),
        t('pos4Gain7'),
        t('pos4Gain8'),
      ],
      idealProfile: [
        t('pos4Ideal1'),
        t('pos4Ideal2'),
        t('pos4Ideal3'),
        t('pos4Ideal4'),
        t('pos4Ideal5'),
        t('pos4Ideal6'),
      ],
    },
  ];

  const email = siteConfig.emails.career;

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        // subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbCareers') }]}
      />

      {/* How to apply */}
      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-20">
            <div className="lg:col-span-3">
              <h2 className="mb-6 text-h2">{t('howToApply')}</h2>
              <p className="mb-4 text-body text-grey">
                {t('howToApplyBefore')}{' '}
                <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
                  {email}
                </a>
                {' '}{t('howToApplyAfter')}
              </p>
              <p className="mb-8 text-body text-grey">
                {t('standOutIntro')}
              </p>
              <ol className="space-y-4">
                {artifacts.map((artifact, i) => (
                  <li key={i} className="flex gap-4 text-sm text-grey">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{artifact}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-sm font-medium text-grey">
                {t('shortlistedNote')}
              </p>
            </div>
            <div className="lg:col-span-2">
              <h3 className="mb-6 text-h3">{t('details')}</h3>
              <div className="space-y-0 border-t border-grey-200">
                {[
                  { label: t('locationLabel'), value: t('locationValue') },
                  { label: t('eligibilityLabel'), value: t('eligibilityValue') },
                  { label: t('deadlineLabel'), value: t('deadlineValue') },
                ].map((detail) => (
                  <div key={detail.label} className="border-b border-grey-200 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-grey">{detail.label}</p>
                    <p className="mt-1 text-sm font-semibold">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Positions */}
      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('openPositions')}</h2>
          <div className="space-y-0 border-t border-grey-200">
            {positions.map((position) => (
              <details
                key={position.title}
                className="group border-b border-grey-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-6 [&::-webkit-details-marker]:hidden">
                  <div>
                    <h3 className="text-h4 group-open:text-primary">{position.title}</h3>
                    <p className="mt-1 text-sm text-grey">{position.count}</p>
                  </div>
                  <Plus className="h-5 w-5 flex-shrink-0 text-grey transition-transform group-open:rotate-45" />
                </summary>
                <div className="px-6 pb-8">
                  {position.description.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 text-body text-grey">{paragraph}</p>
                  ))}

                  {'coreFunctions' in position && position.coreFunctions && (
                    <>
                      <h4 className="mb-3 mt-6 text-sm font-semibold">{t('coreFunctions')}</h4>
                      <ul className="mb-6 space-y-2">
                        {position.coreFunctions.map((item) => (
                          <li key={item} className="flex gap-3 text-sm text-grey">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h4 className="mb-3 mt-6 text-sm font-semibold">{t('whatYouLearn')}</h4>
                  <ul className="mb-6 space-y-2">
                    {position.gains.map((gain) => (
                      <li key={gain} className="flex gap-3 text-sm text-grey">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {gain}
                      </li>
                    ))}
                  </ul>

                  {'thriveIf' in position && position.thriveIf && (
                    <>
                      <h4 className="mb-3 text-sm font-semibold">{t('thriveIf')}</h4>
                      <ul className="mb-6 space-y-2">
                        {position.thriveIf.map((item) => (
                          <li key={item} className="flex gap-3 text-sm text-grey">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {'idealProfile' in position && position.idealProfile && (
                    <>
                      <h4 className="mb-3 text-sm font-semibold">{t('idealProfile')}</h4>
                      <ul className="mb-6 space-y-2">
                        {position.idealProfile.map((item) => (
                          <li key={item} className="flex gap-3 text-sm text-grey">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-lime" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <a
                    href={`mailto:${email}?subject=Application: ${position.title}`}
                    className="inline-flex items-center gap-2 bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    {t('applyNow')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
