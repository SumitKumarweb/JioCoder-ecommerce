'use client';

import { useState, useEffect } from 'react';

type Status = 'PENDING' | 'PROCESSING' | 'PRINTING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

interface CustomOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  designImageUrl: string;
  designImageName: string;
  size: string;
  material: string;
  overlayText?: string;
  overlayFont?: string;
  overlayColor?: string;
  price: number;
  quantity: number;
  total: number;
  shippingAddress?: {
    address?: string;
    city?: string;
    state?: string;
    pin?: string;
  };
  status: Status;
  adminNotes?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  PENDING:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200'  },
  PROCESSING: { label: 'Processing', color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-200'   },
  PRINTING:   { label: 'Printing',   color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  SHIPPED:    { label: 'Shipped',    color: 'text-cyan-700',   bg: 'bg-cyan-50   border-cyan-200'   },
  COMPLETED:  { label: 'Completed',  color: 'text-green-700',  bg: 'bg-green-50  border-green-200'  },
  CANCELLED:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50    border-red-200'    },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as Status[];

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CustomOrder | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/studio/orders');
      if (!res.ok) throw new Error('Failed to fetch');
      setOrders(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: string, status: Status) => {
    setSaving(true);
    try {
      await fetch('/api/studio/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
      if (selected?._id === id) setSelected((p) => p ? { ...p, status } : p);
    } finally { setSaving(false); }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch('/api/studio/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected._id, adminNotes: notes }),
      });
      setOrders((prev) =>
        prev.map((o) => o._id === selected._id ? { ...o, adminNotes: notes } : o)
      );
      setSelected((p) => p ? { ...p, adminNotes: notes } : p);
    } finally { setSaving(false); }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    printing: orders.filter((o) => o.status === 'PRINTING').length,
    completed: orders.filter((o) => o.status === 'COMPLETED').length,
    revenue: orders.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Custom Order Print</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage custom mouse pad print orders from the Studio</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: stats.total,     icon: 'print',          color: 'text-gray-700',   bg: 'bg-gray-100'   },
          { label: 'Pending',      value: stats.pending,   icon: 'pending',         color: 'text-amber-700',  bg: 'bg-amber-50'   },
          { label: 'Printing',     value: stats.printing,  icon: 'local_printshop', color: 'text-violet-700', bg: 'bg-violet-50'  },
          { label: 'Completed',    value: stats.completed, icon: 'check_circle',    color: 'text-green-700',  bg: 'bg-green-50'   },
          { label: 'Revenue',      value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: 'currency_rupee', color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-4 border border-black/5`}>
            <div className={`flex items-center gap-2 ${color} mb-1`}>
              <span className="material-symbols-outlined text-lg">{icon}</span>
              <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number, name, email…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">print_disabled</span>
            <p className="text-gray-400 text-sm">No custom orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Order', 'Customer', 'Design', 'Size', 'Qty', 'Total', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => {
                  const sc = STATUS_CONFIG[order.status];
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-gray-900 whitespace-nowrap">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 whitespace-nowrap">{order.customerName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px]">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={order.designImageUrl}
                            alt="design"
                            className="w-12 h-9 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <span className="text-xs text-gray-500 truncate max-w-[80px]">{order.designImageName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{order.size}</td>
                      <td className="px-4 py-3 text-center font-bold text-gray-700">{order.quantity}</td>
                      <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as Status)}
                          disabled={saving}
                          className={`text-xs font-bold px-2 py-1 rounded-lg border cursor-pointer outline-none ${sc.bg} ${sc.color}`}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelected(order); setNotes(order.adminNotes || ''); }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                          title="View details"
                        >
                          <span className="material-symbols-outlined text-base">open_in_new</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer / Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-black text-gray-900 text-lg">{selected.orderNumber}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Custom Print Order</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {/* Design preview */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Design</p>
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <img
                    src={selected.designImageUrl}
                    alt="Design"
                    className="w-full h-48 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).alt = 'Image not available'; }}
                  />
                  {selected.overlayText && (
                    <div className="p-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400">
                        Text overlay:{' '}
                        <span
                          style={{
                            fontFamily: `"${selected.overlayFont}", sans-serif`,
                            color: selected.overlayColor,
                            fontWeight: 700,
                          }}
                        >
                          {selected.overlayText}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                  <Row label="Name" value={selected.customerName} />
                  <Row label="Email" value={selected.customerEmail} />
                  {selected.customerPhone && <Row label="Phone" value={selected.customerPhone} />}
                </div>
              </div>

              {/* Shipping */}
              {selected.shippingAddress && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                    {selected.shippingAddress.address && <Row label="Address" value={selected.shippingAddress.address} />}
                    {selected.shippingAddress.city && <Row label="City" value={selected.shippingAddress.city} />}
                    {selected.shippingAddress.state && <Row label="State" value={selected.shippingAddress.state} />}
                    {selected.shippingAddress.pin && <Row label="PIN" value={selected.shippingAddress.pin} />}
                  </div>
                </div>
              )}

              {/* Order details */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Details</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                  <Row label="Size" value={selected.size} />
                  <Row label="Material" value={selected.material} />
                  <Row label="Quantity" value={String(selected.quantity)} />
                  <Row label="Price/unit" value={`₹${selected.price.toLocaleString('en-IN')}`} />
                  <Row label="Total" value={`₹${selected.total.toLocaleString('en-IN')}`} bold />
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected._id, e.target.value as Status)}
                  disabled={saving}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Notes</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this order…"
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500 text-xs shrink-0">{label}</span>
      <span className={`text-gray-900 text-right text-xs break-all ${bold ? 'font-black text-sm' : ''}`}>{value}</span>
    </div>
  );
}
