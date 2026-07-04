'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, Tag } from 'lucide-react';

interface CartItem { id: string; name: string; price: number; qty: number; imageUrl?: string | null; }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const save = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const updateQty = (id: string, delta: number) => {
    const updated = cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i);
    save(updated);
  };

  const remove = (id: string) => save(cart.filter(i => i.id !== id));

  const applyCoupon = () => {
    // Demo coupon logic — real implementation would call backend
    if (couponCode.toUpperCase() === 'MEGA10') {
      setCouponApplied({ code: 'MEGA10', discount: 0.1 });
      setCouponError('');
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      setCouponApplied({ code: 'WELCOME20', discount: 0.2 });
      setCouponError('');
    } else {
      setCouponApplied(null);
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const couponDiscount = couponApplied ? Math.round(subtotal * couponApplied.discount) : 0;
  const shipping = subtotal - couponDiscount >= 5000 ? 0 : 100;
  const total = subtotal - couponDiscount + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingCart className="h-7 w-7 text-primary" />
        Shopping Cart
        {cart.length > 0 && <span className="text-base font-normal text-muted-foreground">({cart.length} items)</span>}
      </h1>

      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-card border border-border rounded-2xl"
        >
          <ShoppingCart className="h-20 w-20 mx-auto mb-6 text-muted-foreground/20" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-8 py-3 font-semibold hover:bg-primary/90 transition-colors">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h3>
                    <p className="text-primary font-bold">৳{item.price.toLocaleString()}</p>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden flex-shrink-0">
                    <button onClick={() => updateQty(item.id, -1)} className="px-2.5 py-2 hover:bg-secondary transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-2 text-sm font-medium border-x border-border">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="px-2.5 py-2 hover:bg-secondary transition-colors">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex-shrink-0 w-24">
                    <p className="font-bold">৳{(item.price * item.qty).toLocaleString()}</p>
                  </div>

                  {/* Remove */}
                  <button onClick={() => remove(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Coupon Row */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" /> Apply Coupon Code
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MEGA10 or WELCOME20"
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <button
                  onClick={applyCoupon}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-primary text-sm mt-2">✓ Coupon <strong>{couponApplied.code}</strong> applied! {Math.round(couponApplied.discount * 100)}% off.</p>
              )}
              {couponError && <p className="text-destructive text-sm mt-2">{couponError}</p>}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-primary">
                    <span>Coupon Discount ({couponApplied.code})</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={shipping === 0 ? 'text-primary' : ''}>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">Add ৳{(5000 - (subtotal - couponDiscount)).toLocaleString()} more for free delivery!</p>
                )}
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-extrabold text-primary">৳{total.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl font-semibold py-3.5 hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/products" className="w-full inline-flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
