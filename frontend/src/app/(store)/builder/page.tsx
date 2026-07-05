'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  AlertTriangle, CheckCircle2, Zap, Save, RefreshCw,
  Cpu, Monitor, HardDrive, Package, Trash2, ShoppingCart, Info
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string | { name: string };
  category: string | { name: string };
  regularPrice?: number;
  basePrice?: number;
  discountPrice?: number;
  technicalSpecs?: string;
  socketType?: string;
  formFactor?: string;
  ramType?: string;
  requiredWattage?: number;
  stockStatus?: string;
}

interface CompatibilityResult {
  isCompatible: boolean;
  warnings: string[];
  totalEstimatedWattage: number;
}

const PC_SLOTS = [
  { key: 'CPU', label: 'Processor (CPU)', icon: Cpu, required: true, hint: 'The brain of your PC' },
  { key: 'Motherboard', label: 'Motherboard', icon: HardDrive, required: true, hint: 'Connects all components' },
  { key: 'RAM', label: 'Memory (RAM)', icon: Package, required: true, hint: 'Minimum 8GB DDR4 recommended' },
  { key: 'Storage', label: 'Storage (SSD/HDD)', icon: HardDrive, required: true, hint: 'NVMe SSD for best performance' },
  { key: 'PowerSupply', label: 'Power Supply (PSU)', icon: Zap, required: true, hint: 'Get 20% headroom over requirement' },
  { key: 'Case', label: 'PC Case / Casing', icon: Package, required: true, hint: 'Check motherboard form factor compatibility' },
  { key: 'GPU', label: 'Graphics Card (GPU)', icon: Monitor, required: false, hint: 'Optional for integrated graphics CPUs' },
  { key: 'Cooler', label: 'CPU Cooler', icon: Cpu, required: false, hint: 'Optional if CPU has box cooler' },
];

function getProductPrice(p: Product) {
  return p.discountPrice ?? p.regularPrice ?? p.basePrice ?? 0;
}

function getBrandName(b: string | { name: string } | undefined): string {
  if (!b) return '';
  if (typeof b === 'string') return b;
  return b.name;
}

function getCategoryName(c: string | { name: string } | undefined): string {
  if (!c) return '';
  if (typeof c === 'string') return c;
  return c.name;
}

