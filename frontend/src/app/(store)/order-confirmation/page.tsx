'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Home, Truck } from 'lucide-react';

function OrderConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId') ?? 'N/A';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-primary/10 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-extrabold mb-3">Order Confirmed! 🎉</h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Thank you for your purchase! Your order has been placed successfully.
          </p>

          <div className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Order ID</span>
              <span className="font-mono font-semibold text-primary text-sm">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Status</span>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Pending Verification</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Estimated Delivery</span>
              <span className="text-sm font-medium">3–5 Business Days</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: CheckCircle, label: 'Order Placed', desc: 'Just now', done: true },
              { icon: Package, label: 'Processing', desc: 'Within 24 hrs', done: false },
              { icon: Truck, label: 'Delivered', desc: '3-5 days', done: false },
            ].map((step, i) => (
              <div key={i} className={`flex flex-col items-center p-4 rounded-xl border ${step.done ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}>
                <step.icon className={`h-6 w-6 mb-2 ${step.done ? 'text-primary' : 'text-muted-foreground/40'}`} />
                <p className={`text-xs font-semibold ${step.done ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/orders" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold hover:bg-primary/90 transition-colors">
              Track My Order <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 border border-border rounded-xl px-6 py-3 font-semibold hover:bg-secondary transition-colors">
              <Home className="h-4 w-4" /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
