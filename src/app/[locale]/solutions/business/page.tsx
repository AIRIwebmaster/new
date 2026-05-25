import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/page-hero';
import { BusinessInquiryForm } from '@/components/forms/business-inquiry-form';

export const metadata: Metadata = {
  title: 'Talk to Us — Business & Organizations',
  description: 'Book a strategic call with AIRI Foundation to discuss AI and automation solutions for your organization.',
};

export default async function BusinessInquiryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('businessInquiry');
  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[
          { label: t('breadcrumbHome'), href: '/' },
          { label: t('breadcrumbSolutions'), href: '/solutions' },
          { label: t('breadcrumbBusiness') },
        ]}
      />

      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <p className="mb-8 text-body text-grey">
              {t('introText')}
            </p>
            <BusinessInquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
