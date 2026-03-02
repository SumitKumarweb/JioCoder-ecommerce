'use client';

import { useState } from 'react';
import ElectroPayTopUpModal from './ElectroPayTopUpModal';

export default function ElectroPayBalanceCard() {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-br from-primary to-jiocoder-navy rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] size-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <p className="text-white/80 font-medium text-sm mb-1">Available Balance</p>
            <h2 className="text-5xl font-black tracking-tight">₹25,000.00</h2>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-white/60 bg-white/10 px-3 py-1.5 rounded-full w-fit">
              <span className="material-symbols-outlined !text-sm fill-1">verified</span>
              Fully Verified Account
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <button
              type="button"
              onClick={() => setIsTopUpOpen(true)}
              className="px-8 py-3.5 bg-white text-primary text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg shadow-black/20"
            >
              Top Up Credit
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Auto-Refill</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400" />
              </label>
            </div>
          </div>
        </div>
      </div>
      <ElectroPayTopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </>
  );
}
