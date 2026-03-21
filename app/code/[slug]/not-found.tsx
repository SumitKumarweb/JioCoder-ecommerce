import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CodeDevBackdrop from '@/components/code/CodeDevBackdrop';

export default function CodeTrackNotFound() {
  return (
    <>
      <Navbar />
      <div className="code-dev-root relative min-h-[50vh] bg-[#030712] text-slate-200 overflow-hidden">
        <CodeDevBackdrop />
        <main className="relative z-10 max-w-lg mx-auto px-5 sm:px-6 py-28 md:py-32 text-center">
          <p className="font-mono text-xs text-red-400/90 mb-4">Error: ENOENT</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white code-title-shimmer">Track not found</h1>
          <p className="mt-6 text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            That module isn&apos;t in the repo. Return to the code hub and pick a valid route.
          </p>
          <Link
            href="/code"
            className="inline-flex mt-8 items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-6 py-3 text-sm font-mono text-lime-300 hover:bg-emerald-900/50 hover:border-lime-400/40 hover:shadow-[0_0_28px_-6px_rgba(74,222,128,0.25)] transition-all"
          >
            <span className="material-symbols-outlined text-lg">terminal</span>
            cd /code
          </Link>
        </main>
      </div>
      <Footer />
    </>
  );
}
