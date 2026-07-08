'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, X } from 'lucide-react';

type NestedNavItem = {
  key: string;
  href?: string;
  descriptionKey?: string;
  children?: NestedNavItem[];
};

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileSubDropdown, setActiveMobileSubDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'en' | 'fr') => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`;
    const prefix = newLocale === 'en' ? '' : `/${newLocale}`;
    const target = pathname === '/' ? prefix || '/' : `${prefix}${pathname}`;
    window.location.href = target;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openDropdown = (title: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(title);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors duration-200',
        scrolled ? 'border-grey-200 bg-white' : 'border-grey-100 bg-white'
      )}
    >
      <div className="container flex h-[72px] items-center gap-6 lg:gap-10">
        <Link href="/" className="flex-shrink-0" aria-label="AIRI Foundation Home">
          <Image
            src="/images/logo.png"
            alt="AIRI Foundation"
            width={130}
            height={44}
            className="h-9 w-auto sm:h-10 lg:h-11"
            priority
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 xl:gap-9 lg:flex" aria-label="Main navigation">
          {mainNav.map((item) => (
            <div key={item.key} className="relative">
              {item.children ? (
                <div
                  onMouseEnter={() => openDropdown(item.key)}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    className={cn(
                      'flex items-center gap-1.5 text-[15px] font-medium transition-colors',
                      activeDropdown === item.key ? 'text-primary' : 'text-foreground hover:text-primary'
                    )}
                    aria-expanded={activeDropdown === item.key}
                    aria-haspopup="true"
                  >
                    {t(item.key)}
                    <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', activeDropdown === item.key && 'rotate-180')} strokeWidth={2.5} />
                  </button>

                  <div
                    className={cn(
                      'absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-200',
                      activeDropdown === item.key
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-2 opacity-0 pointer-events-none'
                    )}
                  >
                    <div className="min-w-[260px] border border-grey-200 bg-white py-2 shadow-md">
                      {item.children.map((child) => {
                        const nestedChild = child as NestedNavItem;
                        const childChildren = nestedChild.children || [];

                        return childChildren.length > 0 ? (
                          <div
                            key={child.href || child.key}
                            className="group relative"
                          >
                            <button
                              type="button"
                              className="flex w-full items-start justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-grey-50"
                            >
                              <span className="flex flex-col">
                                <span className="text-[15px] font-medium text-foreground group-hover:text-primary">
                                  {t(child.key)}
                                </span>
                                {child.descriptionKey && (
                                  <span className="mt-0.5 text-[13px] text-grey-light">{t(child.descriptionKey)}</span>
                                )}
                              </span>
                              <ChevronDown className="mt-1 h-3 w-3 -rotate-90 text-grey-light transition-colors group-hover:text-primary" strokeWidth={2.5} />
                            </button>

                            <div className="invisible absolute left-full top-0 ml-1 min-w-[240px] border border-grey-200 bg-white py-2 opacity-0 shadow-md transition-all duration-200 group-hover:visible group-hover:opacity-100">
                              {childChildren.map((grandChild) => (
                                <Link
                                  key={grandChild.href || grandChild.key}
                                  href={grandChild.href || '#'}
                                  className="group/grandchild flex flex-col px-5 py-3 transition-colors hover:bg-grey-50"
                                >
                                  <span className="text-[15px] font-medium text-foreground group-hover/grandchild:text-primary">
                                    {t(grandChild.key)}
                                  </span>
                                  {grandChild.descriptionKey && (
                                    <span className="mt-0.5 text-[13px] text-grey-light">{t(grandChild.descriptionKey)}</span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="group flex flex-col px-5 py-3 transition-colors hover:bg-grey-50"
                          >
                            <span className="text-[15px] font-medium text-foreground group-hover:text-primary">
                              {t(child.key)}
                            </span>
                            {child.descriptionKey && (
                              <span className="mt-0.5 text-[13px] text-grey-light">{t(child.descriptionKey)}</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="text-[15px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  {t(item.key)}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-4 lg:ml-0 lg:gap-5">
          <div className="hidden items-center gap-1 lg:flex">
            <button
              onClick={() => switchLocale('en')}
              className={cn(
                'text-[14px] font-semibold transition-colors',
                locale === 'en' ? 'text-foreground' : 'text-grey-light hover:text-foreground'
              )}
            >
              EN
            </button>
            <span className="text-grey-200 select-none">|</span>
            <button
              onClick={() => switchLocale('fr')}
              className={cn(
                'text-[14px] font-semibold transition-colors',
                locale === 'fr' ? 'text-foreground' : 'text-grey-light hover:text-foreground'
              )}
            >
              FR
            </button>
          </div>

          <Link
            href={siteConfig.links.donate}
            className="hidden bg-lime px-6 py-2 text-[14px] font-bold text-lime-foreground transition-all hover:bg-transparent hover:outline hover:outline-2 hover:outline-lime lg:inline-block"
          >
            {t('support')}
          </Link>

          {!mobileOpen && (
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => switchLocale('en')}
                className={cn(
                  'text-[13px] font-semibold transition-colors',
                  locale === 'en' ? 'text-foreground' : 'text-grey-light hover:text-foreground'
                )}
              >
                EN
              </button>
              <span className="text-[13px] text-grey-200 select-none">|</span>
              <button
                onClick={() => switchLocale('fr')}
                className={cn(
                  'text-[13px] font-semibold transition-colors',
                  locale === 'fr' ? 'text-foreground' : 'text-grey-light hover:text-foreground'
                )}
              >
                FR
              </button>
            </div>
          )}

          <button
            className="flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 transition-colors hover:bg-accent-100 lg:hidden"
            onClick={() => { setMobileOpen(!mobileOpen); setActiveDropdown(null); setActiveMobileSubDropdown(null); }}
            aria-label={mobileOpen ? t('close') : t('menu')}
          >
            <span className="text-[13px] font-semibold text-foreground">
              {mobileOpen ? t('close') : t('menu')}
            </span>
            {mobileOpen ? (
              <X className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 6h7.2" />
                <path strokeLinecap="round" d="M4 12h16" />
                <path strokeLinecap="round" d="M4 18h13.6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-x-0 top-[72px] bottom-0 z-50 overflow-y-auto bg-white transition-all duration-300 ease-out-expo lg:pointer-events-none lg:hidden',
          mobileOpen
            ? 'visible translate-y-0 opacity-100 pointer-events-auto'
            : 'invisible -translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        <nav className="container py-4">
          {mainNav.map((item, i) => (
            <div
              key={item.key}
              className={cn(
                'transition-all duration-300 ease-out',
                mobileOpen
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-3 opacity-0'
              )}
              style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms' }}
            >
              {item.children ? (
                <>
                  <button
                    className="flex w-full items-center justify-between border-b border-grey-100 py-4 text-base font-medium text-foreground"
                    onClick={() => {
                      setActiveDropdown(activeDropdown === item.key ? null : item.key);
                      setActiveMobileSubDropdown(null);
                    }}
                  >
                    {t(item.key)}
                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', activeDropdown === item.key && 'rotate-180')} />
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-250 ease-out',
                      activeDropdown === item.key ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    <div className="border-b border-grey-100 py-2 pl-4">
                      {item.children.map((child) => {
                        const nestedChild = child as NestedNavItem;
                        const childChildren = nestedChild.children || [];

                        return childChildren.length > 0 ? (
                          <div key={child.href || child.key}>
                            <button
                              className="flex w-full items-center justify-between py-3 text-left text-[15px] text-grey transition-colors hover:text-primary"
                              onClick={() => setActiveMobileSubDropdown(activeMobileSubDropdown === child.key ? null : child.key)}
                            >
                              {t(child.key)}
                              <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', activeMobileSubDropdown === child.key && 'rotate-180')} />
                            </button>

                            <div
                              className={cn(
                                'overflow-hidden transition-all duration-250 ease-out',
                                activeMobileSubDropdown === child.key ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                              )}
                            >
                              <div className="pb-2 pl-4">
                                {childChildren.map((grandChild) => (
                                  <Link
                                    key={grandChild.href || grandChild.key}
                                    href={grandChild.href || '#'}
                                    className="block py-2.5 text-[14px] text-grey-light transition-colors hover:text-primary"
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setActiveDropdown(null);
                                      setActiveMobileSubDropdown(null);
                                    }}
                                  >
                                    {t(grandChild.key)}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-3 text-[15px] text-grey transition-colors hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t(child.key)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="block border-b border-grey-100 py-4 text-base font-medium text-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.key)}
                </Link>
              )}
            </div>
          ))}

          <div
            className={cn(
              'mt-6 transition-all duration-300 ease-out',
              mobileOpen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-3 opacity-0'
            )}
            style={{ transitionDelay: mobileOpen ? `${mainNav.length * 50}ms` : '0ms' }}
          >
            <Link
              href={siteConfig.links.donate}
              className="block bg-lime py-3 text-center text-[15px] font-bold text-lime-foreground transition-all hover:bg-lime-600"
              onClick={() => setMobileOpen(false)}
            >
              {t('support')}
            </Link>
          </div>
        </nav>
      </div>

    </header>
  );
}