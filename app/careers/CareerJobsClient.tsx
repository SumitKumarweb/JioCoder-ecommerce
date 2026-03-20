'use client';

import { useMemo, useState } from 'react';

type Job = {
  id: string;
  title: string;
  domain: string;
  companyName: string;
  description: string;
  location: string;
  minCTC: number | null;
  maxCTC: number | null;
  expirationDateTime: string | null;
};

function formatCTC(minCTC: number | null, maxCTC: number | null) {
  const min = typeof minCTC === 'number' ? minCTC : null;
  const max = typeof maxCTC === 'number' ? maxCTC : null;
  if (min == null && max == null) return 'Not specified';
  if (min != null && max != null) return `${min}L - ${max}L`;
  if (min != null) return `From ${min}L`;
  return `Up to ${max}L`;
}

export default function CareerJobsClient({ jobs }: { jobs: Job[] }) {
  const [domain, setDomain] = useState<string>('All');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);

  const domains = useMemo(() => {
    const set = new Set(jobs.map((j) => j.domain).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const filtered = useMemo(() => {
    if (domain === 'All') return jobs;
    return jobs.filter((j) => j.domain === domain);
  }, [jobs, domain]);

  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative">
            <p className="inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wider uppercase mb-4">
              Careers
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Build the future with JioCoder
            </h1>
            <p className="mt-3 text-slate-300 max-w-2xl">
              Pick your domain, solve a small problem statement, and apply. We prioritize practical problem-solving over generic resumes.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {domains.slice(1, 8).map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    domain === d
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-600">
                Showing <span className="font-extrabold text-slate-900">{filtered.length}</span> opportunities
              </p>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <p className="font-semibold text-slate-700">No jobs found for this domain.</p>
              </div>
            ) : (
              filtered.map((job) => (
                <article
                  key={job.id}
                  className={`rounded-2xl border p-5 transition-all cursor-pointer ${
                    selectedJobId === job.id
                      ? 'border-primary shadow-lg shadow-primary/10 bg-primary/5'
                      : 'border-slate-200 bg-white hover:shadow-md'
                  }`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          {job.domain}
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900">{job.title}</h2>
                      <p className="text-sm text-slate-600 mt-1">{job.companyName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">{formatCTC(job.minCTC, job.maxCTC)}</div>
                      <div className="text-xs text-slate-500 mt-1">{job.location || 'Remote / Flexible'}</div>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                    {job.description || 'No description provided yet.'}
                  </p>
                  <p className="text-xs text-slate-500 mt-3">
                    {job.expirationDateTime
                      ? `Apply before ${new Date(job.expirationDateTime).toLocaleDateString()}`
                      : 'No closing date specified'}
                  </p>
                </article>
              ))
            )}
          </div>

          <div className="xl:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {!selectedJob ? (
                <p className="text-sm text-slate-600">Select a job to apply.</p>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{selectedJob.domain}</p>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedJob.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{selectedJob.companyName}</p>
                  </div>

                  <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                    <p className="font-bold mb-1">Problem-Solving Challenge</p>
                    <p>
                      Explain one real problem you solved in your domain. Share approach, trade-offs, and outcome in 5-10 lines.
                    </p>
                  </div>

                  <ApplicationForm jobId={selectedJob.id} defaultDomain={selectedJob.domain} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ApplicationForm({ jobId, defaultDomain }: { jobId: string; defaultDomain: string }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [problemSolution, setProblemSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName.trim() || !email.trim() || !problemSolution.trim()) {
      setMessage('Name, email and problem-solving answer are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/career-jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          fullName,
          email,
          phone: phone.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
          // Reuse existing backend field to avoid schema changes.
          coverLetter: problemSolution.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      setMessage('Application submitted successfully.');
      setFullName('');
      setEmail('');
      setPhone('');
      setLinkedin('');
      setProblemSolution('');
    } catch (err: any) {
      setMessage(err?.message || 'Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="text-xs text-slate-500">
        Domain match: <span className="font-bold">{defaultDomain}</span>
      </div>

      <input
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-primary text-sm"
        placeholder="Full name"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-primary text-sm"
        placeholder="Email"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-primary text-sm"
        placeholder="Phone (optional)"
      />
      <input
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-primary text-sm"
        placeholder="LinkedIn or portfolio (optional)"
      />
      <textarea
        required
        value={problemSolution}
        onChange={(e) => setProblemSolution(e.target.value)}
        rows={5}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-primary text-sm"
        placeholder="Describe the domain problem you solved, your approach, and result..."
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {loading ? 'Submitting...' : 'Apply Now'}
      </button>

      {message && <p className="text-sm font-semibold text-slate-700">{message}</p>}
    </form>
  );
}

