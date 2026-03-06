'use client';

import { useEffect, useMemo, useState } from 'react';

type LeadItem = {
  _id: string;
  email: string;
  source: string;
  tags?: string[];
  pagePath?: string;
  referrer?: string;
  submissionCount?: number;
  lastSubmittedAt?: string;
  createdAt?: string;
};

export default function SaleModalLeadsAdminPage() {
  const [items, setItems] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [source, setSource] = useState('sale-modal');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);

  const load = async (opts?: { page?: number; q?: string; source?: string }) => {
    const nextPage = opts?.page ?? page;
    const nextQ = opts?.q ?? q;
    const nextSource = opts?.source ?? source;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(nextPage));
      params.set('limit', String(limit));
      if (nextQ.trim()) params.set('q', nextQ.trim());
      if (nextSource.trim()) params.set('source', nextSource.trim());

      const res = await fetch(`/api/admin/sale-modal-leads?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(typeof data.total === 'number' ? data.total : 0);
    } catch (e) {
      console.error('Failed to load sale modal leads', e);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sale Modal Leads</h1>
          <p className="text-sm text-gray-600">Captured emails from the sale modal submit button.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/sale-modal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">open_in_new</span>
            Preview Modal
          </a>
          <button
            type="button"
            onClick={() => load({ page })}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Search email</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. gmail.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">Source</label>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="sale-modal"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                load({ page: 1, q, source });
              }}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setQ('');
                setSource('sale-modal');
                setPage(1);
                load({ page: 1, q: '', source: 'sale-modal' });
              }}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold text-gray-900">{total}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Tags</th>
                <th className="py-2 pr-4">Page</th>
                <th className="py-2 pr-4">Count</th>
                <th className="py-2 pr-4">Last Submit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={6}>
                    No leads found.
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it._id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4 font-medium text-gray-900">{it.email}</td>
                    <td className="py-2 pr-4 text-gray-700">{it.source}</td>
                    <td className="py-2 pr-4 text-gray-700">{(it.tags || []).join(', ')}</td>
                    <td className="py-2 pr-4 text-gray-700">{it.pagePath || '-'}</td>
                    <td className="py-2 pr-4 text-gray-700">{it.submissionCount ?? 1}</td>
                    <td className="py-2 pr-4 text-gray-700">
                      {it.lastSubmittedAt ? new Date(it.lastSubmittedAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                load({ page: next });
              }}
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => {
                const next = Math.min(totalPages, page + 1);
                setPage(next);
                load({ page: next });
              }}
              className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


