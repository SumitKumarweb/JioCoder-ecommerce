'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZES = [
  { label: 'Small',  dims: '30 × 25 cm', price: 499  },
  { label: 'Medium', dims: '45 × 40 cm', price: 799  },
  { label: 'Large',  dims: '60 × 45 cm', price: 1199 },
  { label: 'XL',     dims: '90 × 45 cm', price: 1599 },
  { label: 'XXL',    dims: '120 × 60 cm', price: 2199 },
];

const MATERIALS = [
  { label: 'Stitched Edge', desc: 'Premium anti-fray stitched border', icon: 'border_style', extra: '+₹0' },
  { label: 'Standard',      desc: 'Clean cut edges, budget-friendly',  icon: 'crop_square',  extra: '-₹100' },
];

const BASE_COLORS = [
  { hex: '#0a0e1a', label: 'Midnight' },
  { hex: '#1e293b', label: 'Slate'    },
  { hex: '#94a3b8', label: 'Silver'   },
  { hex: '#1e1b4b', label: 'Indigo'   },
  { hex: '#7f1d1d', label: 'Crimson'  },
  { hex: '#14532d', label: 'Forest'   },
  { hex: '#431407', label: 'Bronze'   },
  { hex: '#f1f5f9', label: 'White'    },
];

const FONTS = ['Mono Space', 'Neo Sans', 'Playfair Display', 'Oswald', 'Dancing Script', 'Bebas Neue'];

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display&family=Oswald&family=Dancing+Script&family=Bebas+Neue&display=swap';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = 'graphics' | 'palette' | 'hardware' | 'detailing';

