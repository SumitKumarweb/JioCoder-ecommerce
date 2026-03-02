'use client';

import { useState } from 'react';
import TopUpModal from './TopUpModal';

export default function TopUpCreditButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="px-8 py-3.5 bg-white text-primary text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg shadow-black/20"
      >
        Top Up Credit
      </button>
      <TopUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
