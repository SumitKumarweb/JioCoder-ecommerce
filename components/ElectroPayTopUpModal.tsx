'use client';

import { useState } from 'react';

type ElectroPayTopUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ElectroPayTopUpModal({ isOpen, onClose }: ElectroPayTopUpModalProps) {
  const [amount, setAmount] = useState<'1000' | '5000' | '10000' | 'custom'>('5000');
  const [customValue, setCustomValue] = useState('5000');
  const [payment, setPayment] = useState('upi');

  if (!isOpen) return null;

  const displayAmount = amount === 'custom' ? (customValue || '0') : amount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg max-h-[92vh] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 md:pt-8 pb-4 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-success/10 text-success rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined font-bold">account_balance_wallet</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">ElectroPay Top-Up</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Add credits to your JioCoder account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 space-y-5 sm:space-y-6">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-xl">redeem</span>
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Limited Offer!</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Get <span className="font-bold text-primary">5% extra credit</span> on top-ups over ₹5,000
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Select Amount
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setAmount('1000')}
                className={`py-3 px-4 border-2 rounded-xl text-sm font-bold transition-all ${
                  amount === '1000'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                ₹1,000
              </button>
              <button
                type="button"
                onClick={() => setAmount('5000')}
                className={`py-3 px-4 border-2 rounded-xl text-sm font-bold transition-all relative ${
                  amount === '5000'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                ₹5,000
                <span className="absolute -top-2 -right-1 bg-primary text-white text-[8px] px-1.5 py-0.5 rounded-full">
                  +5%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAmount('10000')}
                className={`py-3 px-4 border-2 rounded-xl text-sm font-bold transition-all ${
                  amount === '10000'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                ₹10,000
              </button>
            </div>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={amount === 'custom' ? customValue : ''}
                placeholder="Enter custom amount"
                onChange={(e) => {
                  setAmount('custom');
                  setCustomValue(e.target.value);
                }}
                onFocus={() => setAmount('custom')}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/20 focus:ring-0 rounded-xl py-3.5 pl-8 pr-4 text-sm font-semibold text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Payment Method
            </label>
            {[
              { id: 'upi', icon: 'account_balance', title: 'UPI (GPay, PhonePe, BHIM)', sub: 'Instant credit addition' },
              { id: 'card', icon: 'credit_card', title: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
              { id: 'netbanking', icon: 'lan', title: 'Net Banking', sub: 'All major Indian banks' },
            ].map((opt) => (
              <label
                key={opt.id}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="size-8 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                      {opt.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{opt.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{opt.sub}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === opt.id}
                  onChange={() => setPayment(opt.id)}
                  className="text-primary focus:ring-primary/20 size-4"
                />
              </label>
            ))}
          </div>
          <div className="pt-2">
            <button
              type="button"
              className="w-full bg-success text-white py-4 rounded-xl font-bold text-base hover:bg-success/90 transition-all shadow-lg shadow-success/20 flex items-center justify-center gap-2"
            >
              <span>Add ₹{Number(displayAmount || 0).toLocaleString('en-IN')} Credit</span>
              <span className="material-symbols-outlined !text-lg">arrow_forward</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-medium flex items-center justify-center gap-1">
              <span className="material-symbols-outlined !text-[12px]">lock</span>
              Your transactions are secured with 256-bit encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