interface OrderForm {
  name: string; email: string; phone: string;
  address: string; city: string; state: string; pin: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function getImageResolutionLabel(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const px = img.naturalWidth * img.naturalHeight;
      if (px > 4000000) resolve('Excellent (300 DPI+)');
      else if (px > 1000000) resolve('Good (150 DPI)');
      else resolve('Low (72 DPI)');
    };
    img.onerror = () => resolve('Unknown');
    img.src = dataUrl;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudioPage() {
  // Design state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [resolutionLabel, setResolutionLabel] = useState('');
  const [resolutionPct, setResolutionPct] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [baseColor, setBaseColor] = useState(BASE_COLORS[0]);
  const [customHex, setCustomHex] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [overlayFont, setOverlayFont] = useState(FONTS[0]);
  const [overlayColor, setOverlayColor] = useState('#ffffff');
  const [activeTab, setActiveTab] = useState<TabKey>('graphics');
  const [quantity, setQuantity] = useState(1);

  // Drag pan state
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState<'form' | 'submitting' | 'success'>('form');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '', email: '', phone: '', address: '', city: '', state: '', pin: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<OrderForm>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveBaseColor = customHex || baseColor.hex;
  const total = selectedSize.price * quantity;

  // Inject Google Fonts
  useEffect(() => {
    if (document.getElementById('studio-gf')) return;
    const link = document.createElement('link');
    link.id = 'studio-gf';
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  // Prefill form from saved checkout data
  useEffect(() => {
    try {
      const saved = localStorage.getItem('checkoutFormData');
      if (saved) {
        const p = JSON.parse(saved);
        setOrderForm((prev) => ({
          ...prev,
          name: p.fullName || prev.name,
          email: p.email || prev.email,
          phone: p.mobile || prev.phone,
          address: p.address || prev.address,
          city: p.city || prev.city,
          state: p.state || prev.state,
          pin: p.pinCode || prev.pin,
        }));
      }
    } catch { /* ignore */ }
  }, []);

  // ── Image upload ─────────────────────────────────────────────────────────────

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      setUploadedFileName(file.name);
      setZoom(1);
      setImgPos({ x: 0, y: 0 });
      const label = await getImageResolutionLabel(dataUrl);
      setResolutionLabel(label);
      setResolutionPct(label.startsWith('Excellent') ? 95 : label.startsWith('Good') ? 60 : 25);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  // ── Drag-to-pan ──────────────────────────────────────────────────────────────

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - imgPos.x, y: e.clientY - imgPos.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setImgPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onMouseUp = () => { isDragging.current = false; };

  // ── Zoom ─────────────────────────────────────────────────────────────────────

  const zoomIn    = () => setZoom((z) => clamp(z + 0.15, 0.4, 3));
  const zoomOut   = () => setZoom((z) => clamp(z - 0.15, 0.4, 3));
  const zoomReset = () => { setZoom(1); setImgPos({ x: 0, y: 0 }); };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => clamp(z - e.deltaY * 0.001, 0.4, 3));
  };

  // ── Order form ───────────────────────────────────────────────────────────────

  const validateForm = () => {
    const errs: Partial<OrderForm> = {};
    if (!orderForm.name.trim())    errs.name    = 'Required';
    if (!orderForm.email.trim())   errs.email   = 'Required';
    if (!orderForm.phone.trim())   errs.phone   = 'Required';
    if (!orderForm.address.trim()) errs.address = 'Required';
    if (!orderForm.city.trim())    errs.city    = 'Required';
    if (!orderForm.state.trim())   errs.state   = 'Required';
    if (!orderForm.pin.trim())     errs.pin     = 'Required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;
    setOrderStep('submitting');
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const res = await fetch('/api/studio/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: orderForm.name,
          customerEmail: orderForm.email,
          customerPhone: orderForm.phone,
          userId: userId || undefined,
          designImageUrl: uploadedImage || '',
          designImageName: uploadedFileName,
          size: `${selectedSize.label} (${selectedSize.dims})`,
          material: selectedMaterial.label,
          overlayText: overlayText || undefined,
          overlayFont,
          overlayColor,
          price: selectedSize.price,
          quantity,
          total,
          shippingAddress: {
            address: orderForm.address,
            city: orderForm.city,
            state: orderForm.state,
            pin: orderForm.pin,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setOrderNumber(data.orderNumber);
      setOrderStep('success');
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please try again.');
      setOrderStep('form');
    }
  };

  // ── Preview pad size in px ───────────────────────────────────────────────────

  const padWidth = selectedSize.label === 'XXL' ? 480
    : selectedSize.label === 'XL'  ? 420
    : selectedSize.label === 'Large' ? 360
    : selectedSize.label === 'Medium' ? 300
    : 240;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a]">
      <Navbar />

      {/* Studio Body */}
      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden min-h-0">

        {/* ── LEFT: Preview ─────────────────────────────────────────────────── */}
        <section
          className="w-full lg:w-3/5 flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #0a0e1a, rgba(15,23,42,0.95))',
            minHeight: 'min(60vw, 520px)',
          }}
        >
          
 

          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[#135bec]/5 blur-[120px] rounded-full" />
          </div>

          {/* Pad Preview */}
          <div
            className="flex items-center justify-center w-full h-full"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
            style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
          >
            <div
              style={{
                transform: `scale(${zoom}) translate(${imgPos.x / zoom}px, ${imgPos.y / zoom}px)`,
                transition: isDragging.current ? 'none' : 'transform 0.15s ease',
                width: padWidth,
                aspectRatio: '3/2',
                position: 'relative',
              }}
              className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
            >
              {/* Pad surface */}
              <div
                className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative"
                style={{ background: effectiveBaseColor }}
              >
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Design"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                )}

                {/* Overlay text */}
                {overlayText && (
                  <div
                    className="absolute bottom-4 left-0 right-0 text-center px-3 pointer-events-none select-none"
                    style={{
                      fontFamily: overlayFont === 'Mono Space' ? 'monospace'
                        : overlayFont === 'Neo Sans' ? 'sans-serif'
                        : `"${overlayFont}", sans-serif`,
                      fontSize: 22,
                      color: overlayColor,
                      textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {overlayText}
                  </div>
                )}

                {/* Stitched edge */}
                {selectedMaterial.label === 'Stitched Edge' && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 0 8px rgba(255,255,255,0.08)',
                      border: '3px dashed rgba(255,255,255,0.12)',
                    }}
                  />
                )}

                {/* Hotspot (shown only without image, as design hint) */}
                {!uploadedImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-5xl text-slate-600">image</span>
                    <p className="text-xs text-slate-500 font-medium">Upload your design</p>
                  </div>
                )}
              </div>

              {/* Interactive hotspot dot */}
              {uploadedImage && (
                <div className="absolute top-1/4 left-1/3 size-6 bg-[#135bec]/20 border border-[#135bec] rounded-full animate-pulse flex items-center justify-center cursor-pointer z-10">
                  <div className="size-2 bg-[#135bec] rounded-full" />
                </div>
              )}
            </div>
          </div>

          {/* View Controls — bottom center bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#111827]/80 backdrop-blur border border-[#1e293b] p-2 rounded-xl shadow-2xl z-10">
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-[#135bec]/20 hover:text-[#135bec] rounded-lg transition-colors text-slate-400"
              title="Zoom in"
            >
              <span className="material-symbols-outlined">zoom_in</span>
            </button>
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-[#135bec]/20 hover:text-[#135bec] rounded-lg transition-colors text-slate-400"
              title="Zoom out"
            >
              <span className="material-symbols-outlined">zoom_out</span>
            </button>
            <div className="w-px h-6 bg-[#1e293b] mx-1" />
            <button
              onClick={zoomReset}
              className="p-2 hover:bg-[#135bec]/20 hover:text-[#135bec] rounded-lg transition-colors text-slate-400"
              title="Reset view"
            >
              <span className="material-symbols-outlined">3d_rotation</span>
            </button>
            <button
              onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
              className="p-2 hover:bg-[#135bec]/20 hover:text-[#135bec] rounded-lg transition-colors text-slate-400"
              title="Upload design"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </button>
            <div className="w-px h-6 bg-[#1e293b] mx-1" />
            <span className="text-[10px] font-mono text-slate-500 px-1 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </section>

        {/* ── RIGHT: Design Panel ───────────────────────────────────────────── */}
        <aside
          className="w-full lg:w-2/5 border-t lg:border-t-0 lg:border-l border-[#1e293b] bg-[#111827] flex flex-col overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 68px)' }}
        >
          {/* Tabs */}
          <div className="flex border-b border-[#1e293b] px-2 pt-4 flex-shrink-0">
            {([
              { key: 'graphics',   icon: 'upload_file', label: 'Graphics'  },
              { key: 'palette',    icon: 'palette',     label: 'Palette'   },
              { key: 'hardware',   icon: 'texture',     label: 'Hardware'  },
              { key: 'detailing',  icon: 'text_fields', label: 'Detailing' },
            ] as { key: TabKey; icon: string; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex flex-col items-center gap-2 pb-3 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#135bec] text-[#135bec]'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-8"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b transparent', minHeight: 0 }}
          >

            {/* ── GRAPHICS ─────────────────────────────────────────────────── */}
            {activeTab === 'graphics' && (
              <>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">Custom Graphics</h3>
                  <p className="text-sm text-slate-400 mb-4">Apply custom patterns or logos to the mouse pad surface.</p>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-[#1e293b] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#135bec]/50 transition-colors group cursor-pointer bg-[#0a0e1a]/30"
                  >
                    <div className="size-12 rounded-full bg-[#135bec]/10 flex items-center justify-center text-[#135bec] mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">add_photo_alternate</span>
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      Drag &amp; Drop or <span className="text-[#135bec] underline">Browse</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">SVG, PNG, JPG (MAX 10MB)</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                  />
                </div>

                {/* Resolution indicator */}
                <div className="bg-[#0a0e1a]/50 p-4 rounded-lg border border-[#1e293b]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-slate-400">Resolution Status</span>
                    {uploadedImage ? (
                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        resolutionPct >= 80 ? 'text-[#135bec]' : resolutionPct >= 50 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {resolutionPct >= 80 ? 'check_circle' : resolutionPct >= 50 ? 'warning' : 'error'}
                        </span>
                        {resolutionLabel}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">No file uploaded</span>
                    )}
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        resolutionPct >= 80 ? 'bg-[#135bec]' : resolutionPct >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: uploadedImage ? `${resolutionPct}%` : '0%' }}
                    />
                  </div>
                </div>

                {uploadedImage && (
                  <div className="flex items-center gap-3 bg-[#0a0e1a]/50 border border-[#1e293b] rounded-xl p-3">
                    <img src={uploadedImage} alt="thumb" className="w-14 h-10 object-cover rounded-lg border border-[#1e293b] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{uploadedFileName}</p>
                      <p className="text-[11px] text-[#135bec] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Design loaded
                      </p>
                    </div>
                    <button
                      onClick={() => { setUploadedImage(null); setUploadedFileName(''); setResolutionLabel(''); setResolutionPct(0); }}
                      className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── PALETTE ──────────────────────────────────────────────────── */}
            {activeTab === 'palette' && (
              <>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">Base Finish</h3>
                  <p className="text-sm text-slate-400 mb-4">Select the base color for the mouse pad surface.</p>
                  <div className="grid grid-cols-4 gap-3">
                    {BASE_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => { setBaseColor(c); setCustomHex(''); }}
                        title={c.label}
                        className={`aspect-square rounded-lg border-2 p-1 transition-all ${
                          baseColor.hex === c.hex && !customHex
                            ? 'border-[#135bec] ring-2 ring-[#135bec]/20'
                            : 'border-transparent hover:border-slate-600'
                        }`}
                        style={{ background: '#1e293b' }}
                      >
                        <div className="w-full h-full rounded" style={{ background: c.hex }} />
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-10 px-3 bg-[#0a0e1a] rounded border border-[#1e293b] flex items-center gap-2">
                      <div
                        className="size-4 rounded-sm border border-slate-700"
                        style={{ background: effectiveBaseColor }}
                      />
                      <span className="text-xs font-mono text-slate-400">{effectiveBaseColor.toUpperCase()}</span>
                    </div>
                    <input
                      type="color"
                      value={effectiveBaseColor}
                      onChange={(e) => setCustomHex(e.target.value)}
                      title="Custom Hex"
                      className="h-10 w-16 rounded border border-[#1e293b] bg-slate-800 cursor-pointer p-0.5"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── HARDWARE ─────────────────────────────────────────────────── */}
            {activeTab === 'hardware' && (
              <>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">Material Selection</h3>
                  <div className="space-y-3 mt-4">
                    {MATERIALS.map((mat) => (
                      <label
                        key={mat.label}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer group transition-colors ${
                          selectedMaterial.label === mat.label
                            ? 'border-[#135bec] bg-[#135bec]/5'
                            : 'border-[#1e293b] hover:border-slate-600'
                        }`}
                        onClick={() => setSelectedMaterial(mat)}
                      >
                        <div className={`size-10 rounded-lg flex items-center justify-center mr-4 border ${
                          selectedMaterial.label === mat.label
                            ? 'bg-[#135bec]/10 border-[#135bec]/30 text-[#135bec]'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          <span className="material-symbols-outlined">{mat.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${selectedMaterial.label === mat.label ? 'text-white' : 'text-slate-300'}`}>
                            {mat.label}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase">{mat.desc}</p>
                        </div>
                        <span className={`text-sm font-bold ${selectedMaterial.label === mat.label ? 'text-[#135bec]' : 'text-slate-400'}`}>
                          {mat.extra}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">Size Selection</h3>
                  <div className="space-y-2 mt-3">
                    {SIZES.map((size) => (
                      <label
                        key={size.label}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSize.label === size.label
                            ? 'border-[#135bec] bg-[#135bec]/5'
                            : 'border-[#1e293b] hover:border-slate-600'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${selectedSize.label === size.label ? 'text-white' : 'text-slate-300'}`}>
                            {size.label}
                          </p>
                          <p className="text-[10px] text-slate-500 uppercase">{size.dims}</p>
                        </div>
                        <span className={`text-sm font-bold ${selectedSize.label === size.label ? 'text-[#135bec]' : 'text-slate-400'}`}>
                          ₹{size.price.toLocaleString('en-IN')}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Quantity */}
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-medium">Quantity</span>
                    <div className="flex items-center bg-[#0a0e1a] rounded-lg border border-[#1e293b] p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-md transition-colors text-slate-300"
                      >
                        <span className="material-symbols-outlined text-base">remove</span>
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-md transition-colors text-[#135bec]"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500">Max 50</span>
                  </div>
                </div>
              </>
            )}

            {/* ── DETAILING ────────────────────────────────────────────────── */}
            {activeTab === 'detailing' && (
              <>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">Laser Engraving / Text</h3>
                  <div className="mt-3">
                    <input
                      value={overlayText}
                      onChange={(e) => setOverlayText(e.target.value)}
                      placeholder="Type your text (e.g. JIO_CODER)"
                      maxLength={40}
                      className="w-full bg-[#0a0e1a] border border-[#1e293b] rounded-lg focus:ring-1 focus:ring-[#135bec] focus:border-[#135bec] text-sm p-3 text-white placeholder:text-slate-600 outline-none"
                    />
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {FONTS.map((font) => (
                        <button
                          key={font}
                          onClick={() => setOverlayFont(font)}
                          style={{
                            fontFamily: font === 'Mono Space' ? 'monospace'
                              : font === 'Neo Sans' ? 'sans-serif'
                              : `"${font}", sans-serif`,
                          }}
                          className={`flex-1 min-w-[calc(50%-4px)] py-2 rounded border text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            overlayFont === font
                              ? 'border-[#135bec] bg-[#135bec]/10 text-[#135bec]'
                              : 'border-[#1e293b] bg-slate-800 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text color */}
                <div>
                  <h3 className="text-sm font-bold text-slate-300 mb-3">Text Colour</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={overlayColor}
                      onChange={(e) => setOverlayColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-[#1e293b] p-0.5 bg-slate-800"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {['#ffffff', '#000000', '#135bec', '#ef4444', '#f59e0b', '#10b981'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setOverlayColor(c)}
                          style={{ background: c }}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${overlayColor === c ? 'border-slate-200 scale-110' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live preview */}
                {overlayText && (
                  <div className="bg-[#0a0e1a] rounded-xl p-4 text-center border border-[#1e293b]">
                    <p
                      style={{
                        fontFamily: overlayFont === 'Mono Space' ? 'monospace'
                          : overlayFont === 'Neo Sans' ? 'sans-serif'
                          : `"${overlayFont}", sans-serif`,
                        fontSize: 22,
                        color: overlayColor,
                        fontWeight: 700,
                      }}
                    >
                      {overlayText}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-2">Font preview</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Footer Price Bar ─────────────────────────────────────────────── */}
          <div className="p-6 border-t border-[#1e293b] bg-[#0a0e1a] flex-shrink-0">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Current Configuration</p>
                <p className="text-xs text-slate-300">
                  {selectedSize.label} ({selectedSize.dims}) + {selectedMaterial.label}
                  {overlayText ? ' + Text' : ''}
                  {quantity > 1 ? ` × ${quantity}` : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white tracking-tighter leading-none">
                  ₹{total.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-[#135bec] font-bold uppercase">Free Shipping</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!uploadedImage) {
                  setActiveTab('graphics');
                  alert('Please upload a design image first.');
                  return;
                }
                setShowOrderModal(true);
                setOrderStep('form');
              }}
              className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#135bec]/20 flex items-center justify-center gap-2 group"
            >
              <span className="truncate">Place Print Order</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </button>
          </div>
        </aside>
      </main>

      {/* ── Floating helpers ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-40">
        <button className="size-10 rounded-full bg-[#111827] border border-[#1e293b] flex items-center justify-center hover:bg-slate-800 transition-colors shadow-xl text-slate-400 hover:text-white">
          <span className="material-symbols-outlined text-sm">support_agent</span>
        </button>
        <button className="size-10 rounded-full bg-[#111827] border border-[#1e293b] flex items-center justify-center hover:bg-slate-800 transition-colors shadow-xl text-slate-400 hover:text-white">
          <span className="material-symbols-outlined text-sm">share</span>
        </button>
      </div>

      {/* ── Order Modal ──────────────────────────────────────────────────────── */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
              <div>
                <h2 className="text-xl font-black text-white">Place Print Order</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSize.label} ({selectedSize.dims}) · {selectedMaterial.label} · Qty {quantity}
                </p>
              </div>
              {orderStep !== 'submitting' && (
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>

            {uploadedImage && orderStep !== 'success' && (
              <div className="px-6 pt-4 flex items-center gap-4">
                <img src={uploadedImage} alt="Design" className="w-20 h-14 object-cover rounded-lg border border-[#1e293b] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-200 truncate max-w-[220px]">{uploadedFileName}</p>
                  {overlayText && <p className="text-xs text-slate-400 mt-0.5">Text: "{overlayText}"</p>}
                  <p className="text-lg font-black text-[#135bec] mt-1">₹{total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}

            {orderStep === 'success' && (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-900/30 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-green-400 text-4xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Order Placed!</h3>
                <p className="text-slate-400 mb-1">Your custom print order has been received.</p>
                <p className="text-sm font-mono font-bold text-[#135bec] mb-6">{orderNumber}</p>
                <p className="text-xs text-slate-500 mb-8">
                  Confirmation will be sent to <strong className="text-slate-300">{orderForm.email}</strong>.
                  Dispatched in 3–5 business days.
                </p>
                <button
                  onClick={() => { setShowOrderModal(false); setOrderStep('form'); }}
                  className="px-6 py-3 bg-[#135bec] text-white font-bold rounded-xl hover:bg-[#135bec]/90 transition-colors"
                >
                  Continue Designing
                </button>
              </div>
            )}

            {orderStep === 'submitting' && (
              <div className="p-12 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#135bec]/20 border-t-[#135bec] rounded-full animate-spin" />
                <p className="text-sm text-slate-400">Placing your order…</p>
              </div>
            )}

            {orderStep === 'form' && (
              <div className="p-6 space-y-4">
                {(
                  [
                    { field: 'name',    label: 'Full Name',     type: 'text',  placeholder: 'Sumit Kumar' },
                    { field: 'email',   label: 'Email',         type: 'email', placeholder: 'you@example.com' },
                    { field: 'phone',   label: 'Mobile Number', type: 'tel',   placeholder: '+91 9876543210' },
                    { field: 'address', label: 'Address',       type: 'text',  placeholder: 'Street, Apartment…' },
                    { field: 'city',    label: 'City',          type: 'text',  placeholder: 'New Delhi' },
                    { field: 'state',   label: 'State',         type: 'text',  placeholder: 'Delhi' },
                    { field: 'pin',     label: 'PIN Code',      type: 'text',  placeholder: '110001' },
                  ] as { field: keyof OrderForm; label: string; type: string; placeholder: string }[]
                ).map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
                    <input
                      type={type}
                      value={orderForm[field]}
                      placeholder={placeholder}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, [field]: e.target.value }))}
                      className={`w-full bg-[#0a0e1a] border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:ring-1 focus:ring-[#135bec] ${
                        formErrors[field] ? 'border-red-500' : 'border-[#1e293b] focus:border-[#135bec]'
                      }`}
                    />
                    {formErrors[field] && (
                      <p className="text-xs text-red-400 mt-0.5">{formErrors[field]}</p>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-[#1e293b]">
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>Print × {quantity}</span>
                    <span className="text-white font-bold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400 mb-4">
                    <span>Shipping</span>
                    <span className="text-[#135bec] font-bold text-xs uppercase">Free</span>
                  </div>
                  <button
                    onClick={handleSubmitOrder}
                    className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#135bec]/20 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">print</span>
                    Confirm Order — ₹{total.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
