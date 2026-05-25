'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OrganizationJsonLd } from '@/components/seo/json-ld';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/mydashboard');
  const t = useTranslations('common');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <OrganizationJsonLd />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t('skipToContent')}
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
