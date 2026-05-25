'use client';

import { useEffect, useState, useCallback } from 'react';
import { Turnstile } from '@/components/ui/turnstile';

interface ImpactStat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
  featured: boolean;
  description: string;
}

const emptyForm = {
  label: '',
  value: 0,
  suffix: '',
  sort_order: 0,
  featured: false,
  description: '',
};

export default function ImpactsPage() {
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ImpactStat | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ImpactStat | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  async function loadStats() {
    const res = await fetch('/api/admin/impacts');
    const data = await res.json();
    setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    loadStats();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
  }

  function openEdit(stat: ImpactStat) {
    setEditing(stat);
    setForm({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      sort_order: stat.sort_order,
      featured: stat.featured,
      description: stat.description,
    });
    setShowForm(true);
    setError('');
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const method = editing ? 'PUT' : 'POST';
    const payload = editing
      ? { ...form, id: editing.id, turnstileToken }
      : { ...form, turnstileToken };

    try {
      const res = await fetch('/api/admin/impacts', {
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

      await loadStats();
      closeForm();
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  function closeDeleteDialog() {
    setDeleteTarget(null);
    setDeleteConfirmText('');
  }

  async function confirmDelete() {
    if (!deleteTarget || deleteConfirmText !== 'DELETE') return;
    await fetch('/api/admin/impacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    closeDeleteDialog();
    await loadStats();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-h3 text-foreground">Impact Stats</h1>
          <p className="text-sm text-grey">Manage the numbers shown on the impact section.</p>
        </div>
        <button
          onClick={openNew}
          className="bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600"
        >
          Add stat
        </button>
      </div>

      {/* Stats table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 animate-pulse border border-grey-200 bg-grey-100" />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <div className="border border-grey-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-grey">No impact stats yet. Add your first one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey-200 text-[13px] font-semibold text-grey-light">
                <th className="pb-3 pr-4">Label</th>
                <th className="pb-3 pr-4">Value</th>
                <th className="hidden pb-3 pr-4 sm:table-cell">Suffix</th>
                <th className="hidden pb-3 pr-4 md:table-cell">Order</th>
                <th className="hidden pb-3 pr-4 md:table-cell">Featured</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.id} className="border-b border-grey-200 last:border-0">
                  <td className="py-3.5 pr-4 font-medium text-foreground">{stat.label}</td>
                  <td className="py-3.5 pr-4 text-foreground">
                    {stat.value.toLocaleString()}
                    {stat.suffix}
                  </td>
                  <td className="hidden py-3.5 pr-4 text-grey sm:table-cell">
                    {stat.suffix || '—'}
                  </td>
                  <td className="hidden py-3.5 pr-4 text-grey md:table-cell">{stat.sort_order}</td>
                  <td className="hidden py-3.5 pr-4 md:table-cell">
                    {stat.featured && (
                      <span className="inline-block bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => openEdit(stat)}
                      className="mr-3 text-[13px] font-medium text-primary hover:text-primary-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(stat);
                        setDeleteConfirmText('');
                      }}
                      className="text-[13px] font-medium text-destructive hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-5">
          <div className="w-full max-w-md border border-grey-200 bg-white p-6">
            <h2 className="mb-5 text-h4 text-foreground">
              {editing ? 'Edit stat' : 'Add new stat'}
            </h2>

            {error && (
              <div className="mb-4 border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Label
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full border border-grey-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="e.g. People trained"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Description
                </label>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-grey-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Brief description for the stat card"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                    Value
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) || 0 })}
                    className="w-full border border-grey-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                    Suffix
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={form.suffix}
                    onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                    className="w-full border border-grey-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g. +"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                    Sort order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                    className="w-full border border-grey-200 bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-foreground">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="h-4 w-4 accent-primary"
                    />
                    Featured card
                  </label>
                </div>
              </div>

              <Turnstile onVerify={handleVerify} onExpire={handleExpire} />

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editing ? 'Save changes' : 'Add stat'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="border border-grey-200 bg-white px-4 py-2.5 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
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
            <h2 className="mb-2 text-h4 text-foreground">Delete stat</h2>
            <p className="mb-1 text-sm text-grey">You are about to delete:</p>
            <p className="mb-4 text-sm font-medium text-foreground">
              &ldquo;{deleteTarget.label}&rdquo;
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
