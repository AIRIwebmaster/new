'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Insight {
  id: number;
  headline: string;
  slug: string;
  href: string;
  excerpt: string;
  published_date: string;
  visible: boolean;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Insight | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  async function loadInsights() {
    const res = await fetch('/api/admin/insights');
    const data = await res.json();
    setInsights(data);
    setLoading(false);
  }

  useEffect(() => {
    loadInsights();
  }, []);

  function closeDeleteDialog() {
    setDeleteTarget(null);
    setDeleteConfirmText('');
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteConfirmText !== 'DELETE') return;
    await fetch('/api/admin/insights', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    closeDeleteDialog();
    await loadInsights();
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-h3 text-foreground">Insights</h1>
          <p className="text-sm text-grey">Manage insights and articles.</p>
        </div>
        <Link
          href="/mydashboard/insights/edit"
          className="bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600"
        >
          New Insight
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse border border-grey-200 bg-grey-100" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="border border-grey-200 bg-white px-6 py-12 text-center">
          <p className="mb-3 text-sm text-grey">No Insight yet.</p>
          <Link
            href="/mydashboard/insights/edit"
            className="inline-block bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Write your first Insight
          </Link>
        </div>
      ) : (
        <div className="space-y-0 border-t border-grey-200">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="flex flex-col gap-3 border-b border-grey-200 bg-white px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/mydashboard/insights/edit?id=${insight.id}`}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {insight.headline}
                  </Link>
                  {!insight.visible && (
                    <span className="inline-block flex-shrink-0 border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                      Draft
                    </span>
                  )}
                </div>
                {insight.excerpt && (
                  <p className="mt-1 line-clamp-1 text-[13px] text-grey">{insight.excerpt}</p>
                )}
                <p className="mt-1 text-[12px] text-grey-light">
                  {formatDate(insight.published_date)}
                  {insight.slug && (
                    <>
                      {' '}
                      &middot; <span className="font-mono">/insights/{insight.slug}</span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex gap-3 sm:flex-shrink-0 sm:pt-0.5">
                <Link
                  href={`/mydashboard/insights/edit?id=${insight.id}`}
                  className="text-[13px] font-medium text-primary hover:text-primary-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setDeleteTarget(insight);
                    setDeleteConfirmText('');
                  }}
                  className="text-[13px] font-medium text-destructive hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-5"
          onClick={closeDeleteDialog}
        >
          <div
            className="w-full max-w-sm border border-grey-200 bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-h4 text-foreground">Delete article</h2>
            <p className="mb-1 text-sm text-grey">You are about to delete:</p>
            <p className="mb-4 text-sm font-medium text-foreground">
              &ldquo;{deleteTarget.headline}&rdquo;
            </p>
            <p className="mb-4 text-sm text-grey">
              This action cannot be undone. Type{' '}
              <span className="font-semibold text-destructive">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="mb-4 w-full border border-grey-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-destructive focus:outline-none"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 bg-destructive px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-40"
              >
                Delete permanently
              </button>
              <button
                type="button"
                onClick={closeDeleteDialog}
                className="border border-grey-200 bg-white px-4 py-2.5 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
