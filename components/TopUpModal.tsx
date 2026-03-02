'use client';

type TopUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="max-w-[1440px] w-full max-h-[90vh] overflow-y-auto bg-slate-50 dark:bg-slate-950 rounded-2xl shadow-2xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 right-0 flex justify-end p-4 z-10 bg-slate-50 dark:bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="px-6 pb-12 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                <div className="h-12 w-48 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
                <div className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
                <div className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
              </div>
            </div>
            <div className="h-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
