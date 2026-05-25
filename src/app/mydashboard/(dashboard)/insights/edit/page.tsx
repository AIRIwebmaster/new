'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const TiptapEditor = dynamic(
  () => import('@/components/editor/tiptap-editor').then((m) => ({ default: m.TiptapEditor })),
  {
    ssr: false,
    loading: () => <div className="h-[400px] animate-pulse border border-grey-200 bg-grey-100" />,
  }
);

interface InsightForm {
  headline: string;
  slug: string;
  excerpt: string;
  content: string;
  published_date: string;
  visible: boolean;
}

const emptyForm: InsightForm = {
  headline: '',
  slug: '',
  excerpt: '',
  content: '',
  published_date: new Date().toISOString().split('T')[0],
  visible: true,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function InsightEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [form, setForm] = useState<InsightForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!editId);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (!editId) return;
    fetch('/api/admin/insights')
      .then((r) => r.json())
      .then((insights) => {
        const insight = insights.find((i: { id: number }) => i.id === Number(editId));
        if (insight) {
          setForm({
            headline: insight.headline,
            slug: insight.slug || slugify(insight.headline),
            excerpt: insight.excerpt || '',
            content: insight.content || '',
            published_date: insight.published_date?.split('T')[0] || '',
            visible: insight.visible,
          });
          setAutoSlug(false);
        }
        setLoading(false);
      });
  }, [editId]);

  const updateHeadline = useCallback(
    (headline: string) => {
      setForm((prev) => ({
        ...prev,
        headline,
        ...(autoSlug ? { slug: slugify(headline) } : {}),
      }));
    },
    [autoSlug]
  );

  const updateSlug = useCallback((slug: string) => {
    setAutoSlug(false);
    setForm((prev) => ({ ...prev, slug: slugify(slug) }));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const method = editId ? 'PUT' : 'POST';
    const payload = editId
      ? { ...form, id: Number(editId), href: `/insights/${form.slug}` }
      : { ...form, href: `/insights/${form.slug}` };

    try {
      const res = await fetch('/api/admin/insights', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save.');
        setSaving(false);
        return;
      }

      router.push('/mydashboard/insights');
    } catch {
      setError('Something went wrong.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse bg-grey-100" />
        <div className="h-12 animate-pulse border border-grey-200 bg-grey-100" />
        <div className="h-[400px] animate-pulse border border-grey-200 bg-grey-100" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/mydashboard/insights"
            className="mb-2 inline-flex items-center gap-1 text-[13px] text-grey hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to insights
          </Link>
          <h1 className="text-h3 text-foreground">{editId ? 'Edit Insight' : 'New Insight'}</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Main column */}
          <div className="space-y-5">
            {/* Headline */}
            <div>
              <input
                type="text"
                required
                maxLength={500}
                value={form.headline}
                onChange={(e) => updateHeadline(e.target.value)}
                placeholder="Article headline"
                className="w-full border-0 border-b border-grey-200 bg-transparent px-0 py-3 text-h3 font-bold text-foreground placeholder:text-grey-light focus:border-primary focus:outline-none focus:ring-0"
              />
            </div>

            {/* Slug */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-grey">/insights/</span>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => updateSlug(e.target.value)}
                className="flex-1 border border-grey-200 bg-white px-3 py-1.5 text-[13px] text-foreground focus:border-primary focus:outline-none"
                placeholder="article-slug"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                Excerpt
              </label>
              <textarea
                maxLength={500}
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full border border-grey-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                placeholder="Brief summary shown in article listings"
              />
            </div>

            {/* Editor */}
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                Content
              </label>
              <TiptapEditor
                content={form.content}
                onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                placeholder="Write your article content here..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish settings */}
            <div className="border border-grey-200 bg-white p-5">
              <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-grey-light">
                Publish
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.published_date}
                    onChange={(e) => setForm({ ...form, published_date: e.target.value })}
                    className="w-full border border-grey-200 bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-[13px] font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                    className="h-4 w-4 accent-primary"
                  />
                  Visible on site
                </label>

              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editId ? 'Update' : 'Publish'}
                </button>
                <Link
                  href="/mydashboard/insights"
                  className="border border-grey-200 bg-white px-4 py-2.5 text-center text-[13px] font-medium text-grey transition-colors hover:bg-grey-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function InsightEditorPage() {
  return (
    <Suspense fallback={<div className="h-[400px] animate-pulse bg-grey-100" />}>
      <InsightEditorInner />
    </Suspense>
  );
}
