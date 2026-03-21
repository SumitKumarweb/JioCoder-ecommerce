import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CodeTrackNotFound() {
  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Track not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          That language track doesn&apos;t exist. Browse all paths from the code hub.
        </p>
        <Link
          href="/code"
          className="inline-flex mt-8 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90"
        >
          Back to Code
        </Link>
      </main>
      <Footer />
    </>
  );
}
