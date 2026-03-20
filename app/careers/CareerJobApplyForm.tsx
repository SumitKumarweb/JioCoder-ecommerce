'use client';

import { useState } from 'react';

export default function CareerJobApplyForm({
  jobId,
  defaultDomain,
}: {
  jobId: string;
  defaultDomain: string;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [problemSolution, setProblemSolution] = useState('');
  const [resume, setResume] = useState<File | null>(null);
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
      const form = new FormData();
      form.set('jobId', jobId);
      form.set('fullName', fullName.trim());
      form.set('email', email.trim());
      if (phone.trim()) form.set('phone', phone.trim());
      if (linkedin.trim()) form.set('linkedin', linkedin.trim());
      form.set('coverLetter', problemSolution.trim());
      if (resume) form.set('resume', resume);

      const res = await fetch('/api/career-jobs/apply', {
        method: 'POST',
        body: form,
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
      setResume(null);
    } catch (err: any) {
      setMessage(err?.message || 'Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="text-xs text-slate-500">
        Domain match: <span className="font-bold">{defaultDomain}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <textarea
        required
        value={problemSolution}
        onChange={(e) => setProblemSolution(e.target.value)}
        rows={6}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-primary text-sm"
        placeholder="Describe the domain problem you solved, your approach, and result..."
      />

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Upload Resume (PDF/DOC/DOCX, max 5MB)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-700 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-slate-100 file:font-semibold"
        />
      </div>

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

