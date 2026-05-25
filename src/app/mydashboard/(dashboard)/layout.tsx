'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CircleDot, LogOut, X, ExternalLink } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/mydashboard' },
  { label: 'Impact Stats', href: '/mydashboard/impacts' },
  { label: 'Insights', href: '/mydashboard/insights' },
  { label: 'Submissions', href: '/mydashboard/submissions' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === '/mydashboard') return pathname === '/mydashboard';
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/mydashboard/login';
  }

  return (
    <div className="flex min-h-screen bg-grey-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-grey-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b border-grey-200 px-5">
          <Link href="/mydashboard">
            <Image src="/images/logo.png" alt="AIRI" width={90} height={30} />
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded px-3 py-2.5 text-[13px] font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary/8 text-primary'
                      : 'text-grey hover:bg-grey-50 hover:text-foreground'
                  }`}
                >
                  <CircleDot className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-grey-200 px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50 hover:text-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]" />
          <aside
            className="absolute inset-y-0 left-0 w-[55%] max-w-[280px] border-r border-grey-200 bg-white shadow-xl animate-in slide-in-from-left duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between border-b border-grey-200 px-5">
              <Image src="/images/logo.png" alt="AIRI" width={90} height={30} />
              <button onClick={() => setMobileOpen(false)} className="text-grey hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-3 py-4">
              <ul className="space-y-0.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded px-3 py-2.5 text-[13px] font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary/8 text-primary'
                          : 'text-grey hover:bg-grey-50 hover:text-foreground'
                      }`}
                    >
                      <CircleDot className="h-[18px] w-[18px]" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-grey-200 px-3 py-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50 hover:text-foreground"
              >
                <LogOut className="h-[18px] w-[18px]" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-56">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-grey-200 bg-white px-5 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-grey hover:text-foreground lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 6h7.2" />
              <path strokeLinecap="round" d="M4 12h16" />
              <path strokeLinecap="round" d="M4 18h13.6" />
            </svg>
          </button>
          <Link href="/mydashboard" className="lg:hidden">
            <Image src="/images/logo.png" alt="AIRI" width={80} height={26} />
          </Link>
          <div className="flex-1" />
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[13px] text-grey transition-colors hover:text-foreground"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>

        {/* Admin footer */}
        <footer className="border-t border-grey-200 bg-white px-5 py-3 lg:px-8">
          <p className="text-center text-[12px] text-grey-light lg:text-right">
            V1.4 dashboard by{' '}
            <a
              href="https://github.com/DanielDallas"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-grey transition-colors hover:text-foreground"
            >
              THEDGIT
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
