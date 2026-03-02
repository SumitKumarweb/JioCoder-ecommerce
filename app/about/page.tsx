import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - JioCoder',
  description:
    'Learn about JioCoder - India\'s premier destination for high-end electronics. Our journey from startup vision to India\'s tech hub, serving 500k+ customers with genuine gear and 24/7 support.',
  keywords: ['about jiocoder', 'tech company india', 'electronics retailer', 'about us'],
  openGraph: {
    title: 'About Us - JioCoder',
    description:
      'Learn about JioCoder - India\'s premier destination for high-end electronics. Our journey from startup vision to India\'s tech hub.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'About Us' },
          ]}
        />
        {/* Hero Section */}
        <section className="relative min-h-[320px] h-[50vw] max-h-[480px] sm:max-h-[560px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
            <img
              alt="Modern Tech Workspace"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtC4_D4J9EjNNlK1idlcKYb2MFer_-UAJUYlFC0rDHIF0M1og69S2azXmEg2vdJioXjsEO4TRmwivmDcXYjWU3HVfyThpSr_5Sl1FYSK3NahvmZpbWzQcLGyPjzY_2b42AVXrDobZNtLZaUOG2T40lDI3ZzHO0Q7hPMRVWyp0MFfw4nT5iAcx0ivZf2qhFiAoG35hgXM9C-AXzbIGq9e0_94nMOYcmaHB_khBVCzxztHCmSB1f--AlyxcGsjVaL0xvl-b5DnKem5wV"
            />
          </div>
          <div className="relative z-20 max-w-4xl px-4 text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-white uppercase bg-primary rounded-full">
              Established 2018
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.1]">
              Powering Your Passion <br />
              <span className="text-primary/90">for Tech</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              India's premier destination for high-end electronics, bridging the gap between global innovation
              and local enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
              >
                Explore Collection
              </Link>
              <Link
                href="#story"
                className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 font-bold rounded-lg hover:bg-white/20 transition-all"
              >
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 size-32 bg-primary/5 rounded-full -z-10"></div>
                <img
                  alt="Brand Journey"
                  className="rounded-2xl shadow-2xl relative z-10"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb_diXJKwGx0fFjgLdBHZZEikMVioXiuPduieMDPFou3xZDAIaO8iIXp0s4lS7p8nBJkxerQAvnmuwdNfBC6XRx42gK-J6Dj983SfM3uIez6Yi5GwySz8j6djs-2yZQeMCIIWvjvEfrpKeMV8_htD8wLFiluTLlTYbLi8n38yWP0vUwH2h1B_k2vhAsV_cYBJF6jjxPyuECshtMFwEWEjotsaHKv7O_y-c3khITSxuT61RdwrV6rXNBRagXwXKTVpjOV5jnWGTfd-C"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-2xl text-white hidden md:block">
                  <p className="text-4xl font-bold">5+</p>
                  <p className="text-sm font-medium opacity-80">Years of Innovation</p>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Our Journey</h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                  From Startup Vision to India's Tech Hub
                </h3>
                <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                  <p>
                    JioCoder began with a simple observation: Indian tech enthusiasts were often forced to
                    wait months for international releases or settle for inferior local alternatives. We set out
                    to change that narrative.
                  </p>
                  <p>
                    What started in a small Mumbai office has grown into a nationwide ecosystem. We've spent
                    the last half-decade building exclusive partnerships with global tech giants to ensure that
                    the latest innovations land in your hands first.
                  </p>
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-900">500k+</span>
                      <span className="text-sm text-slate-500">Active Customers</span>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-900">24/7</span>
                      <span className="text-sm text-slate-500">Customer Support</span>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-900">100%</span>
                      <span className="text-sm text-slate-500">Genuine Gear</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 px-4 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="size-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined !text-4xl">rocket_launch</span>
                </div>
                <h4 className="text-2xl font-bold mb-4">Our Mission</h4>
                <p className="text-slate-400 text-lg leading-relaxed">
                  To empower every individual and business in India by providing seamless access to high-end,
                  genuine electronics that drive productivity and fuel passion for modern technology.
                </p>
              </div>
              <div className="bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="size-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined !text-4xl">visibility</span>
                </div>
                <h4 className="text-2xl font-bold mb-4">Our Vision</h4>
                <p className="text-slate-400 text-lg leading-relaxed">
                  To be the most trusted technology platform in the Indian subcontinent, recognized for
                  quality curation, ethical business practices, and an unparalleled customer experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">The JioCoder DNA</h2>
            <h3 className="text-4xl font-bold text-slate-900">Our Core Values</h3>
          </div>
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
              <div className="size-16 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-3xl">verified</span>
              </div>
              <h5 className="text-xl font-bold mb-3">Quality First</h5>
              <p className="text-slate-500">
                Every product undergoes rigorous multi-point testing before it reaches your doorstep.
              </p>
            </div>
            {/* Value 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
              <div className="size-16 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-3xl">lightbulb</span>
              </div>
              <h5 className="text-xl font-bold mb-3">Innovation</h5>
              <p className="text-slate-500">
                We don't just follow trends; we bring the cutting-edge future to the Indian market today.
              </p>
            </div>
            {/* Value 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
              <div className="size-16 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-3xl">favorite</span>
              </div>
              <h5 className="text-xl font-bold mb-3">Customer Centric</h5>
              <p className="text-slate-500">
                Your satisfaction drives our decisions. Our support team is here to help, not just sell.
              </p>
            </div>
            {/* Value 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
              <div className="size-16 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-3xl">gavel</span>
              </div>
              <h5 className="text-xl font-bold mb-3">Integrity</h5>
              <p className="text-slate-500">
                Transparent pricing, ethical sourcing, and genuine warranty commitments. No hidden fine print.
              </p>
            </div>
          </div>
        </section>

        {/* Our Workspace Gallery */}
        <section className="py-24 px-4 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Behind the Scenes</h2>
                <h3 className="text-4xl font-bold text-slate-900">Life at JioCoder</h3>
              </div>
              <Link href="/careers" className="flex items-center gap-2 text-primary font-bold group">
                Join Our Team
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-12 gap-4 h-[600px]">
              <div className="col-span-12 md:col-span-8 h-full">
                <img
                  alt="Collaborative Space"
                  className="w-full h-full object-cover rounded-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHqQlO6Uh-Z5XXbVZHYWt3mcltZoIRRgjie_0HJ-1DI0lDdvaFWk6VN14a1GL8NzmkTVs1Fd67TLVAgNu8oHBfz4Gy2cSLQUQAIGQpKTus9mX_3Gcvp6z_yYjFQvSrq-8zO6yXhOUIfv1AZkoFgGbWyFoxzW7kQmvErd0NkkVuJEuN-AXNv-23RlnZXl06arfTmCQNgQ9RIvzhbW6bzSJQ_BrkVmpT8ZRUW_r8HBzYRIizoG_dYEOdYJUzPoEElTOMQQhEp7mNubKg"
                />
              </div>
              <div className="col-span-12 md:col-span-4 flex flex-col gap-4 h-full">
                <div className="h-1/2">
                  <img
                    alt="Distribution Center"
                    className="w-full h-full object-cover rounded-2xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUL-NG9bGI01JwWZIW5U8trhekaLrkhJMXbgYvWkJpG8fQ62qRcu4nD_-OYgb4tUJGLz5GjAJfVXe3ZKyL3zOe_FWWoNdjZNrPmK_DjiKL1d0d9W4BcPxM6Ecm6B9khzzC0twTwUuTzZSAcHQ-gMMyJzGNzxcpyEGUcN-0H_UWRAu_nA6ySTTY_gmYXIbvZRNIC6zsr1wDrdEwENs8xWLJEUAFcXWR-7Cww8WwmHXHeQbQyDUvfatK2hwekNUYMO6qqRS4sQWUcRz8"
                  />
                </div>
                <div className="h-1/2">
                  <img
                    alt="Creative Room"
                    className="w-full h-full object-cover rounded-2xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnaSx0dSbXs5MSFcI96FmdMGdxXswKvYaKq2c0wH_UhZ_XFAmEItN-e9AcY3mkWIaQM-7XR75Eott15MOBRSXls9QjiEpBwNOomP5hHhfMkOImQivzIEIgNb0L2ziXiiJ3bjHzoNKukgX-vE2O0P1uKq1ENJhKFkxnkW5Rjtyx7WX3cmJqg1Px4V9JUwShLMjOIz_Py27CT1ugNRKDVthJhc7B_elccEWXV4BeYE1k6PaBJagmaP5kfcNXeKLGiG3MudzM_21POLXT"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-8">Ready to upgrade your gear?</h3>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of tech enthusiasts who trust JioCoder for their professional and personal
              electronic needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="px-10 py-5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl"
              >
                Browse All Products
              </Link>
              <Link
                href="/contact"
                className="px-10 py-5 bg-white text-primary font-bold rounded-xl hover:bg-slate-100 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

