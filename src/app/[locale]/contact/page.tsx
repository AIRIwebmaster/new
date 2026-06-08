import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ContactForm } from '@/components/forms/contact-form';
import { siteConfig } from '@/config/site';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with AIRI Foundation. Book a workshop, inquire about our services, or partner with us for AI education.',
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const departments = [
    // {
    //   name: t('dept1Name'),
    //   email: siteConfig.emails.enquiry,
    //   description: t('dept1Desc'),
    // },
    {
      name: t('dept2Name'),
      email: siteConfig.emails.career,
      description: t('dept2Desc'),
    },
    {
      name: t('dept3Name'),
      email: siteConfig.emails.contact,
      description: t('dept3Desc'),
    },
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        // subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbContact') }]}
      />

      {/* Form */}
      <section className="border-t border-grey-200">
        <div className="container grid gap-12 py-16 md:py-24 lg:grid-cols-5 lg:gap-20">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-h3">{t('directoryTitle')}</h2>
            <div className="space-y-6">
              {departments.map((dept) => (
                <div key={dept.name} className="border-t border-grey-200 pt-6">
                  <h3 className="text-sm font-semibold">{dept.name}</h3>
                  <p className="mt-1 text-sm text-grey">{dept.description}</p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-600"
                  >
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-grey-200 pt-6">
              <h3 className="text-sm font-semibold">{t('visitUs')}</h3>
              <p className="mt-1 text-sm text-grey">
                {siteConfig.address.street}<br />
                {siteConfig.address.city}, {siteConfig.address.province} {siteConfig.address.postalCode}<br />
                {siteConfig.address.country}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
