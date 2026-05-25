'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const formTypes = [
  { key: 'contact', label: 'Contact' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'volunteer', label: 'Volunteer' },
  { key: 'workshop', label: 'Workshop' },
  { key: 'codeai', label: 'Code & AI' },
  { key: 'business', label: 'Business' },
  { key: 'community', label: 'Community' },
];

interface SubmissionData {
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  pages: number;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return new Date(value).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return String(value);
}

function friendlyColumnName(col: string): string {
  return col
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Id', 'ID')
    .replace('Email', 'Email')
    .replace('Created At', 'Date');
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show first page
  pages.push(1);

  if (current <= 3) {
    // Near the start: 1 2 3 4 ... last
    pages.push(2, 3, 4, 'ellipsis', total);
  } else if (current >= total - 2) {
    // Near the end: 1 ... n-3 n-2 n-1 n
    pages.push('ellipsis', total - 3, total - 2, total - 1, total);
  } else {
    // Middle: 1 ... current-1 current current+1 ... last
    pages.push('ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }

  return pages;
}

function Pagination({
  page,
  pages,
  onPageChange,
}: {
  page: number;
  pages: number;
  onPageChange: (p: number) => void;
}) {
  const pageNumbers = getPageNumbers(page, pages);

  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="inline-flex items-center gap-1.5 border border-grey-200 bg-white px-3 py-2 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 sm:px-3.5"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((item, idx) =>
          item === 'ellipsis' ? (
            <span key={`e-${idx}`} className="flex h-8 w-6 items-center justify-center text-[13px] text-grey-light select-none">
              &hellip;
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`flex h-8 min-w-[2rem] items-center justify-center rounded text-[13px] font-medium transition-colors ${
                item === page
                  ? 'bg-primary text-white'
                  : 'text-grey hover:bg-grey-100 hover:text-foreground'
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page >= pages}
        className="inline-flex items-center gap-1.5 border border-grey-200 bg-white px-3 py-2 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 sm:px-3.5"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default function SubmissionsPage() {
  const [activeType, setActiveType] = useState('contact');
  const [data, setData] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setExpandedRow(null);
    fetch(`/api/admin/submissions?type=${activeType}&page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [activeType, page]);

  function switchType(key: string) {
    setActiveType(key);
    setPage(1);
  }

  async function handleExportCSV() {
    setExporting(true);
    try {
      const res = await fetch(`/api/admin/submissions?type=${activeType}&export=true`);
      const json = await res.json();
      const rows = json.rows as Record<string, unknown>[];
      if (!rows || rows.length === 0) {
        setExporting(false);
        return;
      }

      const cols = Object.keys(rows[0]).filter((k) => k !== 'password_hash');
      const escapeCSV = (val: unknown): string => {
        const str = val === null || val === undefined ? '' : String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const header = cols.map((c) => escapeCSV(friendlyColumnName(c))).join(',');
      const body = rows.map((row) => cols.map((c) => escapeCSV(row[c])).join(',')).join('\n');
      const csv = `${header}\n${body}`;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeType}-submissions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent fail
    } finally {
      setExporting(false);
    }
  }

  const columns = data?.rows?.[0]
    ? Object.keys(data.rows[0]).filter((k) => k !== 'id' && k !== 'password_hash')
    : [];

  const visibleColumns = columns.slice(0, 4);
  const hiddenColumns = columns.slice(4);

  return (
    <div>
      <h1 className="mb-1 text-h3 text-foreground">Submissions</h1>
      <p className="mb-6 text-sm text-grey">View data from all forms across the site.</p>

      {/* Type tabs + export */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        {formTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => switchType(type.key)}
            className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${
              activeType === type.key
                ? 'bg-primary text-white'
                : 'border border-grey-200 bg-white text-grey hover:bg-grey-50 hover:text-foreground'
            }`}
          >
            {type.label}
          </button>
        ))}
        <button
          onClick={handleExportCSV}
          disabled={exporting || loading || !data || data.rows.length === 0}
          className="ml-auto inline-flex items-center gap-1.5 border border-grey-200 bg-white px-3 py-1.5 text-[13px] font-medium text-grey transition-colors hover:bg-grey-50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Data */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 animate-pulse border border-grey-200 bg-grey-100" />
          ))}
        </div>
      ) : !data || data.rows.length === 0 ? (
        <div className="border border-grey-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-grey">No submissions yet for this form type.</p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-[13px] text-grey">
            {data.total} total &middot; Page {data.page} of {data.pages}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-grey-200 text-[13px] font-semibold text-grey-light">
                  {visibleColumns.map((col) => (
                    <th key={col} className="pb-3 pr-4">{friendlyColumnName(col)}</th>
                  ))}
                  {hiddenColumns.length > 0 && <th className="pb-3" />}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="border-b border-grey-200 last:border-0">
                      {visibleColumns.map((col) => (
                        <td key={col} className="max-w-[200px] truncate py-3 pr-4 text-foreground">
                          {formatValue(row[col])}
                        </td>
                      ))}
                      {hiddenColumns.length > 0 && (
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                            className="text-[13px] font-medium text-primary hover:text-primary-600"
                          >
                            {expandedRow === idx ? 'Less' : 'More'}
                          </button>
                        </td>
                      )}
                    </tr>
                    {expandedRow === idx && hiddenColumns.length > 0 && (
                      <tr className="border-b border-grey-200 bg-grey-50">
                        <td colSpan={visibleColumns.length + 1} className="px-4 py-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            {hiddenColumns.map((col) => (
                              <div key={col}>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-grey-light">
                                  {friendlyColumnName(col)}
                                </p>
                                <p className="mt-0.5 text-sm text-foreground">{formatValue(row[col])}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {data.rows.map((row, idx) => (
              <div key={idx} className="border border-grey-200 bg-white p-4">
                {columns.map((col) => (
                  <div key={col} className="mb-2 last:mb-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-grey-light">
                      {friendlyColumnName(col)}
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{formatValue(row[col])}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <Pagination page={page} pages={data.pages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
