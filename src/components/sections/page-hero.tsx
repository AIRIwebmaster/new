import { Link } from '@/i18n/routing';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="hero-pixels" aria-hidden="true" />
      <div className="container relative z-10 py-20 md:py-28">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="max-w-3xl text-display-sm font-bold text-white md:text-display">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-body-lg text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
