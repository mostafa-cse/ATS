'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Star, Shield, Truck, Award,
  Package, ChevronLeft, CheckCircle, Zap, ArrowRight, Minus, Plus
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [specs, setSpecs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5171/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        try {
          const parsed = typeof data.technicalSpecs === 'string' ? JSON.parse(data.technicalSpecs) : (data.technicalSpecs ?? {});
          setSpecs(parsed);
        } catch { setSpecs({}); }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.findIndex((i: any) => i.id === product.id);
    if (existing >= 0) cart[existing].qty += qty;
    else cart.push({ id: product.id, name: product.name, price: product.discountPrice ?? product.regularPrice ?? product.basePrice, qty, imageUrl: product.images?.[0]?.imageUrl ?? null });
    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-card border border-border rounded-2xl" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-6 bg-card rounded-lg" style={{ width: `${80 - i * 10}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
      <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">This product may have been removed or is unavailable.</p>
      <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-6 py-3 font-medium hover:bg-primary/90">
        <ChevronLeft className="h-4 w-4" /> Back to Catalog
      </Link>
    </div>
  );

  const price = product.discountPrice ?? product.regularPrice ?? product.basePrice ?? 0;
  const originalPrice = product.regularPrice ?? product.basePrice;
  const discount = originalPrice && product.discountPrice ? Math.round((1 - product.discountPrice / originalPrice) * 100) : null;
  const images = product.images?.length > 0 ? product.images.map((i: any) => i.imageUrl) : [null];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronLeft className="h-3 w-3 rotate-180" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronLeft className="h-3 w-3 rotate-180" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Image Gallery ── */}
        <div className="space-y-4">
          <div className="aspect-square bg-card border border-border rounded-2xl overflow-hidden flex items-center justify-center">
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground/30">
                <Package className="h-24 w-24" />
                <span className="text-sm">No Image Available</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img: string | null, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-colors ${activeImage === i ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                >
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-secondary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{product.brand?.name ?? product.brand ?? 'Unknown Brand'}</p>
            <h1 className="text-3xl font-bold leading-tight mb-3">{product.name}</h1>
            {product.modelNumber && <p className="text-sm text-muted-foreground">Model: {product.modelNumber}</p>}
          </div>

          {/* Stars placeholder */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
            <span className="text-sm text-muted-foreground ml-1">4.8 (124 reviews)</span>
          </div>

          {/* Price */}
          <div className="p-5 bg-card border border-border rounded-xl space-y-2">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-primary">৳{price.toLocaleString()}</span>
              {originalPrice && product.discountPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">৳{originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">-{discount}%</span>
                </>
              )}
            </div>
            {product.megaCoinReward > 0 && (
              <p className="text-sm text-amber-500 flex items-center gap-1">
                🪙 Earn <strong>{product.megaCoinReward}</strong> MegaCoins on this purchase
              </p>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stockStatus === 'InStock' ? (
              <><CheckCircle className="h-4 w-4 text-primary" /><span className="text-sm text-primary font-medium">In Stock</span></>
            ) : product.stockStatus === 'OutOfStock' ? (
              <><span className="w-3 h-3 rounded-full bg-destructive flex-shrink-0" /><span className="text-sm text-destructive font-medium">Out of Stock</span></>
            ) : (
              <><span className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" /><span className="text-sm text-yellow-500 font-medium">Pre-Order</span></>
            )}
          </div>

          {/* Quantity + Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2.5 text-sm font-medium border-x border-border min-w-[48px] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-2.5 hover:bg-secondary transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={product.stockStatus === 'OutOfStock'}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3 transition-all ${
                addedToCart
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedToCart ? <CheckCircle className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
              {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </motion.button>
          </div>

          <Link
            href="/checkout"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3 border border-border bg-secondary hover:bg-secondary/80 transition-colors"
          >
            Buy Now <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-card border border-border rounded-lg">
              <Shield className="h-4 w-4 text-primary flex-shrink-0" />{product.warrantyInfo || '1 Year Warranty'}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-card border border-border rounded-lg">
              <Truck className="h-4 w-4 text-primary flex-shrink-0" />Free Dhaka Delivery (৳5k+)
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-card border border-border rounded-lg">
              <Award className="h-4 w-4 text-primary flex-shrink-0" />100% Genuine
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-card border border-border rounded-lg">
              <Zap className="h-4 w-4 text-primary flex-shrink-0" />{product.returnPolicy || '7 Day Return'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Specifications ── */}
      <div className="mt-16">
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            <span className="text-sm font-semibold text-primary border-b-2 border-primary pb-3">Specifications</span>
            <span className="text-sm text-muted-foreground pb-3">Description</span>
          </div>
        </div>

        {Object.keys(specs).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(specs).map(([key, val]) => (
              <div key={key} className="flex gap-4 py-3 border-b border-border/50">
                <span className="text-muted-foreground text-sm capitalize w-40 flex-shrink-0">{key.replace(/_/g, ' ')}</span>
                <span className="text-sm font-medium">{String(val)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm py-8 text-center bg-card border border-border rounded-xl">
            {product.fullDescription || product.shortDescription || 'No detailed specifications available for this product.'}
          </div>
        )}
      </div>

    </div>
  );
}
