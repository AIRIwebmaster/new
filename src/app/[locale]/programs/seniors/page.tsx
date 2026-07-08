import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SeniorsProgramContent } from '@/components/sections/SeniorsProgramContent';

export const metadata: Metadata = {
  title: 'AI for Seniors',
  description:
    'Accessible, jargon-free AI education for seniors — from using AI assistants to navigating digital services with confidence.',
};

export default async function SeniorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SeniorsProgramContent />;
}