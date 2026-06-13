import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { BentoStats } from '@/components/sections/bento-stats';
import { PartnersGrid } from '@/components/sections/partners-grid';
import { VideoPlayButton } from '@/components/sections/video-player';
import { getImpactStats, getVisibleInsights } from '@/lib/data';
import type { StatItem } from '@/components/sections/bento-stats';
import { ArrowRight, ChevronRight } from 'lucide-react';

function formatInsightDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('en-CA', { month: 'short' }),
    year: d.getFullYear().toString(),
  };
}

function VideoSection() {
  return (
    <div className="flex justify-center items-center w-full py-10">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl pb-[56.25%]">
        <iframe
          className="absolute top-0 left-0 h-full w-full"
          src="https://www.youtube.com/embed/d1QolvxB8Pc"
          title="Creating your AI solutions"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const dbStats = await getImpactStats();
  const dbInsights = await getVisibleInsights();

  const impactStats: StatItem[] | undefined = dbStats && dbStats.length > 0
    ? dbStats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label, featured: s.featured, description: s.description }))
    : undefined;

  const fallbackNews = [
    { day: '15', month: 'May', year: '2026', headline: 'AIRI Foundation opens four new fellowship positions across AI education and operations', href: '/career' },
    { day: '03', month: 'Mar', year: '2026', headline: 'New partnership with NordBridge Senior Centre expands AI literacy for seniors in Lethbridge', href: '/programs/seniors' },
    { day: '18', month: 'Jan', year: '2026', headline: 'Code & AI Club opens registration for Grades 6–9 students across southern Alberta', href: '/programs/code-ai-club' },
    { day: '22', month: 'Nov', year: '2025', headline: 'AIRI delivers AI automation workshop series for small businesses in partnership with SECA', href: '/programs/professionals' },
  ];

  const newsItems = dbInsights && dbInsights.length > 0
    ? dbInsights.map((i: any) => ({ ...formatInsightDate(i.published_date), headline: i.headline, href: i.href }))
    : fallbackNews;

  const heroCards = [
    { text: t('heroCard1'), href: '/solutions#operational'},
    { text: t('heroCard2'), href: '/solutions#civic'},
  ];

  const programs = [
    {
      title: t('programsTitle1'),
      description: t('programsDesc1'),
      href: '/programs#professionals',
    },
    {
      title: t('programsTitle2'),
      description: t('programsDesc2'),
      href: '/programs#immigrants',
    },
  ];

  const solutions = [
    { title: t('solution1Title'), description: t('solution1Desc'), href: '/solutions#operational' },
    { title: t('solution2Title'), description: t('solution2Desc'), href: '/solutions#civic' },
    // { title: t('solution3Title'), description: t('solution3Desc'), href: '/solutions#research' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="home-hero relative overflow-hidden">
        <div className="home-hero-pixels" aria-hidden="true" />
        <div className="container relative z-10 flex min-h-[calc(100vh-72px)] flex-col justify-center py-20 md:py-28">
          <div className="w-full">
            <h1 className="text-[clamp(3rem,8vw+1rem,7rem)] font-bold leading-[1.02] text-white">
              {t('heroTitle')}
            </h1>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {heroCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex items-center justify-between gap-4 border border-white/25 bg-white/10 px-6 py-5 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/15 sm:max-w-sm"
              >
                <span className="text-[15px] font-medium leading-snug text-white">{card.text}</span>
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/40 transition-colors group-hover:border-white group-hover:bg-white/10">
                  <ArrowRight className="h-5 w-5 text-white" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-body-lg leading-relaxed text-white/70">
            {t('heroTagline')} <span style={{ fontWeight: 'bold' }}>you deserve to understand and use it well. </span>
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="container py-16 md:py-24">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {/* <div className="flex-1">
            <h2 className="mb-6 text-h2 md:text-h1">{t('introTitle')}</h2>
            <p className="text-body-lg text-grey">{t('introText')}</p>
          </div> */}
          <VideoSection />
        </div>

        
      </section>

      {/* Two-column programs */}
      {/* <section className="border-t border-grey-200">
        <div className="container grid md:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.title}
              className="border-b border-grey-200 py-12 md:border-b-0 md:py-16 md:first:border-r md:first:pr-12 md:last:pl-12"
            >
              <h3 className="mb-4 text-h3">{program.title}</h3>
              <p className="mb-6 text-body text-grey">{program.description}</p>
              <Link
                href={program.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-lime-600"
              >
                {t('learnMore')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section> */}

      {/* Solutions preview */}
      <section className="border-t border-grey-200 bg-grey-50">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2">{t('solutionsTitle')}</h2>
          <p className="mb-10 max-w-2xl text-body text-grey">{t('solutionsSubtitle')}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {solutions.map((solution) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="group flex flex-col justify-between border border-grey-200 bg-white p-8 transition-colors hover:border-primary/30"
              >
                <div>
                  <h3 className="mb-3 text-h4 group-hover:text-primary">{solution.title}</h3>
                  <p className="text-sm text-grey">{solution.description}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {t('learnMore')}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-b border-grey-200">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2">{t('partnersTitle')}</h2>
          {/* <p className="mb-10 max-w-2xl text-body text-grey">{t('partnersText')}</p> */}
          <PartnersGrid />
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-primary">
        <div className="container py-16 md:py-20">
          <h2 className="mb-4 text-h2 text-white">{t('impactTitle')}</h2>
          {/* <p className="mb-10 max-w-2xl text-body text-white/80">{t('impactText')}</p> */}
          <BentoStats variant="dark" stats={impactStats} />
        </div>
      </section>

      {/* News */}
      <section className="border-b border-grey-200">
        <div className="container py-16 md:py-20">
          {/* <h2 className="mb-10 text-h2">{t('insightsTitle')}</h2> */}
          {/* <div className="border-t border-grey-200">
            {newsItems.map((item) => (
              <Link
                key={item.headline}
                href={item.href}
                className="group flex flex-col gap-4 border-b border-grey-200 px-4 py-6 transition-colors hover:bg-grey-50 sm:flex-row sm:items-center sm:gap-8 md:px-8 md:py-8"
              >
                <div className="flex items-baseline gap-3 sm:w-40 sm:flex-shrink-0 sm:flex-col sm:items-start sm:gap-0">
                  <span className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-foreground">{item.day}</span>
                  <span className="text-sm text-grey">{item.month} {item.year}</span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-4">
                  <p className="text-body font-medium text-foreground group-hover:text-primary">{item.headline}</p>
                  <span className="hidden flex-shrink-0 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:inline">→</span>
                </div>
              </Link>
            ))}
          </div> */}
          {/* <div className="mt-8 text-center">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-lime-600"
            >
              {t('seeAllInsights')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div> */}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary">
        <div className="container relative z-10 py-20 md:py-28">
          <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="mb-6 text-[clamp(2rem,4vw+0.5rem,3.5rem)] font-bold leading-[1.1] text-white">
                {t('ctaTitle')}
              </h2>
              <Link
                href="/career"
                className="inline-block bg-white px-8 py-4 text-[15px] font-semibold text-primary transition-colors hover:bg-white/90"
              >
                {t('ctaApply')}
              </Link>
            </div>
            <div className="flex flex-row items-center gap-5 md:flex-col md:items-center md:gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full md:h-28 md:w-28">
                <Image
                  src="/images/team/frank-onuh.jpg"
                  alt="Frank Onuh, Executive Director"
                  fill
                  className="object-cover object-top grayscale"
                  sizes="112px"
                />
              </div>
              <div className="md:text-center">
                <p className="text-sm leading-relaxed text-white/70">{t('ctaTeamText')}</p>
                <Link
                  href="/about#leadership"
                  className="mt-2 inline-block text-sm font-medium text-white underline underline-offset-4 transition-colors hover:text-white/80"
                >
                  {t('ctaMeetLeadership')}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-white/20 lg:block lg:right-[5%]"
          aria-hidden="true"
        />
      </section>
    </>
  );
}
