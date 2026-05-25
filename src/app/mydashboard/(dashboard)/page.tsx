'use client';

import { useEffect, useState } from 'react';

interface Counts {
  contact: number;
  newsletter: number;
  volunteer: number;
  workshop: number;
  codeai: number;
  business: number;
  community: number;
}

interface ImpactStat {
  id: number;
  label: string;
  value: number;
  suffix: string;
}

const submissionCards = [
  { key: 'contact', label: 'Contact Messages' },
  { key: 'newsletter', label: 'Newsletter Subscribers' },
  { key: 'volunteer', label: 'Volunteer Applications' },
  { key: 'workshop', label: 'Workshop Bookings' },
  { key: 'codeai', label: 'Code & AI Registrations' },
  { key: 'business', label: 'Business Inquiries' },
  { key: 'community', label: 'Community Inquiries' },
];

export default function DashboardOverview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [impacts, setImpacts] = useState<ImpactStat[]>([]);

  useEffect(() => {
    fetch('/api/admin/submissions?type=counts')
      .then((r) => r.json())
      .then(setCounts);
    fetch('/api/admin/impacts')
      .then((r) => r.json())
      .then(setImpacts);
  }, []);

  const totalSubmissions = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  return (
    <div>
      <h1 className="mb-1 text-h3 text-foreground">Dashboard</h1>
      <p className="mb-8 text-sm text-grey">Overview of AIRI&apos;s activity.</p>

      {/* Impact stats */}
      {impacts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-grey-light">
            Impact Stats
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {impacts.map((stat) => (
              <div key={stat.id} className="border border-grey-200 bg-white p-4">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-[13px] text-grey">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Submission counts */}
      <section>
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-grey-light">
          Form Submissions
        </h2>
        {!counts ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse border border-grey-200 bg-grey-100" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-3 border border-grey-200 bg-white p-4">
              <p className="text-2xl font-bold text-foreground">
                {totalSubmissions.toLocaleString()}
              </p>
              <p className="mt-1 text-[13px] text-grey">Total submissions across all forms</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {submissionCards.map((card) => (
                <div key={card.key} className="border border-grey-200 bg-white p-4">
                  <p className="text-2xl font-bold text-foreground">
                    {(counts[card.key as keyof Counts] ?? 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-[13px] text-grey">{card.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
