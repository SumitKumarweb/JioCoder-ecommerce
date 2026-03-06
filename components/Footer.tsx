'use client';

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter subscription
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    console.log('Newsletter subscription:', email);
    // Add your newsletter subscription logic here
  };

  return (
    <footer className="bg-primary text-slate-400 pt-10 sm:pt-14 md:pt-16 pb-6 sm:pb-8 mt-8 sm:mt-12">
      <div className="max-w-[1440px] mx-auto w-full min-w-0 px-4 md:px-10 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white" style={{ backgroundColor: '#0F172A' }}>
            <img 
              src="/logo.png" 
              alt="JioCoder" 
              style={{ width: '100%', height: '35px' }}
              className="object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed">
            The ultimate destination for mechanical keyboard enthusiasts in India. We bring global craftsmanship to your desktop.
          </p>
          <div className="flex gap-4">
            <a className="hover:text-white transition-colors" href="#" aria-label="Website">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="hover:text-white transition-colors" href="#" aria-label="Share">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a className="hover:text-white transition-colors" href="#" aria-label="Email">
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h6 className="text-white font-bold">Quick Links</h6>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Our Story
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Bulk Orders
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Custom Builds
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Track Order
              </a>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="space-y-4">
          <h6 className="text-white font-bold">Policies</h6>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Shipping Policy
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Return & Refund
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Terms of Service
              </a>
            </li>
            <li>
              <a className="hover:text-white transition-colors" href="#">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h6 className="text-white font-bold">Newsletter</h6>
          <p className="text-sm">Subscribe to get early access to group buys.</p>
          <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
            <input
              name="email"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-accent-green"
              placeholder="Email address"
              type="email"
              required
            />
            <button
              type="submit"
              className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs">© 2024 JioCoder India. All rights reserved.</p>
        <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
          <img
            className="h-6"
            alt="UPI"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCruJFJbYau90AYNYMzjEg3rmtV6BrNv0l-JvGaT19O__38YuYkgpjaHSLiPY7Wwxq5ndag85S3Uh-dGgR2ByZ9KQqM1UEPrUkop7zMHwb5liYTpZ7RdM2HHPk5ZBOifVn9-9gwPv5zaWfkdjsBfJEa-0v8LsLRSFsHbvcdTEhqLbSgeVUSIg1xMZTu6i_NzFbsnKLmerf1jSaHcmyVUprQvVObeZP5_Cxgi5zx5pHNZ4eU9qwrXWpjB4OConnf3ICuDC20otIk8Lt_"
          />
          <img
            className="h-6"
            alt="Visa"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmOoaFnNk6RgAerpd3pYTjsj_tNghF7CzqWRrreLqoSWwNdP083pofveicOBVKRJAl_0-9xjxR5VpSxQoXC5qFx0a6rhqAKmA3sGDMYYMAuzy7BYV_VF-aEIDZcPjXThGPOHDbLtCfvxJUePtWOAoMPLOd890X3YKPGIXJ39G_Gi8HinUtAA7EGvggp3elw5CsTLrAkw9WSacHfrIvoy5X-YWXQO9G8H4Myqd38_9pr1qZZWeBgI7nsBCSrBP5lpyVEJCUZzdGDVvT"
          />
          <img
            className="h-6"
            alt="Mastercard"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBElMG5AkeHuhqWBSbfo2MAkXdPBjp9AAjRpu0CE5d5bJYmY7f4MfTN8KCN5Kh8PiVqtnFODkZxOz_H1scLfhoUBnJGpCdkhjy4WAktq6IqvOw1DpaVcxXMp6xEjo-BNYjzLMOWJbPTytLpk0GOq39f5utIOslB0ejuwz7nLzxEuQfLxVlpXRV7JkShsmwQmsKp7ErAh7MqDmkgfYyHZt_MudL4PAhWvUEHXWrR6f_-KSDCNwUbDinszmbQbQU_ws-J4Z9mLKfpkIjs"
          />
        </div>
      </div>
    </footer>
  );
}

