'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { footerNav } from '@/config/navigation';
// import { Turnstile } from '@/components/ui/turnstile';
import { Linkedin, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tForms = useTranslations('forms');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch {
      setStatus('error');
      setMessage(tForms('errorMessage'));
    }
  };

  return (
    <footer className="border-t border-grey-200 bg-grey-50" role="contentinfo">
      {/* Newsletter */}
      <div className="border-b border-grey-200">
        <div className="container py-16">
          <div className="flex items-start justify-between gap-12">
            <div className="max-w-lg">
              <h2 className="mb-2 text-h3 text-foreground">{tForms('stayConnected')}</h2>
              <p className="mb-6 text-body text-grey">
                {tForms('newsletterText')}
              </p>
              {status === 'success' ? (
                <p className="text-sm font-medium text-primary">{message}</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      placeholder={tForms('emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 border border-grey-200 bg-white px-4 py-3 text-sm text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none"
                      aria-label={tForms('email')}
                    />
                    <button
                      type="submit"
                      className="bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                    >
                      {status === 'loading' ? tForms('submitting') : tForms('submit')}
                    </button>
                  </div>
                  
                  {status === 'error' && (
                    <p className="text-xs text-destructive">{message}</p>
                  )}
                </form>
              )}
            </div>
            {/* <div className="hidden gap-3 lg:flex" aria-hidden="true">
              <div className="h-28 w-28 rounded-lg bg-accent-50" />
              <div className="flex flex-col gap-3">
                <div className="h-[52px] w-20 rounded-lg bg-lime-50" />
                <div className="h-[52px] w-20 rounded-lg bg-primary-50" />
              </div>
              <div className="h-28 w-16 rounded-lg bg-accent-100" />
            </div> */}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/logo.png"
                alt="AIRI Foundation"
                width={100}
                height={34}
                className="h-9 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-grey">
              {t('description')}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Programs</h3>
            <ul className="space-y-2">
              {footerNav.programs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-grey transition-colors hover:text-primary">
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">{t('opportunities')}</h3>
            <ul className="space-y-2">
              {footerNav.opportunities.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-grey transition-colors hover:text-primary">
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">{t('contactUs')}</h3>
            <ul className="space-y-2 text-sm text-grey">
              <li>
                <a href={`mailto:${siteConfig.emails.contact}`} className="hover:text-foreground">
                  {siteConfig.emails.contact}
                </a>
              </li> 
              <li>
                {siteConfig.address.street},
                {siteConfig.address.city}, {siteConfig.address.province},  &nbsp; {siteConfig.address.postalCode}
              </li>
            </ul>
            <div className="mt-4 flex gap-4">
              {[
                { href: siteConfig.links.linkedin, label: 'LinkedIn', Icon: Linkedin },
                { href: siteConfig.links.instagram, label: 'Instagram', Icon: Instagram },
                { href: siteConfig.links.facebook, label: 'Facebook', Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-grey hover:text-foreground"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      {/* <div className="border-t border-grey-200">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-grey sm:flex-row">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-4">
              <Link href="/about" className="font-medium hover:text-foreground">{t('about')}</Link>
              <Link href="/contact" className="font-medium hover:text-foreground">{t('contact')}</Link>
              <Link href="/programs" className="font-medium hover:text-foreground">Solutions</Link>
            </div>
            <span className="hidden text-grey-200 sm:inline">·</span>
            <p>{t('builtBy')} <a href="https://thedgit.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary">THEDGIT</a></p>
          </div>
        </div>
      </div> */}
    </footer>
  );
}
