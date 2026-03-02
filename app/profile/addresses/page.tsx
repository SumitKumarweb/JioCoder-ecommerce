import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Saved Addresses',
  description: 'Select or manage your delivery locations for a faster checkout experience.',
};

export default function SavedAddressesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-[1440px] grow min-w-0 px-3 sm:px-4 md:px-6 lg:px-20 py-6 sm:py-8 md:py-10 overflow-x-hidden">
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 md:flex-row">
          {/* Account Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="mb-4 px-4 py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Account
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Arjun Sharma</h3>
              </div>
              <Link
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                href="/profile/orders"
              >
                <span className="material-symbols-outlined">package_2</span>
                <span className="text-sm font-semibold">Orders</span>
              </Link>
              <Link
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                href="/profile"
              >
                <span className="material-symbols-outlined">person</span>
                <span className="text-sm font-semibold">Profile</span>
              </Link>
              <Link
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border-l-4 border-primary transition-all"
                href="/profile/addresses"
              >
                <span className="material-symbols-outlined">location_on</span>
                <span className="text-sm font-semibold">Saved Addresses</span>
              </Link>
              <Link
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">credit_card</span>
                <span className="text-sm font-semibold">Payments</span>
              </Link>
              <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />
              <Link
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                href="#"
              >
                <span className="material-symbols-outlined text-red-500">logout</span>
                <span className="text-sm font-semibold">Logout</span>
              </Link>
            </div>
          </aside>

          {/* Saved Addresses Content */}
          <section className="flex-1">
            <div className="mb-8 flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Saved Addresses
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Select or manage your delivery locations for a faster checkout experience.
              </p>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {/* Add New Address Card */}
              <button
                type="button"
                className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-8 transition-all hover:border-primary hover:bg-primary/5 dark:border-slate-700 dark:hover:border-primary"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl font-bold">add</span>
                </div>
                <div className="text-center">
                  <span className="block text-base font-bold text-slate-900 dark:text-white">
                    Add New Address
                  </span>
                  <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                    For home or office delivery
                  </span>
                </div>
              </button>

              {/* Address Card: Home (Default) */}
              <div className="relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-900 dark:ring-slate-800 border-t-4 border-primary">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">home</span>
                    <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest">
                      Home
                    </h4>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      DEFAULT
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 dark:text-white">Arjun Sharma</p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    402, Skyline Towers, MG Road,<br />
                    Near Metro Pillar 12, Bengaluru,<br />
                    Karnataka - 560001
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-sm">call</span>
                    +91 98765 43210
                  </div>
                </div>
              </div>

              {/* Address Card: Office */}
              <div className="relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-900 dark:ring-slate-800">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined">work</span>
                    <h4 className="font-bold uppercase text-xs tracking-widest text-slate-900 dark:text-white">
                      Office
                    </h4>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 dark:text-white">Arjun Sharma</p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Level 5, Cyber Hub, DLF Phase 3,<br />
                    Near Building 10C, Gurgaon,<br />
                    Haryana - 122002
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-sm">call</span>
                    +91 98765 43211
                  </div>
                </div>
              </div>

              {/* Address Card: Parents */}
              <div className="relative flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-900 dark:ring-slate-800">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined">family_history</span>
                    <h4 className="font-bold uppercase text-xs tracking-widest text-slate-900 dark:text-white">
                      Parents&apos; House
                    </h4>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-900 dark:text-white">Suresh Sharma</p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Flat 12B, Ganga Apartments, Sector 15,<br />
                    Opposite Community Center, Rohini,<br />
                    New Delhi - 110085
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-sm">call</span>
                    +91 99887 76655
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Map Quick View Section */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-1 flex-col justify-center p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Quick Check
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    Delivery Coverage
                  </h3>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Your saved addresses are all within our hyper-fast 24-hour delivery zones.
                    Experience premium service at every doorstep.
                  </p>
                  <div className="mt-6 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1 text-green-500">
                      <span className="material-symbols-outlined text-sm fill-1">verified</span>
                      <span className="text-xs font-bold uppercase">Bengaluru Active</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500">
                      <span className="material-symbols-outlined text-sm fill-1">verified</span>
                      <span className="text-xs font-bold uppercase">Gurgaon Active</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500">
                      <span className="material-symbols-outlined text-sm fill-1">verified</span>
                      <span className="text-xs font-bold uppercase">Delhi Active</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-48 w-full md:h-auto md:w-1/3">
                  <img
                    alt="Abstract map showing delivery coverage areas in India"
                    className="h-full w-full object-cover opacity-80"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyqbZ1aICXEj8w9Vm4yiGWq1qUNzMvY2UMc4nVbLXxTkmAD1qahxO5Z9Js_2_CKSXPFgwcWbogAmRIVqa8CtHrE41JHSZAMCln3OWoxybzneooCccK0caNDM4SuC4sFIXTNXt7ETOCRrMV9b8r-8JWJi2y_0oDMt-7FMkB0eYBIjLWVEWqCoRzeiAvPZpibqR-FdPj7wIe5SWJtAtyM6RoKYqE6V9pL8Jkc_NFQBMLZr2bJa-uvbRmDHET0K1_0kJYLv1NwDPZGiJJ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-900 to-transparent md:block hidden" />
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
