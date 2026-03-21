import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { BreadcrumbSchema, WebPageSchema } from '@/components/schemas';
import { CODE_TRACKS } from '@/lib/code/codeTracks';

export const metadata: Metadata = {
  title: 'Learn to code',
  description:
    'Free learning paths for JavaScript, HTML/CSS/JS, Python, Java, C, C++, and C#. Curricula, topics, and starter examples — from JioCoder.',
  keywords: [
    'learn JavaScript',
    'learn Python',
    'HTML CSS tutorial',
    'Java tutorial',
    'C programming',
    'C++ tutorial',
    'C# tutorial',
    'JioCoder code',
  ],
  alternates: { canonical: '/code' },
  openGraph: {
    title: 'Learn to code — JioCoder',
    description:
      'Structured tracks for JavaScript, web front-end, Python, Java, C, C++, and C# with syllabi and code samples.',
    url: '/code',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function CodeHubPage() {
  return (
    <>
      <WebPageSchema
        path="/code"
        name="Learn to code — JioCoder"
        description="Learning hub for JavaScript, HTML/CSS/JavaScript, Python, Java, C, C++, and C# with topics and examples."
      />
      <BreadcrumbSchema
        items={[
          { label: 'Home', href: '/' },
          { label: 'Code' },
        ]}
      />
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-4 md:px-10 lg:px-20 py-8 md:py-12">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Code' }]} />

        <header className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Developer hub
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learn to code
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Pick a track below. Each page outlines core topics and includes a small example you can type, run, or
            adapt — whether you&apos;re starting out or brushing up.
          </p>
        </header>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 list-none p-0">
          {CODE_TRACKS.map((track) => (
            <li key={track.slug}>
              <Link
                href={`/code/${track.slug}`}
                className={`group flex flex-col h-full rounded-2xl border bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-700/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${track.borderAccent}`}
              >
                <div
                  className={`h-2 w-full bg-gradient-to-r ${track.accent}`}
                  aria-hidden
                />
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-3">
                    <span
                      className="size-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:scale-[1.03] transition-transform"
                      aria-hidden
                    >
                      <span className="material-symbols-outlined text-2xl">{track.icon}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {track.title}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{track.tagline}</p>
                    </div>
                    <span
                      className="material-symbols-outlined text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0"
                      aria-hidden
                    >
                      chevron_right
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                    {track.description}
                  </p>
                  <p className="mt-4 text-xs font-semibold text-primary">
                    Open syllabus → <span className="sr-only">{track.title}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-14 md:mt-16 rounded-2xl border border-slate-200/90 dark:border-slate-700/90 bg-slate-50/80 dark:bg-slate-800/40 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Routes</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Hub: <code className="text-xs bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">/code</code>
            {' · '}
            Tracks:{' '}
            {CODE_TRACKS.map((t, i) => (
              <span key={t.slug}>
                <Link href={`/code/${t.slug}`} className="text-primary font-medium hover:underline">
                  /code/{t.slug}
                </Link>
                {i < CODE_TRACKS.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
