import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const recommendedProducts = [
  {
    id: 'notfound-1',
    name: 'Mechanical RGB Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCRlbyegFB3yISgH6Ls2w8PsZjCadEcq7UyrlP9ytfDQW2sHnFryMTxUPJZQhOe__WOdXyKXvF0uuMpzDEGORI77NBuIhrENxqtZIWPGnHXM-IKreVVpL5GUgsVySQPmINh3-uZQjFXuG-7-Uf5xKy8s6cjBC1cBSkog2ZPpRQ3kDnM0s587ySMaRtsxn8747FOlbqh7n6cN9emw05jJDWlmT7qNF7kLFxmd0FVi__h6Eu3JADaPzEWTcLyReDi1mdw9wGrbcTjRSu',
    price: 4999,
    rating: 4.8,
    reviewCount: 212,
    badge: { text: 'Bestseller', color: 'primary' },
  },
  {
    id: 'notfound-2',
    name: 'Wireless Ergonomic Mouse',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh2AX1SF_Wo0bYoOjuLctIA0wz_pKvW1CO-enEahbDdpXEMz9ySIquiXmPwwb0pAIQsc84LzMPx2rlot3c5sV-DJiBxmSNgdySMsKEqCIaV2l4u-7GQvVJ-UFCWtosFZI11WzHuem4mCODWjHsewgwOnW0kHHqngNGV8ZLVxjnaZRAyk9E_w9iYXvIQojlXVwVchsORSMYbHUKE99-Dn3k6phT4zO_L9-G93qCb2rWc6E4sItXjmNVZmP6WlSXOn_Du15fEL8DUp97',
    price: 2499,
    rating: 4.7,
    reviewCount: 88,
    badge: { text: 'Top Rated', color: 'primary' },
  },
  {
    id: 'notfound-3',
    name: 'Precision Gaming Pad',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2Yrw0HjdgCa5zTOsdlJZqRtIar5HWpiA_c5hI59c3HpOl_6_uMPRpynlgsKSEdYnE2qHycTy7aBPhIeU8XzUVrCTn_J5fhTzb0np1PKzxPSj5buqQDupV2PwSA9Ia4OVI9-a1K5Kttl0CHJ8sYx_OEv3QAOZ0kt6U3J2yHA-uJq5PUhHlFZ7mnYa8vVUerIMY8oF9pFGZ5tOg0wfu7wxN7jNoCYUpfmUq-S7RgsHy0OqHPVCNvVSQ1SoPA7YomQqfvfBwxkNAUu5',
    price: 999,
    rating: 4.5,
    reviewCount: 154,
  },
  {
    id: 'notfound-4',
    name: 'Ultra-Wide 4K Monitor',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5SGUw0p4aHOHSa_rXwpc5aN7aspI6moT6eebRjqohaOQ2ODiX4-DUfMZagpnfhJLNfBgIxriFzPlgyA6_buNbnhAJReIz_ECDaFjISsewWf7N5FAygVDShVUORHywWxbN6IuZDGaD8eH76VpCFassjUn3yrVErGTWLS0a2bUDqFdzwC8NhG7NxFRc68y94NVL6AyT8Hwh6JNWLTh0zsuGywCC9pFBmrH83jbCUd7Z8pr0YgEEnOqZeSrMQsQUVU2A64--T5a_UDUQ',
    price: 32999,
    rating: 4.9,
    reviewCount: 304,
    badge: { text: 'New Arrival', color: 'green' },
  },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Empty State Hero */}
        <section className="flex flex-col items-center text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 p-8 rounded-full bg-primary/5">
            <span
              className="material-symbols-outlined text-8xl text-primary/40"
              style={{ fontVariationSettings: "'wght' 200" }}
            >
              search_off
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Oops! We couldn't find what you were looking for.</h1>
          <p className="text-slate-600 max-w-lg mx-auto mb-8">
            We searched through thousands of premium electronics but couldn't find a match for your query. Don't worry,
            your perfect gadget is still out there.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Browse Products
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-white border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        </section>

        {/* Search Tips Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 h-48 md:h-auto bg-slate-100">
              <img
                alt="Support"
                className="w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcwRzB-G9yTq-CMHglHua65zMDNAoaggDuZJA0XW85jlhW8_xuZiJs0iDVvRPe_uAKlI-OQY6pZhFKlLzO3tsQN1eg62DkNAyHuRn7y4Qu1TYRy2PxLOlUWX49OXGlAoxtaxw6VU1veRWq3QiKoL8nBb682YNPKnXNla3yl4EGeQnEInjMvrSYEYF6w4UH_TYzvfL_C9lW_nJ2HXc-JigQh9tFE36LpnM1DpLs4C4ubFIqmGXBxwkPb0AuPVIHVC8-z2h5Ycq-bpp3"
              />
            </div>
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                Search Tips
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm mt-1 text-slate-400">check_circle</span>
                  <span>Double-check your spelling for typos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm mt-1 text-slate-400">check_circle</span>
                  <span>Use more general keywords (e.g., "Keyboard" instead of "Mechanical RGB Wireless 60%").</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm mt-1 text-slate-400">check_circle</span>
                  <span>Try searching for a specific brand or model number.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Product Recommendations */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">You Might Also Like</h2>
            <Link
              href="/products"
              className="text-primary font-semibold flex items-center gap-1 hover:underline"
            >
              View Bestsellers
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                rating={product.rating}
                reviewCount={product.reviewCount}
                badge={product.badge}
              />
            ))}
          </div>
          {/* Browse Categories Button */}
          <div className="flex justify-center mt-12">
            <Link
              href="/products"
              className="flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>Browse All Categories</span>
              <span className="material-symbols-outlined">grid_view</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

