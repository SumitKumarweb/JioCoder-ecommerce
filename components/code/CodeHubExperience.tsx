'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CodeTrack } from '@/lib/code/codeTracks';
import CodeDevBackdrop from './CodeDevBackdrop';

const TERMINAL_CMDS = [
  'jiocoder code --init',
  'fetch learning-paths --all',
  'run start-journey.sh',
];

export default function CodeHubExperience({ tracks }: { tracks: CodeTrack[] }) {
  const [cmdIndex, setCmdIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setCmdIndex((i) => (i + 1) % TERMINAL_CMDS.length);
    }, 3200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="code-dev-root relative min-h-[70vh] bg-[#030712] text-slate-200 overflow-hidden">
      <CodeDevBackdrop />

      <div className="relative z-10 max-w-[1440px] mx-auto w-full min-w-0 px-5 sm:px-6 md:px-10 lg:px-20 pt-8 md:pt-12 pb-20 md:pb-28 lg:pb-32">
        {/* Hero */}
        <header className="code-animate-in max-w-3xl lg:max-w-4xl pt-2 md:pt-4">
          <div className="flex flex-wrap items-center gap-3 mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-300 shadow-[0_0_24px_rgba(74,222,128,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="relative flex h-2 w-2">
                <span className="code-hub-ping animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              dev_mode
            </span>
            <span className="text-[11px] font-mono text-slate-500">v1.0.0 · stable</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]">
            <span className="code-title-shimmer">Learn to code</span>
            <br />
            <span className="text-emerald-400/85 text-2xl sm:text-3xl md:text-4xl font-semibold mt-2 block drop-shadow-[0_0_24px_rgba(74,222,128,0.2)]">
              like you mean it.
            </span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed font-light">
            Seven curated tracks — from browser JavaScript to systems C. Syllabi, mental models, and copy-paste starters.
            No fluff. Just the path.
          </p>

          {/* Fake terminal */}
          <div
            className="mt-12 md:mt-14 max-w-xl rounded-xl border border-emerald-500/35 bg-[#06120c]/90 backdrop-blur-md overflow-hidden shadow-[0_0_48px_-10px_rgba(74,222,128,0.25),inset_0_1px_0_rgba(74,222,128,0.08)] code-animate-in"
            style={{ animationDelay: '120ms' }}
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-emerald-500/20 bg-[#040d08]">
              <span className="text-[10px] font-mono text-emerald-600/90 uppercase tracking-wider">bash — zsh</span>
            </div>
            <div className="p-5 md:p-6 font-mono text-sm text-slate-300 space-y-3">
              <p className="text-lime-300/95 leading-relaxed">
                <span className="text-slate-600">$</span> {TERMINAL_CMDS[cmdIndex]}
                <span className="code-cursor-blink" aria-hidden />
              </p>
              <p className="text-xs text-emerald-700/80 pt-3 border-t border-emerald-500/15 leading-relaxed">
                <span className="text-emerald-500/70">//</span> Tip: pick a card below — each route is statically generated for speed.
              </p>
            </div>
          </div>

          {/* Stats */}
          <ul
            className="mt-12 md:mt-14 flex flex-wrap gap-4 md:gap-5 list-none p-0 code-animate-in"
            style={{ animationDelay: '200ms' }}
          >
            {[
              { n: String(tracks.length), l: 'Tracks' },
              { n: '∞', l: 'Experiments' },
              { n: '0₹', l: 'Always free' },
            ].map((s) => (
              <li
                key={s.l}
                className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 px-5 py-4 min-w-[108px] backdrop-blur-sm hover:border-emerald-400/45 hover:bg-emerald-950/45 hover:shadow-[0_0_28px_-6px_rgba(74,222,128,0.25)] transition-all duration-300"
              >
                <p className="text-2xl font-mono font-bold text-lime-300 tabular-nums drop-shadow-[0_0_12px_rgba(190,242,100,0.35)]">
                  {s.n}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-500/70 mt-1.5">{s.l}</p>
              </li>
            ))}
          </ul>
        </header>

        {/* Cards grid */}
        <ul className="mt-20 md:mt-24 lg:mt-28 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7 lg:gap-8 list-none p-0">
          {tracks.map((track, i) => (
            <li
              key={track.slug}
              className="code-animate-in"
              style={{ animationDelay: `${Math.min(i * 75, 600)}ms` }}
            >
              <Link
                href={`/code/${track.slug}`}
                className={`code-card-hover group relative flex flex-col h-full rounded-2xl border border-emerald-500/15 bg-gradient-to-b from-emerald-950/25 via-[#0a1210]/90 to-transparent backdrop-blur-md overflow-hidden ${track.borderAccent} hover:border-emerald-400/40 hover:shadow-[0_0_40px_-12px_rgba(74,222,128,0.2)]`}
              >
                <div
                  className="h-1 w-full bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 opacity-90 group-hover:opacity-100 group-hover:shadow-[0_0_16px_rgba(74,222,128,0.45)] transition-all"
                  aria-hidden
                />
                <div className="absolute -right-16 -top-16 size-40 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-lime-400/15 transition-colors duration-500 pointer-events-none" />
                <div className="p-6 md:p-7 flex flex-col flex-1 relative gap-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#07150f] text-emerald-200 shadow-[0_0_28px_-4px_rgba(74,222,128,0.35)] group-hover:scale-105 group-hover:border-emerald-400/50 group-hover:shadow-[0_0_36px_-2px_rgba(163,230,53,0.25)] transition-all duration-300">
                        <span className="material-symbols-outlined text-2xl">{track.icon}</span>
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-white group-hover:text-lime-200 transition-colors truncate">
                          {track.title}
                        </h2>
                        <p className="text-xs font-mono text-emerald-500/80 truncate">/code/{track.slug}</p>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined text-emerald-500/50 group-hover:text-lime-300 group-hover:translate-x-1 transition-all shrink-0"
                      aria-hidden
                    >
                      north_east
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-3 md:mt-4 leading-relaxed flex-1">{track.tagline}</p>
                  <p className="text-xs text-slate-500 mt-4 md:mt-5 leading-relaxed line-clamp-2">
                    {track.description}
                  </p>
                  <div className="mt-6 md:mt-7 pt-1 flex items-center gap-2 text-xs font-mono text-lime-300/95">
                    <span className="material-symbols-outlined text-sm text-emerald-400">terminal</span>
                    <span className="group-hover:underline underline-offset-4 decoration-emerald-400/60">
                      open_module →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Routes dock */}
        <section
          className="mt-20 md:mt-24 lg:mt-28 rounded-2xl border border-emerald-500/30 bg-[#06120e]/85 backdrop-blur-md p-6 sm:p-8 md:p-10 code-animate-in shadow-[0_0_50px_-18px_rgba(74,222,128,0.22),inset_0_1px_0_rgba(74,222,128,0.06)]"
          style={{ animationDelay: '400ms' }}
          aria-labelledby="code-routes-heading"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
            <span className="material-symbols-outlined text-lime-400 drop-shadow-[0_0_12px_rgba(190,242,100,0.35)]">
              hub
            </span>
            <h2 id="code-routes-heading" className="text-lg font-bold text-emerald-100 font-mono">
              routes.ts
            </h2>
          </div>
          <pre className="text-xs md:text-sm font-mono text-slate-400 leading-loose overflow-x-auto py-2">
            <code>
              <span className="text-lime-400/90">export const</span> <span className="text-emerald-300">hub</span> ={' '}
              <span className="text-lime-300">&apos;/code&apos;</span>
              {'\n'}
              <span className="text-lime-400/90">export const</span> <span className="text-emerald-300">tracks</span> = [
              {'\n'}
              {tracks.map((t) => (
                <span key={t.slug}>
                  {'  '}
                  <Link
                    href={`/code/${t.slug}`}
                    className="text-emerald-400/95 hover:text-lime-300 hover:underline underline-offset-2"
                  >
                    &apos;/code/{t.slug}&apos;
                  </Link>
                  ,{'\n'}
                </span>
              ))}
              {'];\n'}
              <span className="code-cursor-blink inline-block align-bottom" aria-hidden />
            </code>
          </pre>
        </section>
      </div>
    </div>
  );
}
