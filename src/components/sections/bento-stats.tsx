'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description?: string;
  featured?: boolean;
}

interface BentoStatsProps {
  variant?: 'dark' | 'light';
  stats?: StatItem[];
}

export function BentoStats({ variant = 'dark', stats }: BentoStatsProps) {
  const isDark = variant === 'dark';
  const t = useTranslations('impact');

  const defaultStats: StatItem[] = [
    { value: 1625, suffix: '', label: t('defaultStat1Label'), description: t('defaultStat1Desc'), featured: true },
    { value: 165,suffix: '', label: t('defaultStat2Label'), description: t('defaultStat2Desc') },
    { value: 49, suffix: '', label: t('defaultStat3Label'), description: t('defaultStat3Desc') },
    { value: 48,suffix: '', label: t('defaultStat4Label'), description: t('defaultStat4Desc') },
  ];

  const data = stats && stats.length > 0 ? stats : defaultStats;
  const featured = data.find((s) => s.featured) || data[0];
  const rest = data.filter((s) => s !== featured);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        className={`row-span-1 flex flex-col justify-between p-8 sm:row-span-2 md:p-10 ${
          isDark ? 'bg-lime/15' : 'bg-primary'
        }`}
      >
        <div>
          <p className={`text-[clamp(3.5rem,8vw,6rem)] font-bold leading-none ${isDark ? 'text-lime' : 'text-white'}`}>
            <Counter target={featured.value} suffix={featured.suffix} />
          </p>
          <p className={`mt-2 text-h4 font-semibold ${isDark ? 'text-white' : 'text-white'}`}>
            {featured.label}
          </p>
        </div>
        {/* {featured.description && (
          <p className={`mt-6 text-body leading-relaxed ${isDark ? 'text-white/70' : 'text-white/80'}`}>
            {featured.description}
          </p>
        )} */}
      </div>

      {rest.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-col justify-between p-8 ${
            isDark ? 'bg-white/5' : 'bg-grey-50'
          }`}
        >
          <div>
            <p className={`text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-none ${
              isDark ? 'text-white' : 'text-primary'
            }`}>
              <Counter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className={`mt-2 text-sm font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>
              {stat.label}
            </p>
          </div>
          {/* {stat.description && (
            <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-grey'}`}>
              {stat.description}
            </p>
          )} */}
        </div>
      ))}

      {/* CTA card */}
      <div
        className={`flex flex-col justify-between p-8 ${
          isDark ? 'border border-white/10 bg-white/[0.03]' : 'border border-grey-200 bg-white'
        }`}
      >
        <div>
          <p className={`text-h4 font-bold leading-snug ${isDark ? 'text-white' : 'text-foreground'}`}>
            {t('joinTitle')}
          </p>
          {/* <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-grey'}`}>
            {t('joinText')}
          </p> */}
        </div>
        <div className="mt-6 flex gap-4">
          <Link
            href="/volunteer"
            className={`text-sm font-semibold underline underline-offset-4 transition-colors ${
              isDark ? 'text-lime hover:text-lime/80' : 'text-primary hover:text-primary-600'
            }`}
          >
            {t('volunteer')}
          </Link>
          <Link
            href="/career"
            className={`text-sm font-semibold underline underline-offset-4 transition-colors ${
              isDark ? 'text-lime hover:text-lime/80' : 'text-primary hover:text-primary-600'
            }`}
          >
            {t('careers')}
          </Link>
        </div>
      </div>
    </div>
  );
}
