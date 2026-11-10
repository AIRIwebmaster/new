import { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';

export const metadata: Metadata = {
  title: 'AI Audit',
  description:
    'The AIRI Foundation AI Assessment is temporarily unavailable while we make improvements to enhance your experience and provide more relevant and actionable insights.',
};

export default function AIAuditPage() {
  return (
    <>
      <PageHero title="AI Audit" />

      <section className="border-t border-grey-200">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-body-lg text-grey">
              We are currently updating our AI Assessment to improve your experience and ensure you receive the most relevant and actionable insights.
            </p>

            <p className="mt-8 text-body-lg font-semibold text-grey-900">
              The assessment is temporarily unavailable while these improvements are being completed.
            </p>

            <p className="mt-6 text-body-lg font-semibold text-grey-900">
              Please check back soon or reach out to{' '}
              <a
                href="mailto:contact@airifoundation.org"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                contact@airifoundation.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
