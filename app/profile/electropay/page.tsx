import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ElectroPayBalanceCard from '@/components/ElectroPayBalanceCard';

export const metadata: Metadata = {
  title: 'ElectroPay Dashboard',
  description: 'Manage your developer credits and rewards earned from purchases.',
};

export default function ElectroPayPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 bg-white dark:bg-jiocoder-navy rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="px-2 mb-6">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                My Account
              </p>
            </div>
            <nav className="space-y-1">
              <Link
                className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group"
                href="/profile"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  grid_view
                </span>
                <span className="text-sm font-semibold">Dashboard</span>
              </Link>
              <Link
                className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group"
                href="/profile/orders"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  shopping_bag
                </span>
                <span className="text-sm font-semibold">Order History</span>
              </Link>
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg transition-all">
                <span className="material-symbols-outlined fill-1">account_balance_wallet</span>
                <span className="text-sm font-bold">ElectroPay Credit</span>
              </div>
              <Link
                className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  settings
                </span>
                <span className="text-sm font-semibold">Settings</span>
              </Link>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
              <Link
                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-semibold">Logout</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  ElectroPay Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Manage your developer credits and rewards earned from purchases.
                </p>
              </div>
            </div>

            {/* Balance Card */}
            <ElectroPayBalanceCard />

            {/* Chart + Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-jiocoder-navy border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 dark:text-white">Credit Usage Overview</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 bg-primary rounded-full" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Spending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 bg-emerald-400 rounded-full" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Rewards</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between h-48 gap-4 px-2">
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                      <div className="w-4 bg-primary rounded-t opacity-40 h-1/2" />
                      <div className="w-4 bg-emerald-400 rounded-t h-1/4" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">JUL</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                      <div className="w-4 bg-primary rounded-t opacity-40 h-3/4" />
                      <div className="w-4 bg-emerald-400 rounded-t h-1/3" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">AUG</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                      <div className="w-4 bg-primary rounded-t opacity-40 h-2/3" />
                      <div className="w-4 bg-emerald-400 rounded-t h-1/2" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">SEP</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                      <div className="w-4 bg-primary rounded-t h-[85%]" />
                      <div className="w-4 bg-emerald-400 rounded-t h-1/2" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white">OCT</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full flex gap-1 items-end justify-center h-full">
                      <div className="w-4 bg-slate-100 dark:bg-slate-800 rounded-t h-1/2" />
                      <div className="w-4 bg-slate-100 dark:bg-slate-800 rounded-t h-1/4" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">NOV</span>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-jiocoder-navy border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">Summary</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                        <span className="material-symbols-outlined">payments</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Lifetime Spending
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">₹2,45,000</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined">redeem</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Total Rewards
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">₹12,400</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Refer a fellow developer and earn ₹500 credits instantly.
                  </p>
                  <button
                    type="button"
                    className="w-full py-2.5 border border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    Invite Friends
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-jiocoder-navy border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white">Transaction History</h3>
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined !text-xl">download</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Description
                      </th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Oct 24, 2023
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Purchase: Mechanical Keyboard
                        </p>
                        <p className="text-[10px] text-slate-400">Order ID: EC-12093</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-red-500">- ₹8,499.00</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Oct 22, 2023
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Credit Top Up</p>
                        <p className="text-[10px] text-slate-400">Payment via UPI</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-500">+ ₹5,000.00</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Oct 20, 2023
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Reward Credit: Review Incentive
                        </p>
                        <p className="text-[10px] text-slate-400">Product: RTX 4090 GPU</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-500">+ ₹250.00</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Oct 18, 2023
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Refund Credit</p>
                        <p className="text-[10px] text-slate-400">Order ID: EC-98442</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-500">+ ₹1,200.00</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Oct 15, 2023
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Purchase: 4K Developer Monitor
                        </p>
                        <p className="text-[10px] text-slate-400">Order ID: EC-11822</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-red-500">- ₹32,900.00</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-center">
                <button type="button" className="text-xs font-bold text-primary hover:underline">
                  View All Transactions
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
