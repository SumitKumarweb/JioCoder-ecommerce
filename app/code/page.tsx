import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { BreadcrumbSchema, WebPageSchema } from '@/components/schemas';
import { CODE_TRACKS } from '@/lib/code/codeTracks';
import CodeHubExperience from '@/components/code/CodeHubExperience';

export const metadata: Metadata = {
  title: 'Learn to code — free JavaScript, Python, Java, C, C++, C#',
  description:
    'Free programming paths for India learners: JavaScript, HTML/CSS/JS, Python, Java, C, C++, and C#. Topics, syllabi, starter code, and a browser playground with editor + Run + terminal.',
  keywords: [
    'learn JavaScript free',
    'learn Python India',
    'HTML CSS JavaScript tutorial',
    'Java tutorial online',
    'C programming online',
    'C++ tutorial beginner',
    'C# learn free',
    'online code playground',
    'coding for beginners India',
    'JioCoder /code',
    'free programming course',
  ],
  alternates: { canonical: '/code' },
  openGraph: {
    title: 'Learn to code — JioCoder (free tracks + playground)',
    description:
      'Structured tracks for JavaScript, web front-end, Python, Java, C, C++, and C# — syllabi, examples, and an interactive playground.',
    url: '/code',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JioCoder — Learn to code',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn to code — JioCoder',
    description: 'Free tracks + live playground: JS, Python, Java, C, C++, C#, web.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

const bcNav =
  'flex items-center gap-2 text-xs font-mono text-slate-500 mb-0 pt-4 pb-2';
const bcLink = 'text-emerald-400/90 hover:text-lime-300 transition-colors';
const bcActive = 'text-lime-100 font-semibold';
const bcSep = 'text-emerald-800/40';

export default function CodeHubPage() {
  return (
    <>
      <WebPageSchema
        path="/code"
        name="Learn to code — JioCoder"
        description="Free programming hub: JavaScript, HTML/CSS/JS, Python, Java, C, C++, and C#. Topics, syllabi, starter snippets, and an interactive playground with editor and terminal."
        keywords="learn to code, JavaScript, Python, Java, C, C++, C#, HTML, CSS, online playground, JioCoder, India, free tutorial"
      />
      <BreadcrumbSchema
        items={[
          { label: 'Home', href: '/' },
          { label: 'Code' },
        ]}
      />
      <Navbar />
      <div className="bg-[#030712] ring-1 ring-emerald-950/40">
        <div className="max-w-[1440px] mx-auto w-full min-w-0 px-5 sm:px-6 md:px-10 lg:px-20">
          <Breadcrumb
            items={[{ label: 'Home', href: '/' }, { label: 'Code' }]}
            className={bcNav}
            linkClassName={bcLink}
            activeClassName={bcActive}
            separatorClassName={bcSep}
          />
        </div>
        <CodeHubExperience tracks={CODE_TRACKS} />
      </div>
      <Footer />
    </>
  );
}
