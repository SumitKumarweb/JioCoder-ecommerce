'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

interface Bundle {
  id: string;
  name: string;
  description: string;
  products: Array<{
    name: string;
    image: string;
    specs: string;
  }>;
  originalPrice: number;
  salePrice: number;
  discount: number;
  claimedPercentage: number;
  stockLeft: string;
}

const bundles: Bundle[] = [
  {
    id: 'bundle-1',
    name: 'Pro-Gamer Bundle v2',
    description: 'Mechanical K1, Apex Wireless Mouse, XL Speed Pad',
    products: [
      {
        name: 'K1 Mechanical',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnF-hf2lbc0nWOH59s7xuGcaoJ0SvEylrj2_-q-2xBoSQLxg4hLFm8DvmVg_N_xra9pzWK6BKeSCnpNRGL1k6uF3r6YV68GBHp1WsmbmSPGX62v1LFdA4svxvBm2bSIv1xKLOQmsqEGjzspKTRuvNcKU3jJmLj4mC32XPZrEmVc6RjPn5BfLyIB7ElLA_QV0WpcEgUAZOXpGfPwmPy6pXpk2wFZOjeNPmZKYBYyH_SnXVxSmHYJ7SZEBUw3g0vkY1nZ-gbddDBRPsP',
        specs: 'Blue Switches • RGB',
      },
      {
        name: 'Apex Wireless',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQjEXhYjzTO2G3e0m4xS7I4pNUjtiuy40GNlkZwik66wBtjLjqwZPhE_oljObaIFLLO-_fZ3iVRbeT6Oz3lZ3ssfs-lyP6gk-LQqkZqVuelhx7bJrhcDDkbOruuhHUwZceLo12wCUo7_KUaFkSY_RNdHh2c5H0kRmvUZCezrhqXU1luYuDP63Pk27Do2ou29vzFYOzyFKUaW5_2jf3Nf6qjmWiwTuK4pB398CRzLYF1z9eOqLGkT3WnCxpgnQQuRq93oyFO6oJoYUI',
        specs: '16K DPI • 80g Weight',
      },
      {
        name: 'XL Speed Pad',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_kNPppUZiNUnrRjYwR0MUFy2Dv_hCx_Q78-v_4AfNhlwS2LHoAM2Ji__22ITtg2qDoFOGUEm04vIkIfPHwJG5qYnEA08BaeVzAy0Jmtemsgm2t4JMDb01zVKZnhAwYiH8e_TznfhL4i7VB4csU-DHKhX5Vbm48lunh7IUwxOdCTpnZFey8Yq6Vcb2FJ4LFygMP-o3qI8SnCGrOeCW1kgsexbPNZeSmUFgDXME8MoUa7tRDYEVJo-RYDO7VHANlOzTxkV-JCbawrtV',
        specs: 'Anti-fray • Washable',
      },
    ],
    originalPrice: 12499,
    salePrice: 7999,
    discount: 35,
    claimedPercentage: 65,
    stockLeft: 'Only 12 sets left!',
  },
  {
    id: 'bundle-2',
    name: 'Streamer Starter Kit',
    description: 'Condenser Mic, 4K Web-Cam, Ring Light',
    products: [
      {
        name: 'Studio Mic',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD_aJBWg7p9DYEZkOVGbY2i00KeYNlp0PoILVQdBmtOgzgBAA56K5Z5hnOgycwc7Bq6XvRRXllGglcUJ_cdjmrKfdZTiE30LyPCfrn1yXweQv5fLZvNJgDojxl4m-y5WvaDUxey-dGO2wQeS474WhDYjFYhGRMSn6JNCYlHJI9oEoF-uvkqb9cGFCxLPYMBwXqz6v6BKQrbVLpTU1fHYtdGozTWD_hbMHsFLbn9GFcXAOqDV9BCw8SuX5PLQFbxHmx9knaEDbYpN43',
        specs: 'USB-C • Cardioid',
      },
      {
        name: '4K Cam Pro',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkM8JcuxnAPcqDCg7-bb_4eS6S9xFC6Ey7l-1TKYGUAPtIN8cOWHdBlmMEZmA1I-RZYxsHRZ1OZdTYDFJZZDF97oPU3145mcMbn7xMPYXIXIm31QySfUOdj3w-1oNK7nfsqo4aNAmizj7zD2qKAP_KTzakk0FYEGVvaR4K8uYnilPpqeAdNX2F7xOdDbNizPy0vbAVfQ4wSK-h8TZJT213mIRslvvunCXx9KF5vSlgF21nN-7CNkkkgFKOWd4G322rv-488pHFXd_l',
        specs: '60FPS • Auto-focus',
      },
      {
        name: 'Aura Ring Light',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcwQJ6g71cBwEdnFTFLkFP_OOIUqIxrUVuZzkSnzVnIMkUVcNUcbhuUqkQ08dYD9AHaarqNB0aF5G4JIRmhagsQ-N9ju8DhHuPeaKaBiHSwjzH3V8KFndYCnpDO8EMQ4M9ikukE7yKjilXvWC9et67Dhd7emc1TwYhuFv_KDUiYvlD389d7rJkEZGqYe0WGF67djpNy9G3beBuF4F5n1Lb0dXEeq6cZCS1dUaEDOtdYn8SHXzZ081IEQKPqXOL8ZqND3lJDmZ3DGks',
        specs: '3 Colors • Dimmer',
      },
    ],
    originalPrice: 24999,
    salePrice: 18499,
    discount: 25,
    claimedPercentage: 82,
    stockLeft: 'Only 3 sets left!',
  },
  {
    id: 'bundle-3',
    name: 'Audio Phile Essentials',
    description: 'Hi-Fi Headphones, DAC Amp, Braided Cable',
    products: [
      {
        name: 'H1 Over-Ear',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWjNrD3OcTCYlil51N9BcB9C04s_N5ZrZjO1WqfjHkJg0VNZsaCcP-ehhPS1k0jVqgPqo_x1mLwmWMtPNLQ0GOXFwgWcpZP00esSWf6TqmfLD10ncMW00SOa4I6i1JNuXF64Ju2foxFEcCl17Gq8RyhOb33sM_G0NSB5cfJm9yg67EiRKHjX9ok4dtIYIOU80SM8HVfqKiIqF9Fx3iJ4N39xeD_smWVp5rhJnUkYYf8ONw10Ilx3Ex25h8YI1z30dL-TxPjI-0iSXA',
        specs: 'Open-Back • 80Ω',
      },
      {
        name: 'Sonic DAC',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVyZI6g0gVcxCJZKuyLJmXQmcUeqAYt_4qu0Va1Q_ylGtOUcuYUJwE8M3_TL8oNfguGpsw7Pv3m-sPm3PWntaFgn3DSzVqsiqHdcLlsLCKB-LZWO99bawvsZEhY3iruB8TYZTmuvfJpsylhKjUx7UVGT9K_Vvknpj8dHDg4EHiZ-PGZM2DKaG--iGelhHbS0EPtYp2vyYAoDPycDJaX2yS97DT2airkaK9PWWxdwqTDjksjr8QD6MNkMtVsuKAskDZWRsWz3imeP84',
        specs: 'Hi-Res • Metal Body',
      },
      {
        name: 'Gold XLR',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA8xr9ZJUgqiXOKxT7vak7MDAFx2O7aKHAJhcFbTNkZzm9K_wf5e_0kz-70OcQVGNs04BCSU7Gxl152_wPqiorKkEyRDUBlIB1-QM4pVqYTxFpR6C0dRxl7nW_cqGoeVk_Rzgqtq9t1hCXudkEWOQ3tkiAO3El2_pmZXtuOmjemaL6qdHINYX_LVQnljMLKAxorDulKJ8Nh6hAg_SToj-tPgG6ErD0tn-27WYNrLB8VS8L1jWzybIMFPRGDKnfKghwzGSo4cFKVZV6',
        specs: '3-Meter • Braided',
      },
    ],
    originalPrice: 32999,
    salePrice: 25999,
    discount: 20,
    claimedPercentage: 30,
    stockLeft: 'Limited Availability',
  },
  {
    id: 'bundle-4',
    name: 'Home Office Elite',
    description: 'Wireless Desktop K2, Vertical Mouse, Wrist Rest',
    products: [
      {
        name: 'K2 Slim',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ03VVfzbFz4LyC3lqhfZGuSNwP6y6eyxON7GggAQmqYueDT7iBePd3iyezGDNUY-Xaer0thTFeR6tfzjn3TG0io4BOLtqk1k5e8ngTjpeI59xmLfbXbdgqjGKDY8R_nprySehaemyAcb68iDz4IAq3aqu_gWFu9BbPXOJRyOhTXptYG_eZF9hB4Iou2yzZ5vOunFetnJfDdYz9WFVspglxKGJhcEVKDHELmoB5dMk3g9UuxdAxzqQFNrBEc9r4gvfKR4htgPRc9uA',
        specs: 'Silent • Bluetooth',
      },
      {
        name: 'Ergo V-Mouse',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCSaaG1cvepRGO_6KtPK0u4vA8OmapzFOnolg7td0KJoAHZwIPwWJZzsc4elrFBukKgvd9VSm98U6cdLlo9Lpwac82rGY7LQWAcPs4b7w4dKocnG5Y-1oCkP9zZ94eOOtidG7xYnBE9oXAqdxZONQ-bQHEPeJ2d7zrXsC6xF-VL3LsVmBPqZ6MRkV6B6Oz6uGcb5d_LOOxZuk95d-GVworboI6OVvlpqr64kitc6DXXZN-SYCmgu9kyNW7rFWRdELtlBQ0gHxv_P98',
        specs: '57° Angle • Wireless',
      },
      {
        name: 'Cloud Rest',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxyPqsQr2-NgRsqz99OgRDULKSeNIkPlgWoO0F7GmTjCcmV31k1ksHTrPjGuHqbZuh6GSSP3Zsy2VXAs2XFrARlvpkTBWWIQMK2r5mOnQ_s_dCrYkk4dzifhMb5ect7_KqSVsWknlFKvrXnxVbcTTSB00C9Qiw96_64GH-Tm-MB9yAcnA9Cm3yDZJnMA0t37eufRJhMf8JuHXGHGHDBNnuuBSmXfDU8PMKpZTn1JL8c8n8GZBQvDNOUXmvVPim7gfDLg_-B1PesmkR',
        specs: 'Memory Foam • Cool',
      },
    ],
    originalPrice: 9999,
    salePrice: 5999,
    discount: 40,
    claimedPercentage: 15,
    stockLeft: 'Available',
  },
];

