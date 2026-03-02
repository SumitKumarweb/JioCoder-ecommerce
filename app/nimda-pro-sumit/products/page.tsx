'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/components/ProductGrid';

interface TechnicalSpec {
  key: string;
  value: string;
}

interface QnA {
  question: string;
  answer: string;
}

interface ProductWithSku extends Product {
  sku?: string;
  description?: string;
  category?: string;
  stock?: number;
  images?: string[];
  videos?: string[];
  technicalSpecs?: TechnicalSpec[];
  qna?: QnA[];
  relatedProducts?: string[];
  tags?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithSku[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithSku | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    images: [] as string[],
    videos: [] as string[],
    price: '',
    originalPrice: '',
    brand: '',
    sku: '',
    description: '',
    category: '',
    stock: '',
    inStock: true,
    rating: '0',
    reviewCount: '0',
    technicalSpecs: [] as TechnicalSpec[],
    qna: [] as QnA[],
    relatedProducts: [] as string[],
    tags: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newTag, setNewTag] = useState('');
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Mock products - replace with API call
    const mockProducts: ProductWithSku[] = [
      {
        id: 'keyboard-1',
        name: 'Keychron K2 Wireless Mechanical Keyboard Version 2 (Brown Switches)',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYaK_kJQeDLBQe_vIhIfpvQFrKWDFMzT5uCj-WYv4_Yrg8fBz0tLw3B9Di8OGJpUq6MS2iK7p15s5cKdz59YvQTQOjXTWOvBvyGTlzbKzJDwOAxraZuylCZ8xUVYoya5pU74k7JRqXqhvZ6r5ByCp17LNHrQHqlKOWtSEVRu-oZViU2TpmAJIJCSgq7dgdOEZzSbDpZZgpzybypXPIFAnmRFPQ9V99esFHJeUFY0OObx28cOWcU-chPhuaZDKDNKacxKTB2qZ9-Yb',
        price: 7499,
        originalPrice: 9999,
        rating: 4.5,
        reviewCount: 2400,
        brand: 'Keychron',
        inStock: true,
        sku: 'KC-K2-BROWN-001',
        description: 'Wireless mechanical keyboard with brown switches',
        category: 'Keyboards',
        stock: 45,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBYYaK_kJQeDLBQe_vIhIfpvQFrKWDFMzT5uCj-WYv4_Yrg8fBz0tLw3B9Di8OGJpUq6MS2iK7p15s5cKdz59YvQTQOjXTWOvBvyGTlzbKzJDwOAxraZuylCZ8xUVYoya5pU74k7JRqXqhvZ6r5ByCp17LNHrQHqlKOWtSEVRu-oZViU2TpmAJIJCSgq7dgdOEZzSbDpZZgpzybypXPIFAnmRFPQ9V99esFHJeUFY0OObx28cOWcU-chPhuaZDKDNKacxKTB2qZ9-Yb',
        ],
        videos: [],
        technicalSpecs: [
          { key: 'Switch Type', value: 'Brown Switches' },
          { key: 'Connectivity', value: 'Wireless + USB-C' },
          { key: 'Battery Life', value: 'Up to 400 hours' },
        ],
        qna: [
          { question: 'Is this keyboard compatible with Mac?', answer: 'Yes, it works with Mac, Windows, and Linux.' },
        ],
        relatedProducts: ['keyboard-2'],
        tags: ['wireless', 'mechanical', 'brown-switch', 'mac-compatible'],
      },
      {
        id: 'keyboard-2',
        name: 'Logitech MX Keys S Wireless Illuminated Keyboard',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKsZQW7Nj6vNUklr5dWHdz5iJfptn4bvN3VhJPHWL1GnAZdGLW2rMKcvVd_zFLEQRH4GecddjmBOdn-uxam63prKZmXViUF8xIrjO4F_U7oF3v0iO4iNjAGitEpAob0PBeXyLAfe-OgJPEqkmZozUCVI_mW3rRUM_GAo2nF3n2KG5cwLvmyw7i8SDeuy40etjJKeTlen72g1t_UPzgke_zzEko3eJzGjgjKQIPGdpUMvGPJkt2KqveOeWJdOwrNtjDhnxlN52BXpUh',
        price: 12995,
        rating: 5,
        reviewCount: 5800,
        brand: 'Logitech',
        inStock: true,
        sku: 'LOG-MX-KEYS-S-001',
        description: 'Premium wireless keyboard with backlighting',
        category: 'Keyboards',
        stock: 32,
        images: [],
        videos: [],
        technicalSpecs: [],
        qna: [],
        relatedProducts: [],
        tags: [],
      },
    ];
    setProducts(mockProducts);
    setAvailableProducts(mockProducts);
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      image: '',
      images: [],
      videos: [],
      price: '',
      originalPrice: '',
      brand: '',
      sku: '',
      description: '',
      category: '',
      stock: '',
      inStock: true,
      rating: '0',
      reviewCount: '0',
      technicalSpecs: [],
      qna: [],
      relatedProducts: [],
      tags: [],
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: ProductWithSku) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      image: product.image,
      images: product.images || [],
      videos: product.videos || [],
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      brand: product.brand,
      sku: product.sku || '',
      description: product.description || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      inStock: product.inStock,
      rating: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      technicalSpecs: product.technicalSpecs || [],
      qna: product.qna || [],
      relatedProducts: product.relatedProducts || [],
      tags: product.tags || [],
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                rating: parseFloat(formData.rating),
                reviewCount: parseInt(formData.reviewCount),
                stock: formData.stock ? parseInt(formData.stock) : undefined,
                images: formData.images,
                videos: formData.videos,
                technicalSpecs: formData.technicalSpecs,
                qna: formData.qna,
                relatedProducts: formData.relatedProducts,
                tags: formData.tags,
              }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct: ProductWithSku = {
        id: `product-${Date.now()}`,
        name: formData.name,
        image: formData.image || formData.images[0] || '',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        brand: formData.brand,
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
        inStock: formData.inStock,
        sku: formData.sku,
        description: formData.description,
        category: formData.category,
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        images: formData.images,
        videos: formData.videos,
        technicalSpecs: formData.technicalSpecs,
        qna: formData.qna,
        relatedProducts: formData.relatedProducts,
        tags: formData.tags,
      };
      setProducts([...products, newProduct]);
      setAvailableProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const addVideo = () => {
    if (newVideoUrl.trim()) {
      setFormData({ ...formData, videos: [...formData.videos, newVideoUrl.trim()] });
      setNewVideoUrl('');
    }
  };

  const removeVideo = (index: number) => {
    setFormData({ ...formData, videos: formData.videos.filter((_, i) => i !== index) });
  };

  const addTechnicalSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData({
        ...formData,
        technicalSpecs: [...formData.technicalSpecs, { key: newSpecKey.trim(), value: newSpecValue.trim() }],
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeTechnicalSpec = (index: number) => {
    setFormData({
      ...formData,
      technicalSpecs: formData.technicalSpecs.filter((_, i) => i !== index),
    });
  };

  const addQnA = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setFormData({
        ...formData,
        qna: [...formData.qna, { question: newQuestion.trim(), answer: newAnswer.trim() }],
      });
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const removeQnA = (index: number) => {
    setFormData({ ...formData, qna: formData.qna.filter((_, i) => i !== index) });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const toggleRelatedProduct = (productId: string) => {
    if (formData.relatedProducts.includes(productId)) {
      setFormData({
        ...formData,
        relatedProducts: formData.relatedProducts.filter((id) => id !== productId),
      });
    } else {
      setFormData({ ...formData, relatedProducts: [...formData.relatedProducts, productId] });
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search products by name, brand, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price.toLocaleString()}
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock/Quantity *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Primary product image"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Multiple Images */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Images</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addImage()}
                  />
                  <button
                    onClick={addImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Image
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Videos</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addVideo()}
                  />
                  <button
                    onClick={addVideo}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Video
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.videos.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">{video}</span>
                      <button
                        onClick={() => removeVideo(index)}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <input
                    type="text"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Specification name (e.g., Switch Type)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addTechnicalSpec()}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Value (e.g., Brown Switches)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addTechnicalSpec()}
                    />
                    <button
                      onClick={addTechnicalSpec}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {formData.technicalSpecs.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{spec.key}:</span>
                        <span className="text-gray-700 ml-2">{spec.value}</span>
                      </div>
                      <button
                        onClick={() => removeTechnicalSpec(index)}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions & Answers */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions & Answers</h3>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Answer"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addQnA}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Q&A
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.qna.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">Q: {item.question}</p>
                          <p className="text-gray-700">A: {item.answer}</p>
                        </div>
                        <button
                          onClick={() => removeQnA(index)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Your Setup (Related Products) */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Setup</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select complementary products that go well with this product
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableProducts
                    .filter((p) => p.id !== editingProduct?.id)
                    .map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.relatedProducts.includes(product.id)}
                          onChange={() => toggleRelatedProduct(product.id)}
                          className="rounded"
                        />
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.brand}</div>
                        </div>
                      </label>
                    ))}
                </div>
              </div>

              {/* Product Tags */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Tags</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag (e.g., wireless, mechanical)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

