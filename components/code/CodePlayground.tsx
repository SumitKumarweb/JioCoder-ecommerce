'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPlaygroundRuntime } from '@/lib/code/playgroundConfig';
import { getStarterCode } from '@/lib/code/playgroundStarterCode';
import {
  runJavaScript,
  runLocalGuide,
  runPython,
} from '@/lib/code/execute/clientRun';

type Props = {
  slug: string;
  filename: string;
  /** Fill available height (viewport-style IDE layout). */
  fullViewport?: boolean;
};

export default function CodePlayground({ slug, filename, fullViewport = false }: Props) {
  const starter = useMemo(() => getStarterCode(slug), [slug]);
  const [code, setCode] = useState(starter);
  const [terminal, setTerminal] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const runtime = getPlaygroundRuntime(slug);
  const exec = runtime?.execution;
  const isHtmlPreview = exec === 'html-preview';

  useEffect(() => {
    setCode(getStarterCode(slug));
    setTerminal('');
    setPreviewKey((k) => k + 1);
  }, [slug]);

  const run = useCallback(async () => {
    if (!runtime) return;

    if (isHtmlPreview) {
      setPreviewKey((k) => k + 1);
      setTerminal(
        `[${new Date().toLocaleTimeString()}] Preview refreshed — output is in the live preview panel.`
      );
      return;
    }

    setLoading(true);
    setTerminal('Running…\n');
    try {
      if (exec === 'browser-js') {
        const out = await runJavaScript(code);
        setTerminal(out);
        return;
      }
      if (exec === 'pyodide') {
        setTerminal('Loading Python runtime (first run may download ~10MB, ~30s)…\n');
        const out = await runPython(code);
        setTerminal(out);
        return;
      }
      if (exec === 'local-guide') {
        setTerminal(runLocalGuide(slug));
        return;
      }
      setTerminal('Unknown execution mode.');
    } catch (e) {
      setTerminal(`Error: ${e instanceof Error ? e.message : 'Run failed'}`);
    } finally {
      setLoading(false);
    }
  }, [slug, code, runtime, isHtmlPreview, exec]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setTerminal((t) => t + `\n[${new Date().toLocaleTimeString()}] Copied ${code.length} chars to clipboard.`);
    } catch {
      setTerminal((t) => t + '\nCopy failed — select and copy manually.');
    }
  }, [code]);

  const reset = useCallback(() => {
    setCode(getStarterCode(slug));
    setTerminal('');
    if (isHtmlPreview) setPreviewKey((k) => k + 1);
  }, [slug, isHtmlPreview]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const t = document.activeElement;
        if (t === taRef.current) {
          e.preventDefault();
          run();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run]);

  const showCopy = exec === 'local-guide';
  /** Custom styled scrollbar — see globals.css `.scrollbar-code-dev` */
  const codeScroll = 'scrollbar-code-dev';

  const shell =
    fullViewport
      ? 'flex min-h-0 flex-1 flex-col gap-3 md:gap-4'
      : 'mt-8 md:mt-10 space-y-4 md:space-y-5';

  return (
    <div className={shell}>
      <div className="flex shrink-0 flex-wrap items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-lime-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(74,222,128,0.5)] hover:from-emerald-500 hover:to-lime-500 disabled:opacity-60 transition-all"
        >
          <span className="material-symbols-outlined text-xl">play_arrow</span>
          {loading ? 'Running…' : 'Run'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-950/40 px-4 py-2 text-xs font-mono text-lime-300/90 hover:bg-emerald-900/50 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">restart_alt</span>
          Reset
        </button>
        {showCopy && (
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-950/40 px-4 py-2 text-xs font-mono text-lime-300/90 hover:bg-emerald-900/50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">content_copy</span>
            Copy code
          </button>
        )}
        <span className="text-xs font-mono text-emerald-600/90 ml-auto">
          {filename}
          <span className="text-slate-600 mx-2">·</span>
          <kbd className="rounded border border-emerald-800/50 bg-emerald-950/50 px-1.5 py-0.5 text-[10px] text-slate-400">
            Ctrl+Enter
          </kbd>{' '}
          run
        </span>
      </div>

      {/* Split: code (left) · terminal / preview (right) */}
      <div
        className={
          fullViewport
            ? 'grid min-h-0 flex-1 grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2 lg:gap-6 lg:items-stretch'
            : 'grid min-h-[min(420px,52vh)] grid-cols-1 gap-4 md:gap-5 lg:min-h-[min(480px,58vh)] lg:grid-cols-2 lg:gap-6 lg:items-stretch'
        }
      >
        {/* Left: editor */}
        <div
          className={
            fullViewport
              ? 'flex min-h-[min(240px,32vh)] flex-col min-w-0 lg:min-h-0'
              : 'flex min-h-[min(320px,42vh)] flex-col min-w-0 lg:h-full lg:min-h-0'
          }
        >
          <label className="text-[11px] font-mono uppercase tracking-wider text-emerald-600/90 mb-2 block">
            Code
          </label>
          <textarea
            ref={taRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className={
              fullViewport
                ? `min-h-0 w-full flex-1 resize-none rounded-xl border border-emerald-500/25 bg-[#050f0a] p-4 md:p-5 font-mono text-sm leading-relaxed text-lime-100/90 placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 safari-momentum-scroll ${codeScroll}`
                : `min-h-[min(320px,42vh)] w-full flex-1 resize-y rounded-xl border border-emerald-500/25 bg-[#050f0a] p-4 md:p-5 font-mono text-sm leading-relaxed text-lime-100/90 placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 lg:min-h-0 safari-momentum-scroll ${codeScroll}`
            }
            placeholder="Write your code here…"
          />
        </div>

        {/* Right: terminal (or preview + notes for HTML) */}
        <div
          className={
            fullViewport
              ? 'flex min-h-[min(240px,32vh)] flex-col gap-4 min-w-0 lg:min-h-0'
              : 'flex min-h-[min(280px,38vh)] flex-col gap-4 min-w-0 lg:h-full lg:min-h-0'
          }
        >
          {isHtmlPreview && (
            <div
              className={
                fullViewport
                  ? 'flex min-h-[min(180px,24dvh)] flex-1 flex-col min-w-0 lg:min-h-0'
                  : 'flex min-h-[min(220px,28vh)] flex-1 flex-col min-w-0 lg:min-h-0'
              }
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600/90 mb-2 block">
                Live preview
              </span>
              <div
                className={
                  fullViewport
                    ? 'min-h-0 flex-1 overflow-hidden rounded-xl border border-emerald-500/25 bg-white shadow-inner'
                    : 'min-h-[min(220px,28vh)] flex-1 rounded-xl border border-emerald-500/25 bg-white overflow-hidden shadow-inner'
                }
              >
                <iframe
                  key={previewKey}
                  title="HTML preview"
                  srcDoc={code}
                  sandbox="allow-scripts allow-modals"
                  className={
                    fullViewport
                      ? 'h-full min-h-0 w-full bg-white'
                      : 'min-h-[min(220px,28vh)] h-full w-full bg-white'
                  }
                />
              </div>
            </div>
          )}

          <div
            className={
              isHtmlPreview
                ? fullViewport
                  ? 'flex min-h-[min(120px,16vh)] flex-1 flex-col min-w-0 lg:min-h-0'
                  : 'flex min-h-[min(140px,18vh)] flex-1 flex-col min-w-0 lg:min-h-[min(160px,20vh)]'
                : fullViewport
                  ? 'flex min-h-0 flex-1 flex-col min-w-0'
                  : 'flex min-h-[min(280px,38vh)] flex-1 flex-col min-w-0 lg:min-h-0'
            }
          >
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600/90 mb-2 block">
              {isHtmlPreview ? 'Notes' : 'Terminal'}
            </span>
            <pre
              className={
                fullViewport
                  ? `min-h-0 flex-1 overflow-auto rounded-xl border border-emerald-500/30 bg-[#020806] p-4 md:p-5 font-mono text-xs md:text-sm text-lime-200/90 whitespace-pre-wrap break-words leading-relaxed shadow-[inset_0_0_40px_rgba(0,0,0,0.35)] safari-momentum-scroll ${codeScroll}`
                  : `min-h-[min(120px,16vh)] flex-1 overflow-auto rounded-xl border border-emerald-500/30 bg-[#020806] p-4 md:p-5 font-mono text-xs md:text-sm text-lime-200/90 whitespace-pre-wrap break-words leading-relaxed shadow-[inset_0_0_40px_rgba(0,0,0,0.35)] safari-momentum-scroll ${codeScroll}`
              }
              role="log"
              aria-live="polite"
            >
              {terminal ||
                (isHtmlPreview
                  ? 'Click Run to refresh the preview.'
                  : '— JavaScript runs in a sandboxed iframe.\n— Python uses Pyodide in your browser (first run downloads the runtime).\n— Java / C / C++ / C# show how to run locally.')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
