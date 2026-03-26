'use client';

import { useState, useEffect } from 'react';

type CouponType = 'PERCENTAGE' | 'FIXED' | 'VOUCHER';
type CouponScope = 'ALL' | 'SPECIFIC_PRODUCTS';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  scope: CouponScope;
  applicableProductIds: string[];
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  code: '',
  description: '',
  type: 'FIXED' as CouponType,
  value: '',
  scope: 'ALL' as CouponScope,
  applicableProductIds: '',
  minOrderValue: '',
  maxDiscount: '',
  usageLimit: '',
  perUserLimit: '',
  validFrom: new Date().toISOString().slice(0, 16),
  validUntil: new Date(Date.now() + 30 * 86400_000).toISOString().slice(0, 16),
  isActive: true,
};

const TYPE_LABELS: Record<CouponType, string> = {
  PERCENTAGE: 'Percentage',
  FIXED: 'Fixed Amount',
  VOUCHER: 'Voucher',
};

const TYPE_COLORS: Record<CouponType, string> = {
  PERCENTAGE: 'bg-purple-100 text-purple-700',
  FIXED: 'bg-blue-100 text-blue-700',
  VOUCHER: 'bg-amber-100 text-amber-700',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: String(coupon.value),
      scope: coupon.scope,
      applicableProductIds: coupon.applicableProductIds.join(', '),
      minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : '',
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : '',
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : '',
      perUserLimit: coupon.perUserLimit ? String(coupon.perUserLimit) : '',
      validFrom: coupon.validFrom.slice(0, 16),
      validUntil: coupon.validUntil.slice(0, 16),
      isActive: coupon.isActive,
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    setError('');
    if (!formData.code.trim()) { setError('Coupon code is required'); return; }
    if (!formData.value) { setError('Discount value is required'); return; }
    if (!formData.validFrom || !formData.validUntil) { setError('Validity dates are required'); return; }
    if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      setError('Valid Until must be after Valid From');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...(editing ? { id: editing._id } : {}),
        code: formData.code.toUpperCase().trim(),
        description: formData.description,
        type: formData.type,
        value: Number(formData.value),
        scope: formData.scope,
        applicableProductIds: formData.applicableProductIds
          ? formData.applicableProductIds.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : 0,
        perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 0,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        isActive: formData.isActive,
      };

      const res = await fetch('/api/admin/coupons', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save coupon'); return; }

      await fetchCoupons();
      setShowModal(false);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon._id, isActive: !coupon.isActive }),
      });
      await fetchCoupons();
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      setDeleteConfirm(null);
      await fetchCoupons();
    } catch { /* silent */ }
  };

  const filtered = coupons.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && c.isActive) ||
      (filterStatus === 'INACTIVE' && !c.isActive);
    return matchSearch && matchStatus;
  });

  const isExpired = (date: string) => new Date(date) < new Date();
  const isUpcoming = (from: string) => new Date(from) > new Date();

  const getStatusBadge = (c: Coupon) => {
    if (!c.isActive) return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">Inactive</span>;
    if (isExpired(c.validUntil)) return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">Expired</span>;
    if (isUpcoming(c.validFrom)) return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">Upcoming</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">Active</span>;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatDiscount = (c: Coupon) => c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value.toLocaleString('en-IN')}`;

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive && !isExpired(c.validUntil) && !isUpcoming(c.validFrom)).length,
    totalUses: coupons.reduce((s, c) => s + c.usageCount, 0),
    expired: coupons.filter((c) => isExpired(c.validUntil)).length,
  };

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Admin coupon management</h1>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Coupons', value: stats.total, icon: 'discount', color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Now', value: stats.active, icon: 'check_circle', color: 'bg-green-50 text-green-600' },
          { label: 'Total Uses', value: stats.totalUses, icon: 'shopping_cart', color: 'bg-purple-50 text-purple-600' },
          { label: 'Expired', value: stats.expired, icon: 'timer_off', color: 'bg-red-50 text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Discount Coupons</h2>
            <p className="text-sm text-gray-500 mt-1">Create and manage coupon codes for your store</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create Coupon
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">search</span>
            <input
              className="w-full pl-10 pr-4 h-10 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search by code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 h-10 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-3">discount</span>
            <p className="font-medium">{search ? 'No coupons match your search' : 'No coupons yet'}</p>
            {!search && (
              <button onClick={openCreate} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                Create your first coupon
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Code</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Discount</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Validity</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Usage</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono font-bold text-gray-900 text-base tracking-wider">{c.code}</span>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{c.description}</p>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[c.type]}`}>
                          {TYPE_LABELS[c.type]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-gray-900 text-lg">{formatDiscount(c)}</span>
                        {c.type === 'PERCENTAGE' && c.maxDiscount && (
                          <p className="text-xs text-gray-500">Max ₹{c.maxDiscount.toLocaleString('en-IN')}</p>
                        )}
                        {c.minOrderValue > 0 && (
                          <p className="text-xs text-gray-500">Min order ₹{c.minOrderValue.toLocaleString('en-IN')}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {c.scope === 'ALL' ? 'All products' : `${c.applicableProductIds.length} product(s)`}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600">
                        <p><span className="font-medium">From:</span> {formatDate(c.validFrom)}</p>
                        <p><span className="font-medium">Until:</span> {formatDate(c.validUntil)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <span className="text-xl font-bold text-gray-900">{c.usageCount}</span>
                        <p className="text-xs text-gray-500">
                          {c.usageLimit > 0 ? `/ ${c.usageLimit} limit` : 'unlimited'}
                        </p>
                        {c.usageLimit > 0 && (
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 mx-auto">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.min((c.usageCount / c.usageLimit) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {getStatusBadge(c)}
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                            c.isActive
                              ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(c._id)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
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
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
              )}

              {/* Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase tracking-widest"
                  placeholder="e.g. SAVE20, WELCOME500"
                  disabled={!!editing}
                />
                <p className="text-xs text-gray-400 mt-1">Uppercase only, no spaces. Code cannot be changed after creation.</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 20% off on all keyboards"
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="FIXED">Fixed Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="VOUCHER">Voucher / Gift Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
                      {formData.type === 'PERCENTAGE' ? '%' : '₹'}
                    </span>
                    <input
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      max={formData.type === 'PERCENTAGE' ? 100 : undefined}
                      className="w-full h-11 pl-8 pr-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={formData.type === 'PERCENTAGE' ? '20' : '500'}
                    />
                  </div>
                </div>
              </div>

              {/* Max Discount (for %) */}
              {formData.type === 'PERCENTAGE' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Max Discount Cap (₹) <span className="text-gray-400 font-normal">— optional</span>
                  </label>
                  <input
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2000 (max ₹2,000 off)"
                  />
                </div>
              )}

              {/* Scope */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Applies To</label>
                <div className="flex gap-3">
                  {(['ALL', 'SPECIFIC_PRODUCTS'] as const).map((s) => (
                    <label key={s} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="scope"
                        value={s}
                        checked={formData.scope === s}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <div className="h-11 flex items-center justify-center gap-2 rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all text-sm font-medium">
                        <span className="material-symbols-outlined text-base">
                          {s === 'ALL' ? 'all_inclusive' : 'inventory_2'}
                        </span>
                        {s === 'ALL' ? 'All Products' : 'Specific Products'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Applicable Product IDs */}
              {formData.scope === 'SPECIFIC_PRODUCTS' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Product Slugs / IDs <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="applicableProductIds"
                    value={formData.applicableProductIds}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                    placeholder="keychron-k3, razer-deathadder, ..."
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma-separated product slugs or IDs</p>
                </div>
              )}

              {/* Min Order & Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Min Order (₹)</label>
                  <input
                    name="minOrderValue"
                    value={formData.minOrderValue}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0 = no minimum"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Uses Limit</label>
                  <input
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0 = unlimited"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Per User Limit</label>
                  <input
                    name="perUserLimit"
                    value={formData.perUserLimit}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0 = unlimited"
                  />
                </div>
              </div>

              {/* Validity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Valid From <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleChange}
                    type="datetime-local"
                    className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Valid Until <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleChange}
                    type="datetime-local"
                    className="w-full h-11 px-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Coupon Status</p>
                  <p className="text-xs text-gray-500">Inactive coupons cannot be applied at checkout</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">{formData.isActive ? 'Active' : 'Inactive'}</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">save</span> {editing ? 'Update Coupon' : 'Create Coupon'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Coupon?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