export default function SalePage() {
  const { addToCart, openCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer ended
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMounted]);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const handleAddBundle = (bundle: Bundle) => {
    // Calculate price per product (distribute bundle price evenly)
    const pricePerProduct = Math.round(bundle.salePrice / bundle.products.length);
    
    // Add each product from the bundle to cart individually
    bundle.products.forEach((product, index) => {
      addToCart({
        id: `${bundle.id}-product-${index}`,
        name: product.name,
        image: product.image,
        price: pricePerProduct,
        variant: product.specs,
      }, false); // Don't open drawer for each item, only after all are added
    });
    
    // Open cart drawer after all products are added
    setTimeout(() => {
      openCart();
    }, 100);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-16 pb-20">
        {/* Hero Section with Countdown */}
        <section className="py-12 md:py-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-8 md:p-16 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Flash Sale Live
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              LIMITED TIME <br className="md:hidden" />
              COMBO BLOWOUT
            </h2>
            {/* Massive Neon Timer */}
            <div className="flex gap-4 md:gap-8 mb-10">
              <div className="flex flex-col gap-2">
                <div className="bg-white border border-primary/40 rounded-xl px-4 py-6 md:px-8 md:py-10 min-w-[80px] md:min-w-[120px] shadow-lg">
                  <span className="text-4xl md:text-7xl font-bold text-primary">
                    {isMounted ? formatTime(timeLeft.hours) : '02'}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-slate-600">Hours</span>
              </div>
              <div className="flex items-center text-primary text-4xl md:text-6xl pt-[-20px]">:</div>
              <div className="flex flex-col gap-2">
                <div className="bg-white border border-primary/40 rounded-xl px-4 py-6 md:px-8 md:py-10 min-w-[80px] md:min-w-[120px] shadow-lg">
                  <span className="text-4xl md:text-7xl font-bold text-primary">
                    {isMounted ? formatTime(timeLeft.minutes) : '45'}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-slate-600">Minutes</span>
              </div>
              <div className="flex items-center text-primary text-4xl md:text-6xl pt-[-20px]">:</div>
              <div className="flex flex-col gap-2">
                <div className="bg-white border border-primary/40 rounded-xl px-4 py-6 md:px-8 md:py-10 min-w-[80px] md:min-w-[120px] shadow-lg">
                  <span className="text-4xl md:text-7xl font-bold text-primary">
                    {isMounted ? formatTime(timeLeft.seconds) : '18'}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-slate-600">Seconds</span>
              </div>
            </div>
            <p className="text-slate-600 max-w-lg mx-auto text-sm md:text-base mb-8">
              Unbeatable bundles on high-end tech. Premium gear for the elite gamer and professional. Offer
              valid while stocks last.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20">
                Gaming Sets
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm">
                Office Essentials
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm">
                Audio Bundles
              </button>
            </div>
          </div>
        </section>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col shadow-lg"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="inline-block bg-primary text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-tighter">
                      Better Together
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{bundle.name}</h3>
                    <p className="text-xs text-slate-600">{bundle.description}</p>
                  </div>
                  <div className="bg-orange-500 text-white font-black px-3 py-1 rounded text-sm shadow-lg shadow-orange-500/20">
                    Save {bundle.discount}%
                  </div>
                </div>
                {/* Product Trio Display */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {bundle.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-slate-50 rounded-xl p-4 flex items-center justify-center group/item hover:ring-2 hover:ring-primary/40 transition-all cursor-help border border-slate-200"
                    >
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain"
                        src={product.image}
                      />
                      <div className="absolute inset-0 bg-white/95 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center rounded-xl border border-primary/20">
                        <span className="text-[10px] font-bold text-primary uppercase">{product.name}</span>
                        <span className="text-[8px] text-slate-600">{product.specs}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Progress Bar & Inventory */}
                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-primary">{bundle.claimedPercentage}% Claimed</span>
                    <span className="text-slate-600">{bundle.stockLeft}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(13,242,13,0.5)]"
                      style={{ width: `${bundle.claimedPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {/* Sticky-style Bottom Action Area */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 line-through">
                    ₹{bundle.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{bundle.salePrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="bg-primary text-white h-12 px-8 rounded-lg font-bold hover:scale-[1.02] transition-transform active:scale-95 flex items-center gap-2"
                >
                  Add Combo to Cart
                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges & Info */}
        <section className="mt-20 py-12 border-y border-slate-200 bg-slate-50 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900">Free Express Shipping</span>
              <span className="text-[10px] text-slate-600 uppercase tracking-widest">Pan-India Delivery</span>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900">Official Warranty</span>
              <span className="text-[10px] text-slate-600 uppercase tracking-widest">1 Year Coverage</span>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">swap_horiz</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900">7 Day Replacement</span>
              <span className="text-[10px] text-slate-600 uppercase tracking-widest">Easy Returns</span>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">payments</span>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900">EMI Available</span>
              <span className="text-[10px] text-slate-600 uppercase tracking-widest">Zero Interest Options</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

