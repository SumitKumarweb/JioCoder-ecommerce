import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { BreadcrumbSchema, WebPageSchema } from '@/components/schemas';
import { getAllCodeSlugs, getCodeTrack } from '@/lib/code/codeTracks';
import CodeDevBackdrop from '@/components/code/CodeDevBackdrop';
import CodePlayground from '@/components/code/CodePlayground';
import { getPlaygroundRuntime } from '@/lib/code/playgroundConfig';
import {
  codeTrackMetaDescription,
  codeTrackMetaKeywords,
  codeTrackOgDescription,
  codeTrackSchemaKeywords,
} from '@/lib/seo/codeTrackSeo';

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
    title: `${track.title} playground — learn & run online`,
    description: codeTrackMetaDescription(track),
    keywords: codeTrackMetaKeywords(track),
    alternates: {
      canonical: path,
      languages: { 'en-IN': path, 'x-default': path },
    },
    openGraph: {
      title: `${track.title} — JioCoder playground`,
      description: codeTrackOgDescription(track),
      url: path,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${track.title} — JioCoder`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${track.title} — JioCoder`,
      description: codeTrackOgDescription(track),
      images: ['/og-image.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

const bcNav =
  'flex items-center gap-2 text-xs font-mono text-slate-500 mb-0 pt-4 pb-3';
const bcLink = 'text-emerald-400/90 hover:text-lime-300 transition-colors';
const bcActive = 'text-lime-100 font-semibold';
const bcSep = 'text-emerald-800/40';

export default async function CodeTrackPage({ params }: Props) {
  const { slug } = await params;
  const track = getCodeTrack(slug);
  if (!track) notFound();

  const path = `/code/${track.slug}`;
  const playground = getPlaygroundRuntime(slug);
  const editorFilename = playground?.filename ?? track.sample.filename;

  const related = track.related
    .map((s) => getCodeTrack(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getCodeTrack>>[];

  return (
    <>
      <WebPageSchema
        path={path}
        name={`${track.title} — Code playground`}
        description={codeTrackMetaDescription(track)}
        keywords={codeTrackSchemaKeywords(track)}
      />
      <BreadcrumbSchema
        items={[
          { label: 'Home', href: '/' },
          { label: 'Code', href: '/code' },
          { label: track.title },
        ]}
      />
      {/* Viewport-height main — overflow-x must NOT wrap Navbar or sticky header breaks in Safari */}
      <div className="jiocoder-min-h-viewport flex min-w-0 flex-col bg-[#030712] text-slate-200">
        <Navbar />
        <div className="code-dev-root relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden overflow-x-hidden">
          <CodeDevBackdrop />
          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-4 pt-0 sm:px-6 md:px-10 lg:px-12">
            <div className="flex min-h-0 w-full min-w-0  flex-1 flex-col">
          <div className="shrink-0">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Code', href: '/code' },
                { label: track.title },
              ]}
              className={bcNav}
              linkClassName={bcLink}
              activeClassName={bcActive}
              separatorClassName={bcSep}
            />
          </div>

          <Link
            href="/code"
            className="mb-4 inline-flex max-w-fit shrink-0 items-center gap-2 rounded-lg border border-emerald-500/35 bg-emerald-950/40 px-4 py-2.5 text-xs font-mono text-lime-300/95 hover:bg-emerald-900/50 hover:border-lime-400/40 hover:shadow-[0_0_24px_-6px_rgba(74,222,128,0.25)] transition-all md:mb-5"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            All languages
          </Link>

          <header className="mb-4 flex shrink-0 flex-wrap items-start gap-4 md:mb-5 md:gap-6">
            <div
              className={`code-track-icon-float relative flex size-14 md:size-16 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${track.accent} ${track.borderAccent} shadow-[0_0_48px_-6px_rgba(74,222,128,0.35)]`}
            >
              <span className="material-symbols-outlined text-3xl md:text-4xl text-white/90 drop-shadow-lg">
                {track.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-mono text-xs text-emerald-500/85 tracking-wide">playground /{track.slug}</p>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                <span className="code-title-shimmer">{track.title}</span>
              </h1>
              <p className="text-sm md:text-base text-lime-300/80 font-medium">{track.tagline}</p>
              <p className="text-xs text-slate-500 pt-1 max-w-2xl leading-relaxed">
                {playground?.execution === 'html-preview'
                  ? 'Edit markup on the left — Run refreshes the live preview. Scripts run in a sandboxed iframe.'
                  : playground?.execution === 'pyodide'
                    ? 'Write code and use Run. Python runs in your browser with Pyodide (first run may download ~10MB).'
                    : playground?.execution === 'browser-js'
                      ? 'Write code and use Run. JavaScript runs in a sandboxed iframe; output appears in the terminal.'
                      : playground?.execution === 'local-guide'
                        ? 'Use Run to execute on a remote sandbox (Glot) when configured, or follow the in-terminal links for online compilers / local tools.'
                        : 'Write code and use Run; output appears in the terminal.'}
              </p>
            </div>
          </header>

          <CodePlayground slug={slug} filename={editorFilename} fullViewport />

            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-[#030712] text-slate-200">
          <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-6 md:px-10 lg:px-12 md:py-16">
            <section className="border-t border-emerald-500/15 pt-10" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-sm font-bold text-emerald-500/90 font-mono mb-4">
                Other languages
              </h2>
              <ul className="flex flex-wrap gap-2 md:gap-3 list-none p-0">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/code/${r.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/25 px-3 py-2 text-xs font-medium text-slate-200 hover:border-lime-400/40 hover:text-lime-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lime-400 text-base">{r.icon}</span>
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
