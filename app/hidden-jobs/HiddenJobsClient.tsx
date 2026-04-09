'use client';

import { useMemo, useState } from 'react';
import type { HiddenJobOpeningClient } from '@/lib/hidden-jobs/types';
import { stripHtml, tiptapDocToPlainText } from '@/lib/hidden-jobs/tiptapPlainText';

function formatCTC(minCTC: number | null | undefined, maxCTC: number | null | undefined) {
  const min = typeof minCTC === 'number' ? minCTC : null;
  const max = typeof maxCTC === 'number' ? maxCTC : null;
  if (min == null && max == null) return '—';
  if (min != null && max != null) return `${min}L – ${max}L`;
  if (min != null) return `From ${min}L`;
  return `Up to ${max}L`;
}

function jobSummary(job: HiddenJobOpeningClient): string {
  const fromTipTap = tiptapDocToPlainText(job.newDescription ?? undefined);
  if (fromTipTap) return fromTipTap.slice(0, 280) + (fromTipTap.length > 280 ? '…' : '');
  const fromHtml = stripHtml(job.description ?? undefined);
  if (fromHtml) return fromHtml.slice(0, 280) + (fromHtml.length > 280 ? '…' : '');
  const alert = stripHtml(job.alertMessage ?? undefined);
  if (alert) return alert.slice(0, 280) + (alert.length > 280 ? '…' : '');
  return 'No description text.';
}

function locationLine(job: HiddenJobOpeningClient): string {
  const names = (job.JobLocations ?? []).map((l) => l.name).filter(Boolean);
  return names.length ? names.join(', ') : '—';
}

function trimStr(v: string | null | undefined): string {
  return (v ?? '').trim();
}

function contactSearchBlob(job: HiddenJobOpeningClient): string {
  const c = job.companyRecord;
  return [
    trimStr(c?.pocName),
    trimStr(c?.pocNumber),
    trimStr(c?.pocEmail),
    trimStr(job.companyPOCEmail),
  ].join(' ');
}

function contactPreviewLine(job: HiddenJobOpeningClient): string | null {
  const c = job.companyRecord;
  const parts: string[] = [];
  const name = trimStr(c?.pocName);
  const phone = trimStr(c?.pocNumber);
  const emailCo = trimStr(c?.pocEmail);
  const emailJob = trimStr(job.companyPOCEmail);
  const email = emailCo || emailJob;
  if (name) parts.push(name);
  if (phone) parts.push(phone);
  if (email) parts.push(email);
  return parts.length ? parts.join(' · ') : null;
}

type SortKey = 'company' | 'ctc' | 'expiry' | 'role';

