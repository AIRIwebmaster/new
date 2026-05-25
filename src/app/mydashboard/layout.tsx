import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | AIRI Foundation',
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
