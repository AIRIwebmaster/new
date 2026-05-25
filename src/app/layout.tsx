import type { Metadata } from 'next';
import { Saira } from 'next/font/google';
import './globals.css';

const saira = Saira({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-saira',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'AIRI Foundation | AI Literacy for Everyone',
    template: '%s | AIRI Foundation',
  },
  description:
    'Because AI impacts everyone, everyone deserves to understand and use it better. Democratizing AI education across Canada through community-centered programs.',
  keywords: [
    'AI education',
    'AI literacy',
    'artificial intelligence training',
    'Canada',
    'community education',
    'AIRI Foundation',
    'AI workshops',
    'digital literacy',
  ],
  authors: [{ name: 'AIRI Foundation' }],
  metadataBase: new URL('https://airifoundation.org'),
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  openGraph: {
    title: 'AIRI Foundation | AI Literacy for Everyone',
    description:
      'Breaking barriers to AI education across Canada. From boardrooms to community centers.',
    url: 'https://airifoundation.org',
    siteName: 'AIRI Foundation',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIRI Foundation | AI Literacy for Everyone',
    description:
      'Breaking barriers to AI education across Canada. From boardrooms to community centers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={saira.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
