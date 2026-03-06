import SaleModal from "@/components/SaleModal";

export default function SaleModalPreviewPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl text-center space-y-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sale Modal Preview</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This page force-opens the sale modal so you can test the UI and the admin-managed content coming from{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">/api/sale-modal</code>.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Tip: to view the JSON directly, open{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">/api/sale-modal</code>.
        </p>
      </div>

      {/* Force-open modal overlay */}
      <SaleModal forceOpen />
    </div>
  );
}


