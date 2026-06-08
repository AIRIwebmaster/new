import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { VolunteerForm } from '@/components/forms/volunteer-form';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'Volunteer & Internship',
  description: 'Volunteer or intern with AIRI Foundation. Help us make AI education accessible across Canada.',
};

export default async function VolunteerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('volunteer');

  const roles = [
    { title: t('role1Title'), commitment: t('role1Commitment'), description: t('role1Desc') },
    { title: t('role2Title'), commitment: t('role2Commitment'), description: t('role2Desc') },
    { title: t('role3Title'), commitment: t('role3Commitment'), description: t('role3Desc') },
    { title: t('role4Title'), commitment: t('role4Commitment'), description: t('role4Desc') },
  ];

  return (
    <>
      <PageHero
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        breadcrumbs={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbVolunteer') }]}
      />

      {/* <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <h2 className="mb-10 text-h2">{t('openRoles')}</h2>
          <div className="grid gap-px border border-grey-200 bg-grey-200 sm:grid-cols-2">
            {roles.map((role) => (
              <div key={role.title} className="bg-white p-8">
                <h3 className="text-h4">{role.title}</h3>
                <p className="mb-3 text-xs font-medium text-primary">{role.commitment}</p>
                <p className="text-sm text-grey">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="border-t border-grey-200 bg-grey-50">
  <div className="container py-16 md:py-24">
    <div className="max-w-7xl">
      <h2 className="mb-4 text-h2">{t('applyTitle')}</h2>

      <p className="mb-8 text-body text-grey">
        {t('applyText')}
      </p>

      <div className="w-full overflow-hidden rounded-lg bg-white">
  <iframe
    src="/application.html"
    title="Volunteer Application Portal"
    width="100%"
    height="800"
    style={{
      border: "none",
      display: "block",
    }}
  />
</div>
    </div>
  </div>
</section>
    </>
  );
}
