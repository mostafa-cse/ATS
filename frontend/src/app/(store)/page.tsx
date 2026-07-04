'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Zap, ArrowRight, Cpu, Monitor, HardDrive, Wifi,
  Star, Package, Keyboard, TrendingUp, ShoppingCart,
  ChevronLeft, ChevronRight, Shield, Truck, Award, Clock
} from 'lucide-react';

// ─── Hero Slides ────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    badge: '🔥 Limited Time Deal',
    headline: 'Build Your',
    highlight: 'Dream PC',
    sub: 'Premium components, smart compatibility checks, and unbeatable prices — all in one place.',
    primaryCta: { label: 'Start PC Builder', href: '/builder', icon: Zap },
    secondaryCta: { label: 'Browse Catalog', href: '/products', icon: ArrowRight },
    gradient: 'from-emerald-500/20 via-transparent to-transparent',
    accent: '#10b981',
  },
  {
    id: 2,
    badge: '🖥️ New Arrivals',
    headline: 'Next-Gen',
    highlight: 'Monitors',
    sub: '240Hz, 4K, OLED — the finest displays for gaming, design, and productivity.',
    primaryCta: { label: 'Shop Monitors', href: '/products?category=Monitor', icon: Monitor },
    secondaryCta: { label: 'Compare Specs', href: '/products?category=Monitor', icon: ArrowRight },
    gradient: 'from-violet-500/20 via-transparent to-transparent',
    accent: '#8b5cf6',
  },
  {
    id: 3,
    badge: '💰 MegaCoins Rewards',
    headline: 'Earn While',
    highlight: 'You Shop',
    sub: 'Every purchase earns MegaCoins. Redeem them for discounts on your next order.',
    primaryCta: { label: 'Learn More', href: '/dashboard/megacoins', icon: Star },
    secondaryCta: { label: 'Start Shopping', href: '/products', icon: ArrowRight },
    gradient: 'from-amber-500/20 via-transparent to-transparent',
    accent: '#f59e0b',
  },
];

