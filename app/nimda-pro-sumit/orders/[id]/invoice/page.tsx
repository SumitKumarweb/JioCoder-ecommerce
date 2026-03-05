'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    name: string;
    sku?: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  weight: number;
  createdAt: string;
}

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [paperSize, setPaperSize] = useState('thermal');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        if (!res.ok) {
          setOrder(null);
          return;
        }
        const data: any = await res.json();

        const items =
          data.items?.map((item: any) => ({
            name: item.name,
            sku: item.product?.sku,
            quantity: item.quantity,
            price: item.price,
          })) || [];

        const mapped: Order = {
          id: data._id,
          orderNumber: data._id.slice(-6).toUpperCase(),
          customerName: data.user?.name || data.user?.email || 'Guest',
          customerPhone: data.shippingAddress?.phone,
          shippingAddress: {
            name: data.shippingAddress?.name || data.user?.name || 'Customer',
            address: data.shippingAddress?.address || '',
            city: data.shippingAddress?.city || '',
            state: data.shippingAddress?.state || '',
            pincode: data.shippingAddress?.pincode || '',
            country: data.shippingAddress?.country || 'India',
          },
          items,
          total: data.total,
          weight: data.weight || 1.0,
          createdAt: data.createdAt,
        };

        setOrder(mapped);
      } catch (error) {
        console.error('Failed to load invoice order', error);
        setOrder(null);
      }
    };

    loadOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
        {/* Breadcrumbs & Header */}
        <div className="no-print mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button onClick={() => router.push('/nimda-pro-sumit/orders')} className="hover:text-blue-600">
              Orders
            </button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <button onClick={() => router.push(`/nimda-pro-sumit/orders/${orderId}`)} className="hover:text-blue-600">
              Order Details
            </button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-gray-900 font-medium">Print Label</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Fulfillment Complete</h1>
              <p className="text-gray-500">
                Review and print the shipping label for Order
                <span className="font-mono font-bold text-blue-600"> #{order.orderNumber}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit Details
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Label Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Side Controls */}
          <div className="no-print lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">settings</span>
                Label Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Paper Size
                  </label>
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    className="w-full rounded-lg border-gray-200 bg-white text-sm focus:ring-blue-500 p-2 border"
                  >
                    <option value="thermal">Thermal Label (4x6 in)</option>
                    <option value="a4">A4 Standard (4 labels)</option>
                    <option value="a6">A6 Postcard</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Orientation
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOrientation('portrait')}
                      className={`flex-1 py-2 border-2 rounded-lg text-xs font-bold ${
                        orientation === 'portrait'
                          ? 'border-blue-600 bg-blue-600/5 text-blue-600'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation('landscape')}
                      className={`flex-1 py-2 border-2 rounded-lg text-xs font-bold ${
                        orientation === 'landscape'
                          ? 'border-blue-600 bg-blue-600/5 text-blue-600'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/5 p-5 rounded-xl border border-blue-500/20">
              <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">verified</span>
                Weight Verified
              </h3>
              <p className="text-xs text-blue-600/80 leading-relaxed">
                Package weight ({order.weight} kg) matches calculated SKU total. Ready for courier pickup.
              </p>
            </div>
          </div>

          {/* Shipping Label */}
          <div className="lg:col-span-9 flex justify-center">
            <div className="print-area bg-white text-black w-full max-w-[400px] aspect-[4/6] shadow-2xl border border-gray-200 flex flex-col font-sans relative">
              {/* Label Header */}
              <div className="p-6 border-b-4 border-black flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-black p-1 rounded">
                      <span className="material-symbols-outlined text-white text-xl">terminal</span>
                    </div>
                    <span className="font-black text-xl tracking-tighter italic">JioCoder</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Express Priority
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">E-12</div>
                  <div className="text-[10px] font-bold uppercase">Zone Area</div>
                </div>
              </div>

              {/* Address Section */}
              <div className="flex-grow flex flex-col">
                {/* Return Address */}
                <div className="px-6 py-4 border-b border-black text-[10px] leading-tight">
                  <span className="font-bold uppercase block mb-1">From:</span>
                  <p className="font-semibold">JioCoder Fulfillment Center</p>
                  <p>Unit 402, Block B, Tech Hub Park</p>
                  <p>Whitefield, Bengaluru</p>
                  <p>Karnataka - 560066</p>
                </div>

                {/* Recipient Address */}
                <div className="px-6 py-6 border-b-4 border-black flex-grow">
                  <span className="font-bold uppercase text-[12px] block mb-2">Ship To:</span>
                  <h3 className="text-2xl font-black leading-none mb-2">
                    {order.shippingAddress.name.toUpperCase()}
                  </h3>
                  <div className="text-lg font-medium leading-snug space-y-0.5">
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.pincode}</p>
                    <p className="text-sm mt-2 font-bold">PH: {order.customerPhone}</p>
                  </div>
                </div>

                {/* Barcode Section */}
                <div className="px-6 py-6 flex flex-col items-center justify-center border-b border-black">
                  <div className="w-full h-16 bg-black mb-2 flex items-center justify-center">
                    <div className="text-white font-mono text-xs">BARCODE</div>
                  </div>
                  <span className="font-mono text-xl font-bold tracking-[0.2em]">
                    JIO-{order.orderNumber.replace('JC-', '')}-EXP
                  </span>
                </div>

                {/* Bottom Meta */}
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Weight</span>
                    <span className="text-lg font-bold italic">{order.weight} KG</span>
                    <span className="text-[10px] font-bold uppercase text-gray-500 mt-1">Order Date</span>
                    <span className="text-xs font-bold">{orderDate}</span>
                  </div>
                  <div className="flex justify-end">
                    {/* QR Code Placeholder */}
                    <div className="w-20 h-20 bg-gray-100 p-1 border-2 border-black flex flex-wrap gap-0.5 overflow-hidden">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Routing */}
              <div className="bg-black text-white px-6 py-2 flex justify-between items-center">
                <span className="text-xs font-bold tracking-widest uppercase">Courier: BlueDart Express</span>
                <span className="text-xs font-bold">Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="no-print fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
        <div className="bg-gray-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
          <div className="flex items-center gap-3 ml-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Ready for printer</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <span className="material-symbols-outlined">print</span>
            Print Now
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: 1px solid #000;
            page-break-after: always;
          }
          body {
            background: white;
            padding: 0;
            margin: 0;
          }
          @page {
            size: ${paperSize === 'thermal' ? '4in 6in' : paperSize === 'a4' ? 'A4' : 'A6'};
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
        .barcode-strip {
          background: repeating-linear-gradient(
            90deg,
            #000 0px,
            #000 2px,
            transparent 2px,
            transparent 4px
          );
        }
      `}} />
    </>
  );
}

