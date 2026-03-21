import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import ProfileDashboard from './ProfileDashboard';

export const metadata: Metadata = {
  title: 'Account Dashboard',
  description: 'Manage your JioCoder account, orders, and profile.',
};

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 items-start">
          <AccountSidebar activeKey="dashboard" />
          <section className="flex-1 w-full space-y-8 p-0">
            <ProfileDashboard />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
