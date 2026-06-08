import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/page-hero';
import { CommunityInquiryForm } from '@/components/forms/community-inquiry-form';

export const metadata: Metadata = {
  title: 'Find a Session — Community Organizations',
  description: 'Connect with AIRI Foundation to bring AI literacy programs to your community, organization, or group.',
};

export default async function CommunityInquiryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('communityInquiry');
  return (
    <>
      <PageHero
        title={t('heroTitle')}
        // subtitle={t('heroSubtitle')}
        breadcrumbs={[
          { label: t('breadcrumbHome'), href: '/' },
          { label: t('breadcrumbSolutions'), href: '/solutions' },
          { label: t('breadcrumbCommunity') },
        ]}
      />

      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <p className="mb-8 text-body text-grey">
              {t('introText')}
            </p>
            <CommunityInquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
