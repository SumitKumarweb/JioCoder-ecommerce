'use client';

import { useState } from 'react';

export default function CodeCopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      setDone(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400/95 hover:bg-emerald-500/15 hover:text-lime-200 transition-colors border border-transparent hover:border-emerald-400/35"
      aria-label="Copy code to clipboard"
    >
      <span className="material-symbols-outlined text-sm">{done ? 'check' : 'content_copy'}</span>
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}
