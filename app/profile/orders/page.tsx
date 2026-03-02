import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';

export const metadata: Metadata = {
  title: 'Order History',
  description: 'Manage, track, and reorder from your past electronics purchases.',
};

export default function OrderHistoryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-5 sm:py-6 md:py-8 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 items-start">
          <AccountSidebar activeKey="orders" />

          {/* Order History Content */}
          <section className="flex-1 w-full space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  <Link className="hover:text-primary transition-colors" href="/">
                    Home
                  </Link>
                  <span className="material-symbols-outlined !text-xs">chevron_right</span>
                  <Link className="hover:text-primary transition-colors" href="/profile">
                    Account
                  </Link>
                  <span className="material-symbols-outlined !text-xs">chevron_right</span>
                  <span className="text-slate-900 dark:text-slate-200">Order History</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  My Orders
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Manage, track, and reorder from your past electronics purchases.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full min-w-0 sm:min-w-[200px] md:min-w-[240px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    search
                  </span>
                  <input
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Search by Order ID"
                    type="text"
                  />
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined !text-lg">filter_list</span>
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Order Cards Container */}
            <div className="space-y-4">
              {/* Order Card 1: Delivered */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Order Placed
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        October 12, 2023
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Amount
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹1,24,990.00
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Ship To
                      </span>
                      <span className="text-sm font-semibold text-primary hover:underline cursor-pointer">
                        Rahul Sharma
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Order # EC-98231
                    </span>
                    <div className="flex gap-3 text-xs font-semibold text-primary mt-1">
                      <Link className="hover:underline" href="#">
                        Invoice
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="flex -space-x-3 overflow-hidden">
                        <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 p-2 overflow-hidden flex items-center justify-center">
                          <img
                            className="object-contain size-full"
                            alt="Apple MacBook Air M2 in Silver"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCADJgMqxO0XFE03ent8Mon8LAwGXyVYCnxyt1S0QMg0axB3m-LI_LfFv10LHnhCNOXXiIx3Q8YWPWTNV9kssg7BFmqHjqn5_6FL33S08IwpHT04kXIXQls6GnhBHkIcciG0zFwzYvb9dzF1edrVEN12gh2kQ82YDrY0M1ii5MbbIHKErz6SNfnxXucBDcvetXQZ2m8cNcB9yBGSqWilnUyYOlGFL2aTF0Dr1rSELZ9efVls55tQ3dqbioVVVwoXro4fFrL1kqB3yLk"
                          />
                        </div>
                        <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 p-2 overflow-hidden flex items-center justify-center">
                          <img
                            className="object-contain size-full"
                            alt="Apple iPad Pro 11 inch in Space Grey"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEO7aBaGJErn-ER5WOwk7Cf1psAGg3HLm4N03IiZtMMCQB5V8hpcvcROT3zrsdcCYAHihBoEXxG9j2gipIyiYXM8RuvZmXPTs1nhXUY2QhFvEiBE6TecB_waGLiO3Z9a6J99P28uGl1XyOBxXzPo8OSbThQQdOhAeUR_p7uYXAbtJZh6Fl8DJELVIfaCPguDYMv0W6aWz700t2zx11-sGmlV_hrvgVoNAfYQAq1O_lHgzer6FZ4Vxgo1oJUf_ERTYilaYnRajmmUxD"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="size-2 rounded-full bg-green-500" />
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Delivered on Oct 14
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          MacBook Air M2, iPad Pro + 1 other item
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                      <button
                        type="button"
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Card 2: In Transit */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Order Placed
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Yesterday, 14:20
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Amount
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹79,900.00
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Ship To
                      </span>
                      <span className="text-sm font-semibold text-primary">Rahul Sharma</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Order # EC-10042
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 p-2 overflow-hidden flex items-center justify-center">
                        <img
                          className="object-contain size-full"
                          alt="Smartphone display"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1j8T7trMhySlKjWw1V2WnnV8OjzyYuDvIbaElHeQ9iVIfvW-ZX99SJh78QfiBAH7NJhCtOAMm0t5hf5_tZvmekXq78i-Xx22v0als0njgYrRgzfP8pHhADTxkccrpj0mXfejWNeuhlRFnBGfan4pne9_0MvopL6V67KoE9Oc9v889TAYDhGy8AuB4x3KRn1pOzbXNJXOLNYiW-vwd51xZKQ5ZEFvXnPP99IvJlgLRolqUdswTg64Zku4PcP2JV-HLWLMbw_-rOetG"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            In Transit - Expected Tomorrow
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Samsung Galaxy S23 Ultra (Phantom Black)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                      <button
                        type="button"
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Track Order
                      </button>
                      <button
                        type="button"
                        className="flex-1 lg:flex-none px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Order Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Card 3: Returned */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm opacity-80">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Order Placed
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        Aug 22, 2023
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Amount
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        ₹24,990.00
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Order # EC-94112
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 p-2 overflow-hidden flex items-center justify-center">
                        <img
                          className="object-contain size-full"
                          alt="Over-ear wireless headphones"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuALIffaMBqx8CoDA1XIqL5-4s_k0KPvtO-7x1qCINwruXbbPnb04p96_YHsb4ZgU0DYpyqzoLSeLJ8H272Y04Vj8bxkLZJVx3-d-hlDnUaiiunEh3P317h1fPR2GGwW6qSwVf2974WqvzquwgU18DzozCm_FoHsiArPE5wfc2V5ji9DLijg_fBp30O140MgK9hQHhYKTAx4q-QJJZjp9Owqdrj0mxEl9AgQrd5_dhbLlE25gFeJaKPyy33LfF0Q85kBUPQf5r5MwlPx"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="size-2 rounded-full bg-amber-500" />
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Refund Completed
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Sony WH-1000XM5 Wireless Noise Canceling
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                      <button
                        type="button"
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        View Refund Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Showing <span className="text-slate-900 dark:text-white">1 - 3</span> of{' '}
                <span className="text-slate-900 dark:text-white">12</span> orders
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-50"
                  disabled
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  className="size-9 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm"
                >
                  1
                </button>
                <button
                  type="button"
                  className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  2
                </button>
                <button
                  type="button"
                  className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  3
                </button>
                <button
                  type="button"
                  className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
