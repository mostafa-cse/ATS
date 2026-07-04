'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search, SlidersHorizontal, X, ChevronDown, Package,
  ShoppingCart, Star, LayoutGrid, List, ArrowUpDown
} from 'lucide-react';

const CATEGORIES = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'PowerSupply', 'Case', 'Cooler', 'Monitor', 'Networking', 'Accessories'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'newest', label: 'Newest First' },
];

function ProductCard({ product }: { product: any }) {
  const price = product.discountPrice ?? product.regularPrice ?? product.basePrice ?? 0;
  const original = product.regularPrice ?? product.basePrice;
  const discount = original && product.discountPrice ? Math.round((1 - product.discountPrice / original) * 100) : null;

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((i: any) => i.id === product.id);
    if (idx >= 0) cart[idx].qty++;
    else cart.push({ id: product.id, name: product.name, price, qty: 1, imageUrl: product.images?.[0]?.imageUrl ?? null });
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <motion.div whileHover={{ y: -3 }} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden">
          {product.images?.[0]?.imageUrl ? (
            <img src={product.images[0].imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
              <Package className="h-10 w-10" />
            </div>
          )}
          {discount && <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
          {product.isNewArrival && <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>}
          {product.stockStatus === 'OutOfStock' && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground bg-background border border-border px-3 py-1.5 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1 truncate">{product.brand?.name ?? product.brand ?? ''}</p>
          <h3 className="text-sm font-medium leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center mb-3">
            {[...Array(4)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />)}
            <Star className="h-3 w-3 text-border" />
            <span className="text-xs text-muted-foreground ml-1">(42)</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-base font-bold text-primary">৳{price.toLocaleString()}</p>
              {original && product.discountPrice && <p className="text-xs text-muted-foreground line-through">৳{original.toLocaleString()}</p>}
            </div>
            <button
              onClick={addToCart}
              disabled={product.stockStatus === 'OutOfStock'}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0 disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5171/api/products')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setProducts(arr);
        // Extract unique brands
        const b = [...new Set(arr.map((p: any) => p.brand?.name ?? p.brand).filter(Boolean))] as string[];
        setBrands(b);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Client-side filtering
  let filtered = [...products];
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand?.name ?? p.brand ?? '').toLowerCase().includes(search.toLowerCase()));
  if (selectedCategory) filtered = filtered.filter(p => (p.category?.name ?? p.category ?? '') === selectedCategory);
  if (selectedBrand) filtered = filtered.filter(p => (p.brand?.name ?? p.brand ?? '') === selectedBrand);
  if (priceMin) filtered = filtered.filter(p => (p.discountPrice ?? p.regularPrice ?? p.basePrice ?? 0) >= Number(priceMin));
  if (priceMax) filtered = filtered.filter(p => (p.discountPrice ?? p.regularPrice ?? p.basePrice ?? 0) <= Number(priceMax));

  // Sort
  if (sortBy === 'price_asc') filtered.sort((a, b) => (a.discountPrice ?? a.regularPrice ?? a.basePrice ?? 0) - (b.discountPrice ?? b.regularPrice ?? b.basePrice ?? 0));
  else if (sortBy === 'price_desc') filtered.sort((a, b) => (b.discountPrice ?? b.regularPrice ?? b.basePrice ?? 0) - (a.discountPrice ?? a.regularPrice ?? a.basePrice ?? 0));
  else if (sortBy === 'name_asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());

  const clearFilters = () => { setSelectedCategory(''); setSelectedBrand(''); setPriceMin(''); setPriceMax(''); setSearch(''); };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Search + Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50 bg-card'}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {(selectedCategory || selectedBrand || priceMin || priceMax) && (
            <span className="w-5 h-5 bg-current/20 rounded-full text-xs flex items-center justify-center">!</span>
          )}
        </button>
        <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-xl">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card border border-border rounded-xl p-5 mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Category</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Brand</label>
              <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option value="">All Brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Min Price (৳)</label>
              <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Max Price (৳)</label>
              <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="999999" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <X className="h-3.5 w-3.5" /> Clear Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Results Bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> products
          {selectedCategory && <> in <span className="font-semibold text-primary">{selectedCategory}</span></>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
          {[...Array(10)].map((_, i) => <div key={i} className="bg-card border border-border rounded-xl h-64 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/20" />
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
          <button onClick={clearFilters} className="text-primary hover:text-primary/80 font-medium">Clear all filters</button>
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
