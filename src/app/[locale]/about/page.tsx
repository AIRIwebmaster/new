import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';
import { BentoStats } from '@/components/sections/bento-stats';
import { PartnersGrid } from '@/components/sections/partners-grid';
import { TeamGrid } from '@/components/sections/team-grid';

export const metadata: Metadata = {
  title: 'About Us',
  description: "Learn about AIRI Foundation's mission to democratize AI education across Canada.",
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const values = [
    {
      title: t('value1Title'),
      description: t('value1Desc'),
    },
    {
      title: t('value2Title'),
      description: t('value2Desc'),
    },
    {
      title: t('value3Title'),
      description: t('value3Desc'),
    },
    {
      title: t('value4Title'),
      description: t('value4Desc'),
    },
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbAbout') }]}
      />

      {/* Mission & Vision */}
      <section className="border-t border-grey-200">
        <div className="container grid md:grid-cols-2">
          <div className="border-b border-grey-200 py-12 md:border-b-0 md:border-r md:py-16 md:pr-12">
            <h2 className="mb-4 text-h3">{t('missionTitle')}</h2>
            <p className="text-body text-grey">
              {t('missionText')}
            </p>
          </div>
          <div className="py-12 md:py-16 md:pl-12">
            <h2 className="mb-4 text-h3">{t('visionTitle')}</h2>
            <p className="text-body text-grey">
              {t('visionText')}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-4 text-h2">{t('whyTitle')}</h2>
          {/* <p className="mb-10 text-body text-grey">{t('whySubtitle')}</p> */}
          <div className="grid gap-px border border-grey-200 bg-grey-200 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 md:p-10">
                <h3 className="mb-3 text-h4">{value.title}</h3>
                <p className="text-sm leading-relaxed text-grey">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="leadership" className="scroll-mt-20 container py-16 md:py-24">
        <h2 className="mb-4 text-h2">{t('leadershipTitle')}</h2>
        {/* <p className="mb-10 text-body text-grey">{t('leadershipSubtitle')}</p> */}
        <TeamGrid />
      </section>

      {/* Interns */}
      <section id="leadership" className="scroll-mt-20 container py-16 md:py-24">
        <h2 className="mb-4 text-h2">{t('internTitle')}</h2>
        <p className="mb-10 text-body text-grey">{t('internSubtitle')}</p>
        {/* <TeamGrid /> */}
      </section>

      {/* Impact — bento grid */}
      <section id="impact" className="scroll-mt-20 border-t border-grey-200 bg-grey-50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-4 text-h2">{t('impactTitle')}</h2>
          <p className="mb-10 max-w-2xl text-body text-grey">
            {t('impactText')}
          </p>
          <BentoStats variant="light" />
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2">{t('partnersTitle')}</h2>
          {/* <p className="mb-10 max-w-2xl text-body text-grey">
            {t('partnersText')}
          </p> */}
          <PartnersGrid />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2 text-white">{t('ctaTitle')}</h2>
          {/* <p className="mb-8 max-w-xl text-body text-white/80">
            {t('ctaText')}
          </p> */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/programs"
              className="bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              {t('ctaPrograms')}
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('ctaContact')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
