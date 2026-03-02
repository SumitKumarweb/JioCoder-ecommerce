'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  brand: string;
}

interface SectionProduct {
  id: string;
  productId: string;
  sectionType: 'trending' | 'spotlight';
  order: number;
}

export default function SectionProductsPage() {
  const [sectionProducts, setSectionProducts] = useState<SectionProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedSection, setSelectedSection] = useState<'trending' | 'spotlight'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load section products from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sectionProducts');
      if (saved) {
        setSectionProducts(JSON.parse(saved));
      } else {
        // Default section products
        const defaultSectionProducts: SectionProduct[] = [
          { id: 'sp-1', productId: 'trending-1', sectionType: 'trending', order: 1 },
          { id: 'sp-2', productId: 'trending-2', sectionType: 'trending', order: 2 },
          { id: 'sp-3', productId: 'trending-3', sectionType: 'trending', order: 3 },
          { id: 'sp-4', productId: 'trending-4', sectionType: 'trending', order: 4 },
          { id: 'sp-5', productId: 'trending-5', sectionType: 'trending', order: 5 },
          { id: 'sp-6', productId: 'spotlight-1', sectionType: 'spotlight', order: 1 },
        ];
        setSectionProducts(defaultSectionProducts);
        localStorage.setItem('sectionProducts', JSON.stringify(defaultSectionProducts));
      }

      // Load all products (in real app, fetch from API)
      const products: Product[] = [
        {
          id: 'trending-1',
          name: 'Arctic Mist PBT Keycap Set',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvGH-EeXfLPuwhzrnO3Ynx3TvEgLyyf3w9A7Ku9MYJXzUSg2T6V66y2UeVfWRXErQGUzLuau8p2vpuruuQI1DMHt3I-DPjPhiMgfM9GuKqeglLmHGiJbgkvgwj0Q38TiqNwiDFfSAbkM-W7hONdowZfcjqeXqcrrt8bFfzniZIvddBpqwFYuA-vQhuRaxLg3hFgLl3sNDGXaMsza6QqOHuBVFNN1S15yKqDUR5vZm1mcbCFowTeykGjZIINx45hBbvsEciIvsTgQnL',
          price: 3499,
          brand: 'Custom',
        },
        {
          id: 'trending-2',
          name: 'Air75 V2 Low-Profile Keyboard',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh',
          price: 12999,
          brand: 'NuPhy',
        },
        {
          id: 'trending-3',
          name: 'Logitech G Pro X Superlight',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
          price: 11495,
          brand: 'Logitech',
        },
        {
          id: 'trending-4',
          name: 'Onyx Felt Large Desk Pad',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUuF1Tp2OQwl4ZcwIYnoPlMn05i9umoW5eaHxwxtpfbTCaK2avQqZln8FS3uW4YJu0Igiu_44aN5rueJLPl3RiPtaeTL0-3Sd7KMOKMzYaNFarJ22INs8uCqbO0SI4SJ1kDizPd7lqChN8PV97H1uz3z6OHox1gcpPYuoSt53UrMIrCiYnhJ_Y0lDi7_S3Kf0Vh-OP39jHCCDJe7E8aGFHz6gxklTDoG2-A2_el3BECN-iZ_ba1Q_9Fv991ECfpWfC4uuy4c4nEs8o',
          price: 1899,
          brand: 'Desk Accessories',
        },
        {
          id: 'trending-5',
          name: 'Carbon Fiber Coiled Aviator Cable',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgdShxLlKCypMs41C4ireig29gMbYTcanzcugGp8t-hCCcH_Bbydd3W8vCLPbdtGLpSXlecsJdUMyEZ-R4i7d56copAT6erQtq1DkZiY77ZFMnlBetA9tX24i75RATOLlC7Agaffx_2fpn0jNJndIDhahEGWK-Imu1QevPVpOZSfabGlFPLjePlxNSS2hp3EGuNRrsoQsDtjEYf_jq9pwnJHYLnQ9yCq8HZLNBS9Ivrh3oJH5kktTCbvODwFUo5iwnmnjxVUCx-0NL',
          price: 2299,
          brand: 'JioCoder Custom',
        },
        {
          id: 'spotlight-1',
          name: 'Titan-X Pro Mouse',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPTnPR2ZYt_a6VaISccTem49dOMrTwIeqIByZotD0MSDbynXY1x4jRH3kg8-Zh-qrbNn1w0WLg2nfSAzcB8STxJNCIKxO5SUb6EHtAd-_H9SntE78Ey0byBkeSf2PMVLS-ndiYmeQaWRKT5ZdiF4DIJh837aYSuixZD12MhQQN2TxFwEvl014VM1X3bhPHDJmuFIxzRrjbiYKMIu6nIdy13CpeF94iJsBTtzZLSLKI4FKoZrqif0csbfYmFwMxn0qhzkkrBNVyjWB',
          price: 8999,
          brand: 'JioCoder',
        },
      ];
      setAllProducts(products);
    }
  }, []);

  const isInSection = (productId: string, sectionType: 'trending' | 'spotlight') => {
    return sectionProducts.some(
      (sp) => sp.productId === productId && sp.sectionType === sectionType
    );
  };

  const handleToggleProduct = (productId: string, sectionType: 'trending' | 'spotlight') => {
    const existing = sectionProducts.find(
      (sp) => sp.productId === productId && sp.sectionType === sectionType
    );
    let updated: SectionProduct[];

    if (existing) {
      // Remove from section
      updated = sectionProducts.filter((sp) => sp.id !== existing.id);
      // Reorder remaining items in this section
      updated = updated.map((sp) => {
        if (sp.sectionType === sectionType && sp.order > existing.order) {
          return { ...sp, order: sp.order - 1 };
        }
        return sp;
      });
    } else {
      // Add to section
      const sectionProductsOfType = sectionProducts.filter((sp) => sp.sectionType === sectionType);
      const newOrder = sectionProductsOfType.length + 1;
      const newSectionProduct: SectionProduct = {
        id: `sp-${Date.now()}`,
        productId,
        sectionType,
        order: newOrder,
      };
      updated = [...sectionProducts, newSectionProduct];
    }

    setSectionProducts(updated);
    localStorage.setItem('sectionProducts', JSON.stringify(updated));
  };

  const handleReorder = (index: number, direction: 'up' | 'down', sectionType: 'trending' | 'spotlight') => {
    const sectionItems = sectionProducts
      .filter((sp) => sp.sectionType === sectionType)
      .sort((a, b) => a.order - b.order);
    
    if (direction === 'up' && index > 0) {
      const updated = [...sectionProducts];
      const currentItem = sectionItems[index];
      const prevItem = sectionItems[index - 1];
      
      updated.forEach((sp) => {
        if (sp.id === currentItem.id) sp.order = prevItem.order;
        else if (sp.id === prevItem.id) sp.order = currentItem.order;
      });
      
      setSectionProducts(updated);
      localStorage.setItem('sectionProducts', JSON.stringify(updated));
    } else if (direction === 'down' && index < sectionItems.length - 1) {
      const updated = [...sectionProducts];
      const currentItem = sectionItems[index];
      const nextItem = sectionItems[index + 1];
      
      updated.forEach((sp) => {
        if (sp.id === currentItem.id) sp.order = nextItem.order;
        else if (sp.id === nextItem.id) sp.order = currentItem.order;
      });
      
      setSectionProducts(updated);
      localStorage.setItem('sectionProducts', JSON.stringify(updated));
    }
  };

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSectionProducts = sectionProducts
    .filter((sp) => sp.sectionType === selectedSection)
    .sort((a, b) => a.order - b.order)
    .map((sp) => {
      const product = allProducts.find((p) => p.id === sp.productId);
      return product ? { ...sp, product } : null;
    })
    .filter((item): item is SectionProduct & { product: Product } => item !== null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Section Products Management</h1>
          <p className="text-gray-600 mt-1">Manage products displayed in homepage sections</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedSection('trending')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedSection === 'trending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined align-middle mr-2">trending_up</span>
            Trending Products
          </button>
          <button
            onClick={() => setSelectedSection('spotlight')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedSection === 'spotlight'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="material-symbols-outlined align-middle mr-2">light_mode</span>
            Product Spotlight
          </button>
        </div>
      </div>

      {/* Current Section Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            {selectedSection === 'trending' ? 'Trending Products' : 'Product Spotlight'} (
            {currentSectionProducts.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Products appear in this order on the homepage. Use arrows to reorder.
          </p>
        </div>
        {currentSectionProducts.length > 0 ? (
          <div className="p-6 space-y-4">
            {currentSectionProducts.map((sp, index) => (
              <div
                key={sp.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(index, 'up', selectedSection)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                  </button>
                  <button
                    onClick={() => handleReorder(index, 'down', selectedSection)}
                    disabled={index === currentSectionProducts.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={sp.product.image}
                    alt={sp.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase font-bold">{sp.product.brand}</p>
                  <h3 className="font-semibold text-gray-900">{sp.product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ₹{sp.product.price.toLocaleString()}
                    {sp.product.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">
                        ₹{sp.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleProduct(sp.productId, selectedSection)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              {selectedSection === 'trending' ? 'trending_up' : 'light_mode'}
            </span>
            <p className="text-gray-500">
              No products in {selectedSection === 'trending' ? 'Trending Products' : 'Product Spotlight'} section
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Select products from the list below to add them
            </p>
          </div>
        )}
      </div>

      {/* Available Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">Select Products</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts
              .filter((p) => !isInSection(p.id, selectedSection))
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleToggleProduct(product.id, selectedSection)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase font-bold">{product.brand}</p>
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleProduct(product.id, selectedSection);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                  </button>
                </div>
              ))}
          </div>
          {filteredProducts.filter((p) => !isInSection(p.id, selectedSection)).length === 0 && (
            <p className="text-center text-gray-500 py-8">
              {searchQuery ? 'No products found' : 'All products are already in this section'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

