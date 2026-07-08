import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/sections/page-hero';
import { ArrowRight } from 'lucide-react';
import { Document, Page } from 'react-pdf';
import SeniorsPdf from '@/components/sections/SeniorsPdf';

export const metadata: Metadata = {
  title: 'Solutions',
  description: 'Custom AI and automation solutions for businesses, organizations, and communities. Tell us what you need — we\'ll figure out the rest.',
};

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('solutions');
  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbSolutions') }]}
      />

      {/* Operational Intelligence & Automation */}
      <section id="operational" className="scroll-mt-20 border-t border-grey-200">
        <div className="container py-16 md:py-24">
          
          <h2 className="mb-2 text-h2">{t('opTitle')}</h2>
          <p className="mb-4 mt-10 text-h4">{t('opLabel')}</p>
          <div className="mt-8 max-w-3xl space-y-4 text-body text-grey">
            <p>
              {t('opText1')}
            </p>
            <p>
              {t('opText2')}
            </p>
           <p className="mb-4 mt-10 text-h4">
              {t('opText3')}
            </p>
            <p>
              {t('opText4')}
            </p>
          </div>

          <h3 className="mb-4 mt-10 text-h4">{t('opWhatWeDo')}</h3>
          <ul className="max-w-3xl space-y-3">
            {[
              t('opDo1'),
              t('opDo2'),
              t('opDo3'),
              t('opDo4'),
              t('opDo5'),
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-grey">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          {/* <p className="mt-8 max-w-3xl text-body text-grey">
            {t('opOutro1')}
          </p>
          <p className="mt-4 max-w-3xl font-medium text-foreground">
            {t('opOutro2')}
          </p> */}

          <div className="mt-10">
            <Link
              href="/solutions/business"
              className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              {t('opCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Civic & Cultural AI Literacy */}
      <section id="civic" className="scroll-mt-20 border-t border-grey-200 bg-grey-50">
        <div className="container py-16 md:py-24">
          {/* <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">{t('civicLabel')}</p> */}
          <h2 className="mb-6 text-h2">{t('civicTitle')}</h2>
          <div className="max-w-3xl space-y-4 text-body text-grey">
            <p>
              {t('civicText1')}
            </p>
            {/* <p>
              {t('civicText2')}
            </p> */}
            <p className="text-body text-grey">
              {t.rich('civicText2', {
              seniors: (chunks) => (
              <Link href="/programs/seniors" className="font-semibold text-primary hover:underline">
              {chunks}
              </Link>
              ),
              club: (chunks) => (
              <Link href="/programs/code-ai-club" className="font-semibold text-primary hover:underline">
              {chunks}
              </Link>
              ),
            })}
          </p>
            <p>
              {t('civicText3')}
            </p>
            <p >
              {t('civicText4')}
            </p>
            <p>
              {t('civicText5')}
            </p>
            <p>
              {t('civicText6')}
            </p>
            {/* <p className="font-medium text-foreground">
              {t('civicText7')}
            </p> */}
          </div>

          <div className="mt-10">
            <Link
              href="/solutions/community"
              className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              {t('civicCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Applied R&D & Implementation */}
      <section id="research" className="scroll-mt-20 border-t border-grey-200">
        <div className="container py-16 md:py-24">
          {/* <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">{t('rdLabel')}</p> */}
          <h2 className="mb-6 text-h2">{t('rdTitle')}</h2>
          <div className="max-w-3xl space-y-4 text-body text-grey">
            <p>
              {t('rdText1')}
            </p>
            <p>
              {t('rdText2')}
            </p>
            <p >
              {t('rdText3')}
            </p>
          </div>

          <ul className="mt-8 max-w-3xl space-y-3">
            {[
              t('rdPriority1'),
              t('rdPriority2'),
              t('rdPriority3'),
              t('rdPriority4'),
              t('rdPriority5'),
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-grey">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-3xl text-body text-grey">
            {t('rdOutro')}
          </p>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              {t('rdCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