export default function PCBuilderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Record<string, Product | null>>({});
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const handleSelect = (category: string, productId: string) => {
    const newSelected = { ...selected };
    if (!productId) { delete newSelected[category]; }
    else {
      const p = products.find(p => p.id === productId);
      if (p) newSelected[category] = p;
    }
    setSelected(newSelected);
    runCompatibilityCheck(newSelected);
  };

  const runCompatibilityCheck = async (currentSel: Record<string, Product | null>) => {
    const ids = Object.values(currentSel).filter(Boolean).map(p => p!.id);
    if (ids.length === 0) { setCompatibility(null); return; }
    setIsChecking(true);
    try {
      const res = await fetch('/api/pcbuilder/check-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids),
      });
      if (res.ok) setCompatibility(await res.json());
    } catch { /* silent */ }
    finally { setIsChecking(false); }
  };

  const clearAll = () => { setSelected({}); setCompatibility(null); };

  const addAllToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    Object.values(selected).filter(Boolean).forEach(p => {
      const idx = cart.findIndex((i: any) => i.id === p!.id);
      if (idx >= 0) cart[idx].qty++;
      else cart.push({ id: p!.id, name: p!.name, price: getProductPrice(p!), qty: 1 });
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const totalPrice = Object.values(selected).filter(Boolean).reduce((sum, p) => sum + getProductPrice(p!), 0);
  const requiredCompleted = PC_SLOTS.filter(s => s.required).every(s => !!selected[s.key]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Zap className="h-7 w-7 text-primary" />
            Smart PC Builder
          </h1>
          <p className="text-muted-foreground">Select components — we'll check compatibility and calculate power requirements automatically.</p>
        </div>
        {Object.keys(selected).length > 0 && (
          <button onClick={clearAll} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="h-4 w-4" /> Clear Build
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Component Slots ── */}
        <div className="lg:col-span-2 space-y-4">
          {PC_SLOTS.map(slot => {
            const slotProducts = products.filter(p => getCategoryName(p.category) === slot.key);
            const sel = selected[slot.key];

            return (
              <motion.div
                key={slot.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-card border rounded-xl p-5 transition-all ${
                  sel ? 'border-primary/40 bg-primary/2' : 'border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${sel ? 'bg-primary/10' : 'bg-secondary'}`}>
                    <slot.icon className={`h-5 w-5 ${sel ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold">{slot.label}</h3>
                      {!slot.required && (
                        <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">Optional</span>
                      )}
                      <div className="relative group ml-auto flex-shrink-0">
                        <Info className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help" />
                        <div className="absolute right-0 top-5 hidden group-hover:block z-10 bg-popover border border-border rounded-lg p-2.5 text-xs w-44 shadow-lg">
                          {slot.hint}
                        </div>
                      </div>
                    </div>

                    {sel ? (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{sel.name}</p>
                          <p className="text-xs text-muted-foreground">{getBrandName(sel.brand)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-primary">৳{getProductPrice(sel).toLocaleString()}</p>
                          <button
                            onClick={() => handleSelect(slot.key, '')}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors mt-1"
                        value=""
                        onChange={e => handleSelect(slot.key, e.target.value)}
                      >
                        <option value="">— Select {slot.label} —</option>
                        {slotProducts.length === 0 ? (
                          <option disabled>No products available in this category</option>
                        ) : (
                          slotProducts.map(p => (
                            <option key={p.id} value={p.id} disabled={p.stockStatus === 'OutOfStock'}>
                              {getBrandName(p.brand)} {p.name} — ৳{getProductPrice(p).toLocaleString()}{p.stockStatus === 'OutOfStock' ? ' [Out of Stock]' : ''}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Sidebar Summary ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-5">

            {/* Compatibility Status */}
            <div className={`rounded-xl p-5 border transition-all ${
              compatibility?.isCompatible === false ? 'bg-destructive/10 border-destructive/20' :
              compatibility?.isCompatible === true ? 'bg-primary/10 border-primary/20' :
              'bg-card border-border'
            }`}>
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                System Status
                {isChecking && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />}
              </h3>

              {!compatibility && !isChecking && (
                <p className="text-sm text-muted-foreground">Select components to check compatibility.</p>
              )}

              {compatibility && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    {compatibility.isCompatible
                      ? <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      : <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className={`font-medium text-sm ${compatibility.isCompatible ? 'text-primary' : 'text-destructive'}`}>
                        {compatibility.isCompatible ? 'All Components Compatible ✓' : 'Compatibility Issues Found'}
                      </p>
                      {compatibility.warnings.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                          {compatibility.warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Zap className="h-4 w-4 text-yellow-500" /> Est. Power Draw
                    </span>
                    <span className="font-bold">{compatibility.totalEstimatedWattage}W</span>
                  </div>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-base font-semibold mb-4">Build Summary</h3>

              <div className="space-y-2 mb-5 max-h-64 overflow-y-auto">
                {PC_SLOTS.map(slot => {
                  const p = selected[slot.key];
                  return (
                    <div key={slot.key} className="flex items-center justify-between text-sm py-1">
                      <span className="text-muted-foreground text-xs w-28 flex-shrink-0">{slot.label}</span>
                      {p ? (
                        <span className="font-medium truncate pl-2">৳{getProductPrice(p).toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">Not selected</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-center mb-5">
                <span className="text-muted-foreground text-sm">Total Build Cost</span>
                <span className="text-2xl font-extrabold text-primary">৳{totalPrice.toLocaleString()}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={addAllToCart}
                disabled={Object.keys(selected).length === 0}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3.5 transition-all ${
                  addedToCart
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {addedToCart ? <CheckCircle2 className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                {addedToCart ? 'Added All to Cart!' : 'Add Entire Build to Cart'}
              </motion.button>

              {!requiredCompleted && Object.keys(selected).length > 0 && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Complete all required slots for a full build.
                </p>
              )}

              {Object.keys(selected).length > 0 && (
                <Link
                  href="/checkout"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Buy Now →
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
