import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';

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
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex flex-col gap-2">
            <div className="p-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Welcome back, Rohan!</p>
            </div>
            <Link
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="/profile"
            >
              <span className="material-symbols-outlined">grid_view</span>
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
            <Link
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="/profile/orders"
            >
              <span className="material-symbols-outlined">package</span>
              <span className="font-medium text-sm">Orders</span>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined fill-1">favorite</span>
              <span className="font-medium text-sm">Wishlist</span>
            </div>
            <Link
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="/profile"
            >
              <span className="material-symbols-outlined">person</span>
              <span className="font-medium text-sm">Profile</span>
            </Link>
            <Link
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium text-sm">Settings</span>
            </Link>
            <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full"
              >
                <span className="material-symbols-outlined text-red-500">logout</span>
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Wishlist</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  You have 5 items saved in your wishlist
                </p>
              </div>
              <button
                type="button"
                className="text-primary text-sm font-bold hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Product Card 1 */}
              <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <button
                  type="button"
                  className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
                <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Apple MacBook Pro Space Gray"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuADfwa_mnmyInz6h8wlv9D6zDNfJMUoyRIYKbtvfbQGE1ZL3MQi5BoHco1C5jBcK1L2rLpoYSQvwGbW1TQbe3qEgCiPQbzh43rRaBJHW93QEb2Axc5Ef2L2Inxhsl6uxCRh6Y8McAmXHtWPQIGmdryskOM8DJBNYSTcIx6Q6QPE836rLrWdTlmsDkFnD1GahfUbf4J8Q1_l-3fFuf_DcL-LROqGnDjvg7mKiZ8SYoYUNNuGhfvLprhTRawJC8Miq8bVNq6iK-iL3dCC"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    MacBook Pro M3 Max
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">
                    Space Grey, 1TB SSD
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹2,49,900</span>
                    <span className="text-sm text-slate-400 line-through">₹2,69,900</span>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                    Move to Cart
                  </button>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <button
                  type="button"
                  className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
                <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Sony WH-1000XM5 wireless headphones"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTFwKPoyZnugrpPCWu0XmURRbeelODFqQ70ETcFQtUmeW-mkj2_P8STNTDUIALumjMhvDHtFXAC4OD8Vi_w7LRxaj1m1PDBnjekMN6YqbDFgja_lnFA838GArFSlldIyzEh0Wj5dvKyhZ8Ko8LE1NH8kM6KiwbS4D7GJKuQ99cek3D5A89AuloL7Cmt0v7fQ9viy5fYibJD0i6mkRx-ouJaddLwlohsp43JTHM494MSbTBNkBpevZae3aXLgGiNCabXE0UtHtqCZXQ"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                      Only 2 Left
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    Sony WH-1000XM5
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">
                    Noise Canceling, Black
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹24,990</span>
                    <span className="text-sm text-slate-400 line-through">₹29,990</span>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                    Move to Cart
                  </button>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <button
                  type="button"
                  className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
                <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Logitech MX Master 3S productivity mouse"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX5FoCPsa7T76i4vz1TM4PdGLsfiCCGKbCpPe86WBmx9EikrTIb0lCunjwJxKYn_18sF17mz6mQPpEpg47kwZakXGGS0zYAsejKDQ6hz-ge_txLqNiDJE1BmlLMN-GSB88g7uBlfURMFELASZRkj8_IHnwobYwlQCp4D2oxmD3GPXHYToUOjVuzDuDW-3qdDHj6wV1f2mfvcVlvGWvqRwXfUyuFqCGZgcIZu3kH0OSZfLVkWvF1PRKIiNP2AF2AQi4kOKCAGKcIewX"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    Logitech MX Master 3S
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">
                    Ergonomic Wireless Mouse
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹9,495</span>
                    <span className="text-sm text-slate-400 line-through">₹11,995</span>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                    Move to Cart
                  </button>
                </div>
              </div>

              {/* Product Card 4 */}
              <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <button
                  type="button"
                  className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
                <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Mechanical gaming keyboard with RGB lights"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9v-IjJ8_mua8yGuG_FU_JrAp4w7xK0yhQXpDQiTOJe9LJyj8SaudSR9srHzdFVqdgR8Rd66HRc2UnaZyJU9bEDKqcaQrdDNoYJU5H1TS_y7_b-ohk5TwSVzL3mLedt3ia2Bds_wRBT1xKLaap5Oi7p80ZN9jtrIAxLU_QGhY3LTHJ97AOjl8ExtnYPZFtoWAyWS1wAlwQA0Ylfq8WsVn6edUeVF2GV9MIuO6foOb1bcAijYzdpfgIf3DpQmtHYz2cAaY-OGolHgwb"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    Keychron Q1 Pro
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">
                    RGB Mechanical Keyboard
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹16,499</span>
                    <span className="text-sm text-slate-400 line-through">₹18,999</span>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                    Move to Cart
                  </button>
                </div>
              </div>

              {/* Product Card 5 */}
              <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <button
                  type="button"
                  className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
                <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="High-resolution computer monitor with vivid colors"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7aJ4O1TdhJxnkYHXOJGqwG9V5Rg6cH9rPocI5J_WjB3hKooxtmEC07tx5lR2MIS148K43QkElYgr4lLU_nnXZdQN4TBszO1pmQYbrffAhQZKMLsWQTQ5_BYZBwC3K7-Xr73UiUMSY4nP28RokbJ2Ac6b5bpwiGj5v3jyw-82t3B7WRbDA9wDlyVEv2ePE4lSiXmyNBVFNywzxlVAJPFwbTw9pKzLGiMeljbvHb-CpyZu42BOtv81SE6DwMTr7ZFt4Sm2SV63pro9n"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    LG UltraFine 4K
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 italic">
                    27-inch Ergo Design
                  </p>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹48,900</span>
                    <span className="text-sm text-slate-400 line-through">₹54,900</span>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">shopping_bag</span>
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State (hidden for now) */}
            <div className="hidden flex-col items-center justify-center py-20 px-4 text-center">
              <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
                <span className="material-symbols-outlined text-5xl">heart_broken</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                Your wishlist is empty
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                Save items you like to see them here later. You can also move them to your cart easily.
              </p>
              <button
                type="button"
                className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

