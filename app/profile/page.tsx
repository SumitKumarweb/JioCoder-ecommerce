import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileSection from '@/components/ProfileSection';
import AccountSidebar from '@/components/AccountSidebar';
import ProfileStats from './ProfileStats';

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

          {/* Main Content Area */}
          <section className="flex-1 w-full space-y-8 p-0">
              <div className="max-w-5xl mx-auto space-y-8 w-full">
                {/* Dashboard Title */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Account Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Manage your high-performance tech ecosystem.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    JioCoder Plus Member
                  </div>
                </div>

                {/* Profile Hero Section */}
                <ProfileSection />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Orders</span>
                      <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">shopping_bag</span>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">12</p>
                    <p className="text-xs text-emerald-500 font-medium mt-1">+2 this month</p>
                  </div>

                  <ProfileStats />

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Saved Addresses</span>
                      <div className="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">location_on</span>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">02</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Home, Office</p>
                  </div>
                </div>

                {/* Recent Order Status Widget */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">local_shipping</span>
                      Recent Order Status
                    </h3>
                    <Link className="text-primary text-sm font-bold hover:underline" href="/profile/orders">
                      View All Orders
                    </Link>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex gap-4">
                        <div className="size-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center p-2">
                          <img
                            className="w-full h-full object-contain"
                            alt="MacBook Pro M3 Space Black"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_3W-2FP_WJVV3zQMuZSqm_ZsBnJVTNzNiBUmPRfI1QUquvSQ5igZJQgUjGkKY9ax88AAnloK02YCLiWRj7grwv7dXbwTAXSbhjJ56qvtW0K703jGx5jFMmc7ynPH4EQinkm7FRpSbhPYTiDNYGPBqxSwkxzuymAk83zLwbxwQ00DI_m-MBZ7v-XZjYyfM2eXWfL5lS_VxJWWwRVtPfTZtocXUurYXRQO0nE-4RaAWaFLZDI-6HCFg7DHoAuVRkr-Tf4Q_M8cmSuUv"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-bold text-slate-900 dark:text-white">MacBook Pro M3</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Order #EC-8829310</p>
                          <p className="text-lg font-black text-primary mt-1">₹1,69,900</p>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <div className="relative mb-6">
                          {/* Progress Bar Background */}
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2" />
                          {/* Active Progress */}
                          <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-primary -translate-y-1/2" />
                          <div className="relative flex justify-between">
                            <div className="flex flex-col items-center">
                              <div className="size-4 bg-primary rounded-full border-4 border-primary/20 ring-4 ring-white dark:ring-slate-900" />
                              <span className="text-[10px] font-bold mt-2 uppercase text-slate-500">Placed</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="size-4 bg-primary rounded-full border-4 border-primary/20 ring-4 ring-white dark:ring-slate-900" />
                              <span className="text-[10px] font-bold mt-2 uppercase text-slate-500">Processing</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="size-4 bg-primary rounded-full border-4 border-primary/20 ring-4 ring-white dark:ring-slate-900 flex items-center justify-center">
                                <span className="size-1.5 bg-white rounded-full" />
                              </div>
                              <span className="text-[10px] font-bold mt-2 uppercase text-primary">In Transit</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="size-4 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-slate-200/20 ring-4 ring-white dark:ring-slate-900" />
                              <span className="text-[10px] font-bold mt-2 uppercase text-slate-400">Delivered</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-xl">info</span>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Currently at{' '}
                            <span className="font-bold text-primary">Gurugram Distribution Hub</span>. Estimated delivery
                            by <span className="font-bold">Tomorrow, 4:00 PM</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Account Quick Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 rounded-xl hover:shadow-xl hover:shadow-primary/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">credit_card</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          Manage Payment Methods
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Securely update your saved cards and UPI IDs.
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  </div>

                  <div className="group cursor-pointer bg-gradient-to-r from-primary to-blue-700 p-[1px] rounded-xl shadow-lg shadow-primary/10">
                    <div className="bg-white dark:bg-slate-900 shadow-sm p-6 rounded-xl h-full flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">workspace_premium</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">JioCoder Plus Benefits</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          You're saving ₹1,200/month with free shipping.
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
              </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

