import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import WishlistContent from './WishlistContent';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'View and manage items saved to your wishlist.',
};

export default function WishlistPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-6 lg:px-20 py-5 sm:py-6 md:py-10 overflow-x-hidden">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link className="hover:text-primary transition-colors" href="/">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary transition-colors" href="/profile">
            My Account
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">Wishlist</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 lg:gap-10">
          <AccountSidebar activeKey="wishlist" />

          {/* Main Content Area */}
          <WishlistContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
