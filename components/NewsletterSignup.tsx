'use client';

import { useState } from 'react';

export default function NewsletterSignup({
  source = 'sale-modal',
  tags = ['sale-modal'],
  inputPlaceholder = 'email@example.com',
}: {
  source?: string;
  tags?: string[];
  inputPlaceholder?: string;
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await fetch('/api/sale-modal/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleaned,
          source,
          tags,
          pagePath: `${window.location.pathname}${window.location.search}`.slice(0, 512),
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent || undefined,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      });

      setMessage('Thanks! We saved your email.');
      setEmail('');
    } catch {
      setMessage('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
      <h4 className="font-bold text-lg mb-2">Build Your Dream Setup</h4>
      <p className="text-sm text-slate-600 mb-4">
        Get the latest hardware guides and exclusive discounts delivered to your inbox.
      </p>

      <form className="space-y-3" onSubmit={submit}>
        <input
          className="w-full bg-white border-none rounded-lg text-sm p-3 focus:ring-2 focus:ring-primary/50 outline-none"
          placeholder={inputPlaceholder}
          type="email"
          aria-label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Subscribe'}
        </button>
      </form>

      {message && <p className="text-sm text-slate-600 mt-3">{message}</p>}
    </div>
  );
}

