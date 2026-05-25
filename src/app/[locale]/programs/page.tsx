import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Explore AIRI Foundation programs: AI workshops for professionals, youth coding clubs, newcomer digital skills training, and senior technology programs.',
};

export default async function ProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('programs');
  const tc = await getTranslations('common');

  const programs = [
    {
      id: 'professionals',
      href: '/programs/professionals',
      title: t('profTitle'),
      subtitle: t('profSubtitle'),
      description: t('profDesc'),
      features: [
        t('profFeat1'),
        t('profFeat2'),
        t('profFeat3'),
        t('profFeat4'),
      ],
    },
    {
      id: 'youth',
      href: '/programs/code-ai-club',
      title: t('youthTitle'),
      subtitle: t('youthSubtitle'),
      description: t('youthDesc'),
      features: [
        t('youthFeat1'),
        t('youthFeat2'),
        t('youthFeat3'),
        t('youthFeat4'),
      ],
    },
    {
      id: 'immigrants',
      href: '/programs/new-canadians',
      title: t('immTitle'),
      subtitle: t('immSubtitle'),
      description: t('immDesc'),
      features: [
        t('immFeat1'),
        t('immFeat2'),
        t('immFeat3'),
        t('immFeat4'),
      ],
    },
    {
      id: 'seniors',
      href: '/programs/seniors',
      title: t('senTitle'),
      subtitle: t('senSubtitle'),
      description: t('senDesc'),
      features: [
        t('senFeat1'),
        t('senFeat2'),
        t('senFeat3'),
        t('senFeat4'),
      ],
    },
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbPrograms') }]}
      />

      {/* Programs */}
      {programs.map((program, index) => (
        <section
          key={program.id}
          id={program.id}
          className={`scroll-mt-20 border-t border-grey-200 ${index % 2 === 1 ? 'bg-grey-50' : ''}`}
        >
          <div className="container py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
              <div className="lg:col-span-3">
                <p className="mb-2 text-sm font-medium text-primary">{program.subtitle}</p>
                <h2 className="mb-4 text-h2">{program.title}</h2>
                <p className="mb-6 text-body text-grey">{program.description}</p>
                <Link
                  href={program.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-lime-600"
                >
                  {tc('learnMore')}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="lg:col-span-2">
                <ul className="space-y-3">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm text-grey">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-primary">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2 text-white">{t('ctaTitle')}</h2>
          <p className="mb-8 max-w-xl text-body text-white/80">
            {t('ctaText')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              {t('ctaContact')}
            </Link>
            <Link
              href="/register-codeaiclub"
              className="border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('ctaRegister')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
