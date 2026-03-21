import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { BreadcrumbSchema, WebPageSchema } from '@/components/schemas';
import { CODE_TRACKS } from '@/lib/code/codeTracks';
import CodeHubExperience from '@/components/code/CodeHubExperience';

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
        description="Learning hub for JavaScript, HTML/CSS/JavaScript, Python, Java, C, C++, and C# with topics and examples."
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
