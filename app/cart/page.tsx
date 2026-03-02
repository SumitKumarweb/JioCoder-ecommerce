'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useCart } from '@/contexts/CartContext';

const frequentlyBoughtTogether = [
  {
    id: 'fbt-1',
    name: 'Premium XL Desk Mat',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0KVWlgx1gxDelTIA5_GVLmU9J95me49jPmrwy50wTzGLJGxj6GP59DbvYqxo8XAqb6Y2HiPvB3CGor1tEUL9Fi0OXePGrD0tlds7PYdZHW3Ok4OI5mDPiEJd0x7tahONhL5uEqFnD-mA8-QNdqM7Lc4jZlSvUfFl1V38WZC-ORwI_Kmufwu8ewTkXFzUVPat0Ua4BtBDYwyXeuALauZwiE35dZJ3WFlwobyHYqrVnpZa87TR5DybieawXCMJUt6icl0iadUWOz9xL',
    price: 1299,
  },
  {
    id: 'fbt-2',
    name: '7-in-1 USB-C Hub',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp7gDYjQrR7IYaYmhiAENlTEaSiOOyVNgYNpp8FD4o_GORTLPjPzduRcnR4T9lXeo9s0swYJQWY4pHlwOohUxSvJH9LmiYomhpJgeLatYpWKxGh1KejKnPWC0TE8pFwm5LjyQ_-1vAJZd-Gq1pRAaVj9rEmHEZHh0NvEOBYQN9IuDW3_sZrHa4LH8Qmp6V6E6zhknPUCLVeK0NaeEioLzOH6FJdEXuHOa1oDBJIRYirVlqs5TjZUhR-C486nUy2ozwJvAbFBTs1dh0',
    price: 3499,
  },
  {
    id: 'fbt-3',
    name: 'Hardshell Laptop Case',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBsX9SMcGhzmK4mPuh9rxrhrhDeQdKpqQhZZNLZ-BSGTflqNTxHmTXrRxxpRKGU8R97eh0U2z64qvLgGN1Q8ZkoqwqMfbhDtTXoAD4Rzn9p9B6RSPZSbdlLeefZ0CylEup-LKlRY2iCoymEBm26NsMearBv2OfquwCtlvZISy82wUSQg5p7Lh3-ZbY97QyovGrfBv1z9tefgrRScjdMuBhhh7hfLGeB7qXylEke4zJfWI564eHEq_Ga0KeZ-kWfXlhL3CkwNUIh-4x',
    price: 2199,
  },
];

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, addToCart, getSubtotal, getGST, getTotalPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    // Promo code logic would go here
    console.log('Applying promo code:', promoCode);
  };

  const subtotal = getSubtotal();
  const gst = getGST();
  const total = getTotalPrice();

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shopping Cart' },
            ]}
          />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-8 p-8 rounded-full bg-slate-100">
              <span className="material-symbols-outlined text-8xl text-slate-300">shopping_cart</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shopping Cart' },
          ]}
        />

        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Your Shopping Cart
          <span className="text-slate-400 font-normal text-xl ml-2">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items (70%) */}
          <div className="lg:w-[70%] space-y-6">
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-full sm:w-40 h-40 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-black text-slate-900 tracking-tight">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    {item.variant && (
                      <p className="text-sm text-slate-500 mb-4">{item.variant}</p>
                    )}
                    <div className="flex items-center gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">remove</span>
                        </button>
                        <input
                          className="w-10 text-center bg-transparent border-none focus:ring-0 font-bold text-sm"
                          type="text"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg text-primary">add</span>
                        </button>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">favorite</span>
                          <span>Wishlist</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Frequently Bought Together */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                Frequently Bought Together
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frequentlyBoughtTogether.map((product) => (
                  <div key={product.id} className="bg-white p-4 border border-slate-200 rounded-xl">
                    <img
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      alt={product.name}
                      src={product.image}
                    />
                    <h4 className="text-sm font-bold truncate">{product.name}</h4>
                    <p className="text-sm font-bold text-primary mb-3">₹{product.price.toLocaleString('en-IN')}</p>
                    <button
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                      }, false)}
                      className="w-full py-2 bg-primary/10 text-slate-900 hover:bg-primary hover:text-white transition-all rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (30%) */}
          <div className="lg:w-[30%]">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              {/* Costs */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>GST (18%)</span>
                    <span
                      className="material-symbols-outlined text-xs cursor-help"
                      title="Standard Indian Goods and Service Tax"
                    >
                      info
                    </span>
                  </div>
                  <span className="text-slate-900 font-medium">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-primary font-bold uppercase text-xs tracking-wider">Free</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6 pt-6 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                    placeholder="ELECTRO20"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-slate-100 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm text-slate-500 font-medium">Total Payable</span>
                    <p className="text-xs text-slate-400">Incl. of all taxes</p>
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="w-full bg-primary py-4 rounded-xl text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 grayscale opacity-50">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight">
                  <span className="material-symbols-outlined text-sm">security</span>
                  100% Secure
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight">
                  <span className="material-symbols-outlined text-sm">published_with_changes</span>
                  Easy Returns
                </div>
              </div>
            </div>

            {/* Shipping Message */}
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <div className="text-xs">
                <p className="font-bold text-slate-900 mb-0.5">Express Delivery Eligible</p>
                <p className="text-slate-600">
                  Order in the next 4 hours for guaranteed shipping by tomorrow morning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