// ─── Categories ───────────────────────────────────────────────
const CATEGORIES = [
  { name: 'CPU', label: 'Processors', icon: Cpu, href: '/products?category=CPU', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { name: 'GPU', label: 'Graphics Cards', icon: Monitor, href: '/products?category=GPU', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { name: 'Motherboard', label: 'Motherboards', icon: HardDrive, href: '/products?category=Motherboard', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { name: 'RAM', label: 'Memory (RAM)', icon: Package, href: '/products?category=RAM', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { name: 'Storage', label: 'Storage', icon: HardDrive, href: '/products?category=Storage', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { name: 'Monitor', label: 'Monitors', icon: Monitor, href: '/products?category=Monitor', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Networking', label: 'Networking', icon: Wifi, href: '/products?category=Networking', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Accessories', label: 'Peripherals', icon: Keyboard, href: '/products?category=Accessories', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
];

// ─── Trust Pillars ────────────────────────────────────────────
const TRUST = [
  { icon: Truck, label: 'Free Delivery', desc: 'On orders over ৳5,000 in Dhaka' },
  { icon: Shield, label: 'Genuine Products', desc: '100% authentic with warranty' },
  { icon: Award, label: 'Best Price Guarantee', desc: 'We match any local price' },
  { icon: Clock, label: '7-Day Returns', desc: 'Hassle-free replacement policy' },
];

// ─── Product Card (mini) ──────────────────────────────────────
function MiniProductCard({ product }: { product: any }) {
  const price = product.discountPrice ?? product.regularPrice ?? product.basePrice ?? 0;
  const original = product.regularPrice ?? product.basePrice;
  const discount = original && product.discountPrice ? Math.round((1 - product.discountPrice / original) * 100) : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      <div className="relative aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
            <Package className="h-12 w-12" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            NEW
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand?.name ?? product.brand ?? 'Unknown'}</p>
        <h3 className="text-sm font-medium leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-bold text-primary">৳{price.toLocaleString()}</p>
            {original && product.discountPrice && (
              <p className="text-xs text-muted-foreground line-through">৳{original.toLocaleString()}</p>
            )}
          </div>
          <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => setSlideIndex(i => (i + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    fetch('http://localhost:5171/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const featured = products.filter((p: any) => p.isFeatured || p.isNewArrival).slice(0, 8);
  const bestSellers = products.filter((p: any) => p.isBestSeller).slice(0, 8);
  const hotDeals = products.filter((p: any) => p.discountPrice).slice(0, 8);
  // Fallback: show any products if filters return nothing
  const featuredDisplay = featured.length > 0 ? featured : products.slice(0, 8);
  const bestSellersDisplay = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);

  const slide = HERO_SLIDES[slideIndex];

  return (
    <div className="flex flex-col gap-16 pb-16">

      {/* ── Hero Slider ── */}
      <section className="relative overflow-hidden min-h-[560px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} -z-10`}
          />
        </AnimatePresence>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 -z-10 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <motion.span
                className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full border mb-6"
                style={{ borderColor: `${slide.accent}40`, backgroundColor: `${slide.accent}10`, color: slide.accent }}
              >
                {slide.badge}
              </motion.span>

              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                {slide.headline}{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${slide.accent}, ${slide.accent}99)` }}
                >
                  {slide.highlight}
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                {slide.sub}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={slide.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold h-13 px-8 text-base text-primary-foreground transition-all hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: slide.accent }}
                >
                  <slide.primaryCta.icon className="h-5 w-5" />
                  {slide.primaryCta.label}
                </Link>
                <Link
                  href={slide.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold h-13 px-8 text-base border border-border bg-background/50 hover:bg-secondary transition-all"
                >
                  {slide.secondaryCta.label}
                  <slide.secondaryCta.icon className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="flex items-center gap-3 mt-12">
            <button
              onClick={() => setSlideIndex(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground'}`}
              />
            ))}
            <button
              onClick={() => setSlideIndex(i => (i + 1) % HERO_SLIDES.length)}
              className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust Pillars ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4"
            >
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <t.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground text-sm mt-1">Browse our wide range of tech products</p>
          </div>
          <Link href="/categories" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 text-sm">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={cat.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${cat.bg} hover:scale-105 transition-all text-center`}
              >
                <div className={`p-3 rounded-lg bg-background/50`}>
                  <cat.icon className={`h-6 w-6 ${cat.color}`} />
                </div>
                <span className="text-xs font-medium leading-tight">{cat.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PC Builder Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30">
                <Cpu className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Smart PC Builder</h2>
                <p className="text-muted-foreground max-w-md">
                  Pick your components and we'll automatically check compatibility, calculate power requirements, and show you the total price.
                </p>
              </div>
            </div>
            <Link
              href="/builder"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl font-semibold px-8 py-4 hover:bg-primary/90 transition-colors hover:scale-105"
            >
              <Zap className="h-5 w-5" />
              Open PC Builder
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Featured / New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Featured Products
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Hand-picked for the best value</p>
          </div>
          <Link href="/products" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 text-sm">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : featuredDisplay.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredDisplay.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <MiniProductCard product={p} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No products available yet.</p>
            <p className="text-sm mt-1">Add products via the Admin Panel to see them here.</p>
          </div>
        )}
      </section>

      {/* ── Hot Deals ── */}
      {hotDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                🔥 Hot Deals
                <span className="text-sm font-normal text-muted-foreground">Limited time offers</span>
              </h2>
            </div>
            <Link href="/products?hasDiscount=true" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 text-sm">
              View All Deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {hotDeals.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <MiniProductCard product={p} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── MegaCoins Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-5xl flex-shrink-0">🪙</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Earn MegaCoins on Every Purchase</h2>
              <p className="text-muted-foreground text-sm">
                Get rewarded every time you shop. Redeem your MegaCoins for discounts on future orders. The more you buy, the more you save!
              </p>
            </div>
            <Link
              href="/register"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-amber-500 text-white rounded-xl font-semibold px-6 py-3 hover:bg-amber-600 transition-colors"
            >
              <Star className="h-4 w-4" />
              Join & Earn
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
