import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { BreadcrumbSchema, WebPageSchema } from '@/components/schemas';
import { getAllCodeSlugs, getCodeTrack } from '@/lib/code/codeTracks';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCodeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const track = getCodeTrack(slug);
  if (!track) {
    return { title: 'Track not found' };
  }
  const path = `/code/${track.slug}`;
  return {
    title: `${track.title} — Learn`,
    description: track.description,
    keywords: [
      `learn ${track.title}`,
      `${track.title} tutorial`,
      'JioCoder',
      'programming India',
    ],
    alternates: { canonical: path },
    openGraph: {
      title: `${track.title} — JioCoder Code`,
      description: track.tagline + '. ' + track.description,
      url: path,
      type: 'article',
    },
    robots: { index: true, follow: true },
  };
}

export default async function CodeTrackPage({ params }: Props) {
  const { slug } = await params;
  const track = getCodeTrack(slug);
  if (!track) notFound();

  const path = `/code/${track.slug}`;
  const related = track.related
    .map((s) => getCodeTrack(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getCodeTrack>>[];

  return (
    <>
      <WebPageSchema
        path={path}
        name={`${track.title} — Learn to code`}
        description={track.description}
      />
      <BreadcrumbSchema
        items={[
          { label: 'Home', href: '/' },
          { label: 'Code', href: '/code' },
          { label: track.title },
        ]}
      />
      <Navbar />
      <main className="max-w-[900px] mx-auto w-full min-w-0 px-4 md:px-8 py-8 md:py-12">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Code', href: '/code' },
            { label: track.title },
          ]}
        />

        <header className="mt-6">
          <Link
            href="/code"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            All tracks
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`size-14 rounded-2xl bg-gradient-to-br ${track.accent} border ${track.borderAccent} flex items-center justify-center text-slate-800 dark:text-slate-100`}
            >
              <span className="material-symbols-outlined text-3xl">{track.icon}</span>
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {track.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{track.tagline}</p>
            </div>
          </div>
          <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed">{track.description}</p>
        </header>

        <section className="mt-10" aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            What you&apos;ll cover
          </h2>
          <ol className="mt-4 space-y-4 list-none p-0">
            {track.topics.map((topic, i) => (
              <li
                key={topic.name}
                className="flex gap-4 rounded-xl border border-slate-200/90 dark:border-slate-700/90 bg-white dark:bg-slate-900/60 p-4 md:p-5"
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{topic.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10" aria-labelledby="sample-heading">
          <h2 id="sample-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Starter example
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Copy into your editor or IDE and run when you&apos;re ready — adjust names and values to experiment.
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-950 text-slate-100">
            <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/80">
              <span className="text-xs font-mono text-slate-400">{track.sample.filename}</span>
            </div>
            <pre className="p-4 text-xs md:text-sm overflow-x-auto font-mono leading-relaxed whitespace-pre">
              <code>{track.sample.code}</code>
            </pre>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="prereq-heading">
          <h2 id="prereq-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Before you start
          </h2>
          <ul className="mt-3 list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
            {track.prerequisites.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-700" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              Related tracks
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2 list-none p-0">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/code/${r.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-slate-500">{r.icon}</span>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
