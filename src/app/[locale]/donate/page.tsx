import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support AIRI Foundation. Your donation helps make AI education accessible to communities across Canada.',
};

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('donate');

  const tiers = [
    { amount: t('tier1Amount'), impact: t('tier1Impact') },
    { amount: t('tier2Amount'), impact: t('tier2Impact') },
    { amount: t('tier3Amount'), impact: t('tier3Impact') },
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        // subtitle={t('heroSubtitle')}
      />

      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('yourImpact')}</h2>
          <div className="grid gap-px border border-grey-200 bg-grey-200 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.amount} className="bg-white p-8">
                <p className="mb-3 text-3xl font-bold text-primary">{tier.amount}</p>
                <p className="text-sm text-grey">{tier.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-grey-50">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-h3">{t('taxTitle')}</h2>
            <p className="text-body text-grey">
              {t('taxText')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={siteConfig.links.donate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                {t('donateNow')}
              </a>
              <Link
                href="/contact"
                className="inline-block border-2 border-lime px-6 py-3 text-sm font-semibold transition-all hover:bg-lime hover:text-lime-foreground"
              >
                {t('contactAboutGiving')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
