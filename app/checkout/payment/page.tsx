'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { useCart } from '@/contexts/CartContext';

export default function PaymentPage() {
  const { cartItems, getSubtotal, getGST, getTotalPrice } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');

  const subtotal = getSubtotal();
  const gst = getGST();
  const total = getTotalPrice();
  const discount = 1000; // Applied discount
  const finalTotal = total - discount;

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-8 p-8 rounded-full bg-slate-100">
              <span className="material-symbols-outlined text-8xl text-slate-300">shopping_cart</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8">
              Please add items to your cart before proceeding to payment.
            </p>
            <Link
              href="/cart"
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Go to Cart
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const paymentMethods = [
    { id: 'upi', label: 'UPI (Scan & Pay)', icon: 'qr_code_2' },
    { id: 'cards', label: 'Cards (Debit/Credit)', icon: 'credit_card' },
    { id: 'netbanking', label: 'Net Banking', icon: 'account_balance' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'payments', subtitle: 'Available for this order' },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout', href: '/checkout' },
            { label: 'Payment' },
          ]}
        />

        {/* Checkout Progress */}
        <div className="mb-10 max-w-3xl mx-auto mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Shipping</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-4 rounded-full"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-primary/20">
                <span className="text-sm font-bold">2</span>
              </div>
              <span className="text-xs font-bold text-slate-900">Payment</span>
            </div>
            <div className="flex-1 h-1 bg-slate-200 mx-4 rounded-full"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                <span className="text-sm font-bold">3</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Payment Methods */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                  Select Payment Method
                </h2>
              </div>
              <div className="flex flex-col md:flex-row min-h-[500px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full text-left p-5 flex items-center gap-3 transition-all border-l-4 ${
                        selectedPaymentMethod === method.id
                          ? 'bg-white border-primary active-tab'
                          : 'border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined ${
                          selectedPaymentMethod === method.id ? 'text-primary' : 'text-slate-500'
                        }`}
                      >
                        {method.icon}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={
                            selectedPaymentMethod === method.id ? 'font-semibold' : 'font-medium'
                          }
                        >
                          {method.label}
                        </span>
                        {method.subtitle && (
                          <span className="text-[10px] text-slate-400">{method.subtitle}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Payment Content */}
                <div className="flex-1 p-8">
                  {selectedPaymentMethod === 'upi' && (
                    <div className="space-y-8">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-white rounded-lg shadow-md border border-slate-100">
                          <div className="size-48 bg-slate-50 rounded flex items-center justify-center relative">
                            {/* QR Code */}
                            <div
                              className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=jiocoder-payment-${finalTotal}')] bg-contain opacity-90"
                            ></div>
                            <div className="z-10 bg-white p-1 rounded-sm border border-slate-200">
                              <span className="material-symbols-outlined text-primary text-3xl">flash_on</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Scan QR to pay instantly</h3>
                          <p className="text-sm text-slate-500">Use GPay, PhonePe, Paytm or any UPI App</p>
                        </div>
                        <div className="flex gap-4 grayscale opacity-70">
                          <img
                            alt="GPay"
                            className="h-6"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASAx7r9LP7kIsvfFiVCWRh5duekO4zGSU4WsG25cTC9k7h01Ps9qUrVUSntAHRoZEoedaEDV_YJX9tBZ2oOUPp-r_6XCtxPTClrh30rUA5B2hN9xh752C8M-OIOcZ8i60Pz8pGmlx9Cu0n2uvEi_AF-UdLOU_YgP8zLFa8x0yV4WeNVkGlhcPK-i1-LiJO_JBGgNLfvWa3_QuKUeYZHi9yyONB5SnZcZywo1rmMyUv-F51ev3CkMKmgWooufHXeRwrkU9mAvGnwSQT"
                          />
                          <img
                            alt="UPI"
                            className="h-6"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNJp_vALJW5tVu-jkTr0noFNy-QUcKQq3vPAp2l5sgdaDl-iDx0hET1cv9nWEC24gfXrOQtSNETTgG9mD89zCkJ70760qQXdU7BDWEOXkDwfez_Jh8Y6iv8L7oPbsYt2qourQ_0Mbgwn7Zn9wCmhB_GlaOy53_aKqmi0Ys27ItKAeg6CIyZZ8NfGd8RaEjSXqktXibck25hw1pT_FPG5Tkf61zAUilQNi0T2PzKLRAyJpgxvMOMtZl1GHMMd_j_SPHvmiZqFcg7Yej"
                          />
                          <img
                            alt="Paytm"
                            className="h-4 mt-1"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-W1T7kVb3ns3TJY-F-uBEwYBHwr3tTDMdoyg4w1YG2Hgm9MPgTQXg6EFht5LNkbnqfUrFCDG4ody3FxQYdHj3ayC3nbX40oXRTqyaHbNZ_OYYen3XnqVBzRBThkFY9UF0VzCmrkGAmaGL6sMjOYCjAMNmMDOy1CUG5LkjXlhP09qNeHB1aoMgCnwkFemsdcBevAVcT3iKR6PFaE5o2rSFB9vLOedfOiYu11TqeaudH90vojBo1SB1WwfTi2oooeC_zRz8_Qp0fMUD"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-slate-500">Or Pay using VPA</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">Enter UPI ID (VPA)</label>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 h-12 px-4 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            placeholder="example@okhdfcbank"
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                          <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary/20 transition-colors">
                            Verify
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 italic">
                          Securely verify your VPA before proceeding with the payment request.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'cards' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-4">Card Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                            <input
                              className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                              placeholder="1234 5678 9012 3456"
                              type="text"
                              maxLength={19}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Expiry</label>
                              <input
                                className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="MM/YY"
                                type="text"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                              <input
                                className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="123"
                                type="text"
                                maxLength={3}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                            <input
                              className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                              placeholder="John Doe"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'netbanking' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-4">Select Bank</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                            <button
                              key={bank}
                              className="p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                            >
                              <span className="font-medium text-sm">{bank}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'cod' && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center text-center space-y-4 py-8">
                        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-4xl">payments</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Cash on Delivery</h3>
                          <p className="text-sm text-slate-500 mt-2">
                            Pay with cash when your order is delivered
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 text-left max-w-md">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold">Note:</span> Please keep exact change ready. Our delivery
                            partner will collect the payment upon delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="text-xs font-medium uppercase tracking-wider">256-bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span className="text-xs font-medium uppercase tracking-wider">PCI-DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span className="text-xs font-medium uppercase tracking-wider">Secure Indian Gateway</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold mb-6">Order Summary</h3>

                {/* Product Items */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="size-16 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity} {item.variant && `• ${item.variant}`}
                        </p>
                        <p className="text-sm font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="text-primary font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">GST (18%)</span>
                    <span className="font-medium">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-slate-100">
                    <span>Total Payable</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/checkout/success"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                >
                  Pay Now ₹{finalTotal.toLocaleString('en-IN')}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                  By clicking 'Pay Now', you agree to JioCoder's{' '}
                  <a className="underline" href="#">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="underline" href="#">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Offers */}
              <div className="bg-primary/5 rounded-xl border border-primary/20 p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary">sell</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Applied: ELECTRO_OFF_1000</h4>
                    <p className="text-xs text-slate-600">
                      Savings of ₹1,000 on first purchase included in price.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