export default function HiddenJobsClient({ jobs }: { jobs: HiddenJobOpeningClient[] }) {
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [locFilter, setLocFilter] = useState('All');
  const [sort, setSort] = useState<SortKey>('company');
  const [openId, setOpenId] = useState<number | null>(null);

  const roles = useMemo(() => {
    const s = new Set(jobs.map((j) => j.JobRole?.name).filter(Boolean) as string[]);
    return ['All', ...Array.from(s).sort()];
  }, [jobs]);

  const locations = useMemo(() => {
    const s = new Set<string>();
    jobs.forEach((j) => (j.JobLocations ?? []).forEach((l) => l.name && s.add(l.name)));
    return ['All', ...Array.from(s).sort()];
  }, [jobs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = jobs.filter((j) => {
      if (roleFilter !== 'All' && j.JobRole?.name !== roleFilter) return false;
      if (locFilter !== 'All') {
        const locs = (j.JobLocations ?? []).map((l) => l.name);
        if (!locs.includes(locFilter)) return false;
      }
      if (!needle) return true;
      const blob = [
        j.companyName,
        j.JobRole?.name,
        locationLine(j),
        jobSummary(j),
        String(j.id),
        contactSearchBlob(j),
      ]
        .join(' ')
        .toLowerCase();
      return blob.includes(needle);
    });

    list = [...list].sort((a, b) => {
      if (sort === 'company') return a.companyName.localeCompare(b.companyName);
      if (sort === 'role') return (a.JobRole?.name || '').localeCompare(b.JobRole?.name || '');
      if (sort === 'ctc') {
        const am = a.maxCTC ?? a.minCTC ?? 0;
        const bm = b.maxCTC ?? b.minCTC ?? 0;
        return bm - am;
      }
      const ae = a.expirationDateTime ? new Date(a.expirationDateTime).getTime() : 0;
      const be = b.expirationDateTime ? new Date(b.expirationDateTime).getTime() : 0;
      return be - ae;
    });

    return list;
  }, [jobs, q, roleFilter, locFilter, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative">
            <p className="inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wider uppercase mb-4">
              Reference board
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Hidden jobs
            </h1>
            <p className="mt-3 text-slate-300 max-w-2xl">
              Search and filter placement-style openings by company, role, location, and CTC. Replace{' '}
              <code className="text-cyan-200 bg-white/10 px-1 rounded">data/hidden-jobs.json</code> with your full
              API export when needed.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex-1 min-w-0">
            <label htmlFor="hj-q" className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Search
            </label>
            <input
              id="hj-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Company, role, location, ID…"
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-[1.2]">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Location</label>
              <select
                value={locFilter}
                onChange={(e) => setLocFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {locations.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="company">Company A–Z</option>
                <option value="role">Role A–Z</option>
                <option value="ctc">CTC (high first)</option>
                <option value="expiry">Closing date</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Showing <span className="font-extrabold text-slate-900">{filtered.length}</span> of{' '}
          <span className="font-extrabold text-slate-900">{jobs.length}</span>
        </p>

        <div className="grid gap-4">
          {filtered.map((job) => {
            const expanded = openId === job.id;
            const logo = job.companyRecord?.logo;
            const contactPreview = contactPreviewLine(job);
            return (
              <article
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(expanded ? null : job.id)}
                  className="w-full text-left p-5 flex flex-col sm:flex-row gap-4 sm:items-start"
                >
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- remote company logos from varied hosts
                      <img src={logo} alt="" className="object-contain w-full h-full p-1" />
                    ) : (
                      <span className="text-lg font-black text-slate-400">{job.companyName.slice(0, 1)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-500">#{job.id}</span>
                      {job.offersInternship ? (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          Internship path
                        </span>
                      ) : null}
                      {job.isProCompany ? (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-violet-100 text-violet-900">
                          Pro company
                        </span>
                      ) : null}
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{job.companyName}</h2>
                    <p className="text-sm text-primary font-bold mt-0.5">{job.JobRole?.name ?? 'Role TBD'}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1">
                        {locationLine(job)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-900 px-2.5 py-1">
                        {formatCTC(job.minCTC, job.maxCTC)}
                      </span>
                      {job.expirationDateTime ? (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1">
                          Until {new Date(job.expirationDateTime).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">{jobSummary(job)}</p>
                    {contactPreview ? (
                      <p className="mt-2 text-xs text-slate-600">
                        <span className="font-bold text-slate-500">Contact: </span>
                        <span className="break-all">{contactPreview}</span>
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs font-bold text-primary">{expanded ? 'Hide details ▴' : 'Show details ▾'}</p>
                  </div>
                </button>

                {expanded ? (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/80">
                    <div className="pt-4 grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Summary text</h3>
                        <p className="text-slate-700 whitespace-pre-wrap">{jobSummary(job)}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Meta</h3>
                        <ul className="text-slate-700 space-y-1">
                          <li>
                            <span className="font-semibold">YoE (field):</span> {job.yearsOfExperience ?? '—'}
                          </li>
                          <li>
                            <span className="font-semibold">Status code:</span> {job.status ?? '—'}
                          </li>
                          {job.offersInternship ? (
                            <li>
                              <span className="font-semibold">Internship:</span> {job.internshipDuration ?? '—'} mo · ₹
                              {job.internshipStipend ?? '—'}k stipend
                            </li>
                          ) : null}
                          {job.category ? (
                            <li>
                              <span className="font-semibold">Category:</span> {job.category}
                            </li>
                          ) : null}
                          {job.domain ? (
                            <li>
                              <span className="font-semibold">Domain:</span> {job.domain}
                            </li>
                          ) : null}
                          {job.size ? (
                            <li>
                              <span className="font-semibold">Size:</span> {job.size}
                            </li>
                          ) : null}
                        </ul>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Contact / POC</h3>
                        <ul className="text-slate-700 space-y-1.5">
                          {trimStr(job.companyRecord?.pocName) ? (
                            <li>
                              <span className="font-semibold">Name:</span> {trimStr(job.companyRecord?.pocName)}
                            </li>
                          ) : null}
                          {trimStr(job.companyRecord?.pocNumber) ? (
                            <li>
                              <span className="font-semibold">Phone:</span>{' '}
                              <a
                                href={`tel:${trimStr(job.companyRecord?.pocNumber).replace(/\s+/g, '')}`}
                                className="text-primary font-semibold underline-offset-2 hover:underline"
                              >
                                {trimStr(job.companyRecord?.pocNumber)}
                              </a>
                            </li>
                          ) : null}
                          {trimStr(job.companyRecord?.pocEmail) ? (
                            <li>
                              <span className="font-semibold">Email (company):</span>{' '}
                              <a
                                href={`mailto:${trimStr(job.companyRecord?.pocEmail)}`}
                                className="text-primary font-semibold underline-offset-2 hover:underline break-all"
                              >
                                {trimStr(job.companyRecord?.pocEmail)}
                              </a>
                            </li>
                          ) : null}
                          {trimStr(job.companyPOCEmail) &&
                          (!trimStr(job.companyRecord?.pocEmail) ||
                            trimStr(job.companyPOCEmail).toLowerCase() !==
                              trimStr(job.companyRecord?.pocEmail).toLowerCase()) ? (
                            <li>
                              <span className="font-semibold">
                                {trimStr(job.companyRecord?.pocEmail) ? 'POC email (opening)' : 'POC email'}:
                              </span>{' '}
                              <a
                                href={`mailto:${trimStr(job.companyPOCEmail)}`}
                                className="text-primary font-semibold underline-offset-2 hover:underline break-all"
                              >
                                {trimStr(job.companyPOCEmail)}
                              </a>
                            </li>
                          ) : null}
                          {!trimStr(job.companyRecord?.pocName) &&
                          !trimStr(job.companyRecord?.pocNumber) &&
                          !trimStr(job.companyRecord?.pocEmail) &&
                          !trimStr(job.companyPOCEmail) ? (
                            <li className="text-slate-500">No contact fields in data.</li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                    {job.description ? (
                      <div className="mt-4">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">HTML description</h3>
                        <div
                          className="prose prose-sm max-w-none text-slate-800 bg-white border border-slate-200 rounded-xl p-4 max-h-72 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                      </div>
                    ) : null}
                    {job.alertMessage ? (
                      <div className="mt-4">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Alert / notes</h3>
                        <div
                          className="prose prose-sm max-w-none text-slate-800 bg-amber-50 border border-amber-200 rounded-xl p-4 max-h-48 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: job.alertMessage }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No rows match your filters. Clear search or widen role / location.
          </div>
        ) : null}
      </section>
    </div>
  );
}
