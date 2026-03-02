'use client';

import { useState, useEffect } from 'react';

interface FeaturedCategory {
  id: string;
  name: string;
  image: string;
  url: string;
}

export default function FeaturedCategoriesPage() {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeaturedCategory | null>(null);
  const [viewAllUrl, setViewAllUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    url: '',
  });

  useEffect(() => {
    // Load from localStorage (in real app, this would be an API call)
    const savedCategories = localStorage.getItem('featuredCategories');
    const savedViewAllUrl = localStorage.getItem('featuredCategoriesViewAllUrl');
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories
      const defaultCategories: FeaturedCategory[] = [
        {
          id: '1',
          name: 'Mouse Pads',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUuF1Tp2OQwl4ZcwIYnoPlMn05i9umoW5eaHxwxtpfbTCaK2avQqZln8FS3uW4YJu0Igiu_44aN5rueJLPl3RiPtaeTL0-3Sd7KMOKMzYaNFarJ22INs8uCqbO0SI4SJ1kDizPd7lqChN8PV97H1uz3z6OHox1gcpPYuoSt53UrMIrCiYnhJ_Y0lDi7_S3Kf0Vh-OP39jHCCDJe7E8aGFHz6gxklTDoG2-A2_el3BECN-iZ_ba1Q_9Fv991ECfpWfC4uuy4c4nEs8o',
          url: '/products?category=mouse-pads',
        },
        {
          id: '2',
          name: 'Keyboard Pads',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvGH-EeXfLPuwhzrnO3Ynx3TvEgLyyf3w9A7Ku9MYJXzUSg2T6V66y2UeVfWRXErQGUzLuau8p2vpuruuQI1DMHt3I-DPjPhiMgfM9GuKqeglLmHGiJbgkvgwj0Q38TiqNwiDFfSAbkM-W7hONdowZfcjqeXqcrrt8bFfzniZIvddBpqwFYuA-vQhuRaxLg3hFgLl3sNDGXaMsza6QqOHuBVFNN1S15yKqDUR5vZm1mcbCFowTeykGjZIINx45hBbvsEciIvsTgQnL',
          url: '/products?category=keyboard-pads',
        },
        {
          id: '3',
          name: 'USB Cables',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWOvP1R8IJO4522_t8YwGqfG64pVnKfLnwYxllNqEkk9b9m7mU1BVZOvxjS7WNfNcg3RjXxrk8vopMjzrMAwsCjw5lK7Z5PwrJE4pledhAXNo9gHg26XuQhnR23aEwFZZYw2y7v_FAL9FJVD2eDF1VXZZPhakgHBeL67o-C9lEFv3jcubO4cTkvLEmSw8jHZ6spwv_laBb4yv5LOaGE_0PrrQKtvfjRoJIWasLcsiO4t8_kqgrRqF_-LMPnfoOXbGQzFRXeyUY5JmC',
          url: '/products?category=usb-cables',
        },
        {
          id: '4',
          name: 'Keyboards',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQyC6WFTf8MJOcWjJFwxdZ56gafGjIO355ezHoArGqNVxMvTh7rSuWRStgoQ2e0SCBcXgVU0QW2IYM3qSa4FZMO9-MIfH_KWadR2rwSHDAF9YZen4Z-E3y1tXF3GrXMChtxeB4u_v4nEJHTWnabdNueSJS0SWbBkwWIKtXFz1Iqlu2JGFHU7MJ3YOZ6O9b_lFV_W3fizQDFR7wleMqzOZ8a16yecgjjuiSvZ_4-WpIfo-W-_npJyLCHNUZJRXbJHkW3BfxMHrQOxh',
          url: '/products?category=keyboards',
        },
        {
          id: '5',
          name: 'Mouse',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7pqAe9FhogQPescCwg25uS_lHUhAD4fx956xXVlL_ufPTZkHumFcKqS4B5PdipKw_lbAxHGq1Gd53aUJB4ZX_PNzxP18D_3xpbV1PRVGxEH5SE3rpRcY71s9fKuvdCaVN5_jqJnqtC1yup7iv6n1cYUQj2doA_CcAOJeqRLoA2hb559SDFaNS8cvkdLs9UiXCCZIXYuvoHkYDNUZc9j9NeSxQzW9uIKlgSODd9ciEj4bsz2V9bR0mJLK6ls-p-SpgXqgV0ZgWzFlA',
          url: '/products?category=mouse',
        },
      ];
      setCategories(defaultCategories);
      localStorage.setItem('featuredCategories', JSON.stringify(defaultCategories));
    }
    
    if (savedViewAllUrl) {
      setViewAllUrl(savedViewAllUrl);
    } else {
      setViewAllUrl('/products');
      localStorage.setItem('featuredCategoriesViewAllUrl', '/products');
    }
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '', url: '' });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: FeaturedCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: category.image,
      url: category.url,
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      // Update existing category
      const updated = categories.map((cat) =>
        cat.id === editingCategory.id
          ? { ...cat, ...formData }
          : cat
      );
      setCategories(updated);
      localStorage.setItem('featuredCategories', JSON.stringify(updated));
    } else {
      // Add new category
      const newCategory: FeaturedCategory = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        image: formData.image,
        url: formData.url,
      };
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem('featuredCategories', JSON.stringify(updated));
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const updated = categories.filter((cat) => cat.id !== id);
      setCategories(updated);
      localStorage.setItem('featuredCategories', JSON.stringify(updated));
    }
  };

  const handleSaveViewAllUrl = () => {
    localStorage.setItem('featuredCategoriesViewAllUrl', viewAllUrl);
    alert('View All URL saved successfully!');
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    if (direction === 'up' && index > 0) {
      [newCategories[index - 1], newCategories[index]] = [
        newCategories[index],
        newCategories[index - 1],
      ];
    } else if (direction === 'down' && index < newCategories.length - 1) {
      [newCategories[index], newCategories[index + 1]] = [
        newCategories[index + 1],
        newCategories[index],
      ];
    }
    setCategories(newCategories);
    localStorage.setItem('featuredCategories', JSON.stringify(newCategories));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Categories</h1>
          <p className="text-gray-600 mt-1">Manage featured categories displayed on homepage</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add Category
        </button>
      </div>

      {/* View All URL Setting */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">View All URL</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={viewAllUrl}
            onChange={(e) => setViewAllUrl(e.target.value)}
            placeholder="/products"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSaveViewAllUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save URL
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This URL will be used for the "View All" link in the Featured Categories section
        </p>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Categories ({categories.length})
          </h2>
        </div>
        {categories.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-500 truncate mb-2" title={category.url}>
                        URL: {category.url}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                        <div className="flex flex-col ml-auto">
                          <button
                            onClick={() => handleReorder(index, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
                          </button>
                          <button
                            onClick={() => handleReorder(index, 'down')}
                            disabled={index === categories.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              category
            </span>
            <p className="text-gray-500">No categories added yet</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mouse Pads"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-20 h-20 object-contain bg-gray-100 rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category URL *
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="/products?category=mouse-pads"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL where users will be redirected when clicking this category
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={!formData.name || !formData.image || !formData.url}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

