import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col justify-center py-24">
      <p className="mb-4 text-sm font-medium text-grey">404</p>
      <h1 className="mb-4 text-display-sm md:text-display">Page not found</h1>
      <p className="mb-8 max-w-lg text-body text-grey">
        The page you are looking for might have been moved or does not exist.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/"
          className="bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
        >
          Go home
        </Link>
        <Link
          href="/programs"
          className="border-2 border-lime px-6 py-3 text-sm font-semibold transition-all hover:bg-lime hover:text-lime-foreground"
        >
          View programs
        </Link>
      </div>
    </div>
  );
}
