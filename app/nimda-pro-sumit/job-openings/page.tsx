'use client';

import { useEffect, useMemo, useState } from 'react';

type CareerJob = {
  _id?: string;
  id: string;
  title: string;
  slug?: string;
  domain: string;
  companyName: string;
  companyEmail?: string;
  location?: string;
  description?: string;
  problemSolvingRequirement?: string;
  minCTC?: number | null;
  maxCTC?: number | null;
  expirationDateTime?: string | null; // ISO
  published: boolean;
};

type JobApplication = {
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  coverLetter?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: "submitted" | "shortlisted" | "rejected";
  domainSnapshot?: string;
  createdAt?: string;
};

function formatDateInput(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  // yyyy-MM-ddThh:mm for datetime-local
  return d.toISOString().slice(0, 16);
}

export default function JobOpeningsAdminPage() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [appsJobId, setAppsJobId] = useState<string | null>(null);
  const [appsLoading, setAppsLoading] = useState(false);
  const [apps, setApps] = useState<JobApplication[]>([]);

  const [form, setForm] = useState({
    title: '',
    domain: '',
    companyName: '',
    companyEmail: '',
    location: '',
    description: '',
    problemSolvingRequirement: '',
    minCTC: '',
    maxCTC: '',
    expirationDateTime: '',
    published: true,
  });

  const domains = useMemo(() => {
    const s = new Set(jobs.map((j) => j.domain).filter(Boolean));
    return Array.from(s);
  }, [jobs]);

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/career-jobs', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const mapped: CareerJob[] = (Array.isArray(data) ? data : []).map((j: any) => ({
        id: j._id?.toString?.() || j.id || '',
        title: j.title,
        slug: j.slug,
        domain: j.domain,
        companyName: j.companyName,
        companyEmail: j.companyEmail || undefined,
        location: j.location || undefined,
        description: j.description || undefined,
        problemSolvingRequirement: j.problemSolvingRequirement || undefined,
        minCTC: j.minCTC ?? null,
        maxCTC: j.maxCTC ?? null,
        expirationDateTime: j.expirationDateTime ? new Date(j.expirationDateTime).toISOString() : null,
        published: Boolean(j.published),
      }));

      setJobs(mapped.filter((j) => j.id));
    } catch (e: any) {
      setJobs([]);
      setMessage(e?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createJob = async () => {
    setMessage(null);
    if (!form.title.trim() || !form.domain.trim() || !form.companyName.trim()) {
      setMessage('title, domain, and companyName are required');
      return;
    }

    const minCTC = form.minCTC.trim() ? Number(form.minCTC) : undefined;
    const maxCTC = form.maxCTC.trim() ? Number(form.maxCTC) : undefined;
    const exp = form.expirationDateTime.trim() ? new Date(form.expirationDateTime) : undefined;

    try {
      const res = await fetch('/api/admin/career-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          domain: form.domain.trim(),
          companyName: form.companyName.trim(),
          companyEmail: form.companyEmail.trim() || undefined,
          location: form.location.trim() || undefined,
          description: form.description.trim() || undefined,
          problemSolvingRequirement: form.problemSolvingRequirement.trim() || undefined,
          minCTC: typeof minCTC === 'number' && !Number.isNaN(minCTC) ? minCTC : undefined,
          maxCTC: typeof maxCTC === 'number' && !Number.isNaN(maxCTC) ? maxCTC : undefined,
          expirationDateTime: exp && !Number.isNaN(exp.getTime()) ? exp : undefined,
          published: form.published,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      setForm({
        title: '',
        domain: '',
        companyName: '',
        companyEmail: '',
        location: '',
        description: '',
        problemSolvingRequirement: '',
        minCTC: '',
        maxCTC: '',
        expirationDateTime: '',
        published: true,
      });

      await load();
      setMessage('Job created successfully.');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to create job');
    }
  };

  const removeJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/career-jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
      setMessage('Job deleted.');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to delete job');
    }
  };

  const loadApplications = async (jobId: string) => {
    setAppsJobId(jobId);
    setAppsLoading(true);
    setApps([]);
    try {
      const res = await fetch(`/api/admin/career-jobs/${jobId}/applications`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setApps([]);
      setMessage(e?.message || 'Failed to load applications');
    } finally {
      setAppsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career Job Openings</h1>
          <p className="text-sm text-slate-600 mt-1">
            Admin can post jobs and they will appear instantly on the public <span className="font-bold">/careers</span> page.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-slate-200 font-bold text-sm hover:bg-slate-50 disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {message && <div className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl">{message}</div>}

      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Create Job</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1 text-sm">
            <span className="block font-semibold text-slate-700">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              placeholder="Frontend Engineer"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="block font-semibold text-slate-700">Domain</span>
            <input
              value={form.domain}
              onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              placeholder="Frontend / Backend / MERN"
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="block font-semibold text-slate-700">Company Name</span>
            <input
              value={form.companyName}
              onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              placeholder="Company Pvt Ltd"
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="block font-semibold text-slate-700">Company Email (optional)</span>
            <input
              value={form.companyEmail}
              onChange={(e) => setForm((p) => ({ ...p, companyEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              placeholder="hr@company.com"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="block font-semibold text-slate-700">Location (optional)</span>
            <input
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              placeholder="Noida / WFH"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1 text-sm">
              <span className="block font-semibold text-slate-700">Min CTC (LPA)</span>
              <input
                value={form.minCTC}
                onChange={(e) => setForm((p) => ({ ...p, minCTC: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                placeholder="4"
                inputMode="decimal"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="block font-semibold text-slate-700">Max CTC (LPA)</span>
              <input
                value={form.maxCTC}
                onChange={(e) => setForm((p) => ({ ...p, maxCTC: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                placeholder="7"
                inputMode="decimal"
              />
            </label>
          </div>

          <label className="space-y-1 text-sm">
            <span className="block font-semibold text-slate-700">Expiration (optional)</span>
            <input
              value={form.expirationDateTime}
              onChange={(e) => setForm((p) => ({ ...p, expirationDateTime: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary bg-white"
              type="datetime-local"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              checked={form.published}
              onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
              type="checkbox"
            />
            <span className="font-semibold text-slate-700">Published</span>
          </label>
        </div>

        <label className="space-y-1 text-sm block">
          <span className="block font-semibold text-slate-700">Description (shown on /careers)</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={5}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
            placeholder="Write a short description (avoid raw HTML)..."
          />
        </label>

        <label className="space-y-1 text-sm block">
          <span className="block font-semibold text-slate-700">Problem-Solving Requirement (shown on job detail page)</span>
          <textarea
            value={form.problemSolvingRequirement}
            onChange={(e) => setForm((p) => ({ ...p, problemSolvingRequirement: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary"
            placeholder="Add challenge/question candidates must solve before applying..."
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={createJob}
            className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Create Job
          </button>
          {domains.length > 0 && (
            <div className="text-xs text-slate-500">
              Existing domains: <span className="font-bold">{domains.slice(0, 6).join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Existing Jobs</h2>

        {loading ? (
          <div className="text-sm text-slate-600">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-sm text-slate-600">No jobs found.</div>
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{j.domain}</span>
                    {!j.published && (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">Draft</span>
                    )}
                  </div>
                  <div className="mt-2 font-extrabold text-slate-900 truncate">{j.title}</div>
                  {j.slug && <div className="text-xs text-slate-500 mt-1">URL: /careers/{j.slug}</div>}
                  <div className="text-sm text-slate-600">{j.companyName}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {j.location || '—'} • Exp: {j.expirationDateTime ? new Date(j.expirationDateTime).toLocaleDateString() : 'None'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // quick toggle published
                      (async () => {
                        try {
                          const res = await fetch(`/api/admin/career-jobs/${j.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ published: !j.published }),
                          });
                          if (!res.ok) throw new Error(`HTTP ${res.status}`);
                          await load();
                        } catch (e: any) {
                          setMessage(e?.message || 'Failed to update');
                        }
                      })();
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold hover:bg-slate-50"
                  >
                    {j.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => loadApplications(j.id)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold hover:bg-slate-50"
                  >
                    Apps
                  </button>
                  <button
                    onClick={() => removeJob(j.id)}
                    className="px-3 py-2 rounded-lg border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {appsJobId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 border border-slate-200">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Job Applications</h3>
                <p className="text-sm text-slate-600">Job ID: {appsJobId}</p>
              </div>
              <button
                onClick={() => {
                  setAppsJobId(null);
                  setApps([]);
                }}
                className="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {appsLoading ? (
              <div className="text-sm text-slate-600">Loading applications...</div>
            ) : apps.length === 0 ? (
              <div className="text-sm text-slate-600">No applications found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Phone</th>
                      <th className="py-2 pr-4">Resume</th>
                      <th className="py-2 pr-4">Domain</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.flatMap((a, idx) => {
                      const key = (a._id || a.email) + String(idx);
                      return [
                        <tr key={key} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-semibold text-slate-900">{a.fullName}</td>
                          <td className="py-2 pr-4 text-slate-700">{a.email}</td>
                          <td className="py-2 pr-4 text-slate-600">{a.phone || '—'}</td>
                          <td className="py-2 pr-4">
                            {a.resumeUrl ? (
                              <a
                                href={a.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs font-bold"
                              >
                                {a.resumeFileName || 'View Resume'}
                              </a>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="py-2 pr-4 text-slate-600">{a.domainSnapshot || '—'}</td>
                          <td className="py-2 pr-4">
                            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                              {a.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-slate-600">
                            {a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}
                          </td>
                        </tr>,
                        a.coverLetter ? (
                          <tr key={`${key}-cover`} className="border-b border-slate-100 bg-slate-50/70">
                            <td colSpan={7} className="py-2 pr-4 text-slate-700 text-xs">
                              <span className="font-bold">Problem solution:</span> {a.coverLetter}
                            </td>
                          </tr>
                        ) : null,
                      ].filter(Boolean);
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

