'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu, Monitor, HardDrive, Package, Wifi,
  Keyboard, Zap, Layers, ChevronRight
} from 'lucide-react';

const MAIN_CATEGORIES = [
  {
    name: 'PC Components',
    icon: Cpu,
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20',
    href: '/products?category=CPU',
    description: 'Everything you need to build a high-performance desktop PC.',
    sub: [
      { name: 'Processors (CPU)', href: '/products?category=CPU' },
      { name: 'Graphics Cards (GPU)', href: '/products?category=GPU' },
      { name: 'Motherboards', href: '/products?category=Motherboard' },
      { name: 'RAM / Memory', href: '/products?category=RAM' },
      { name: 'Storage Drives', href: '/products?category=Storage' },
      { name: 'Power Supplies', href: '/products?category=PowerSupply' },
      { name: 'PC Cases', href: '/products?category=Case' },
      { name: 'CPU Coolers', href: '/products?category=Cooler' },
    ],
  },
  {
    name: 'Monitors & Displays',
    icon: Monitor,
    color: 'text-purple-400',
    bg: 'from-purple-500/10 to-transparent',
    border: 'border-purple-500/20',
    href: '/products?category=Monitor',
    description: 'From 60Hz office panels to 360Hz esports champions.',
    sub: [
      { name: 'Gaming Monitors (144Hz+)', href: '/products?category=Monitor&tag=gaming' },
      { name: '4K Monitors', href: '/products?category=Monitor&tag=4k' },
      { name: 'Curved Monitors', href: '/products?category=Monitor&tag=curved' },
      { name: 'Office Monitors', href: '/products?category=Monitor&tag=office' },
    ],
  },
  {
    name: 'Networking Gear',
    icon: Wifi,
    color: 'text-indigo-400',
    bg: 'from-indigo-500/10 to-transparent',
    border: 'border-indigo-500/20',
    href: '/products?category=Networking',
    description: 'Routers, switches, and range extenders for the best connectivity.',
    sub: [
      { name: 'Wi-Fi Routers', href: '/products?category=Networking&tag=router' },
      { name: 'Network Switches', href: '/products?category=Networking&tag=switch' },
      { name: 'Network Adapters', href: '/products?category=Networking&tag=card' },
    ],
  },
  {
    name: 'Peripherals & Accessories',
    icon: Keyboard,
    color: 'text-pink-400',
    bg: 'from-pink-500/10 to-transparent',
    border: 'border-pink-500/20',
    href: '/products?category=Accessories',
    description: 'Keyboards, mice, headsets, and everything to complete your setup.',
    sub: [
      { name: 'Mechanical Keyboards', href: '/products?category=Accessories&tag=keyboard' },
      { name: 'Gaming Mice', href: '/products?category=Accessories&tag=mouse' },
      { name: 'Headsets', href: '/products?category=Accessories&tag=headset' },
      { name: 'Webcams', href: '/products?category=Accessories&tag=webcam' },
    ],
  },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">All Categories</h1>
        <p className="text-muted-foreground text-lg">
          Browse our complete range of PC components, monitors, networking gear, and peripherals.
        </p>
      </div>

      <Link href="/builder" className="block mb-10">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 transition-all"
        >
          <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Smart PC Builder</h2>
            <p className="text-muted-foreground text-sm">Build your dream PC — we check compatibility and power automatically.</p>
          </div>
          <ChevronRight className="h-6 w-6 text-primary flex-shrink-0" />
        </motion.div>
      </Link>

      <div className="space-y-6">
        {MAIN_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`rounded-2xl border ${cat.border} bg-gradient-to-r ${cat.bg} p-6 md:p-8`}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex items-center gap-4 md:w-64 flex-shrink-0">
                <div className="p-3 bg-background/80 border border-border rounded-xl">
                  <cat.icon className={`h-8 w-8 ${cat.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{cat.name}</h2>
                  <p className="text-muted-foreground text-xs mt-0.5 hidden md:block">{cat.description}</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {cat.sub.map(sub => (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background/60 border border-border/50 hover:border-primary/40 hover:bg-background hover:text-primary text-sm transition-all"
                  >
                    <ChevronRight className="h-3 w-3 text-primary/50 flex-shrink-0" />
                    <span className="line-clamp-1">{sub.name}</span>
                  </Link>
                ))}
                <Link
                  href={cat.href}
                  className={`flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg border text-sm font-medium ${cat.color} border-current/20 bg-current/5 hover:bg-current/10 transition-all`}
                >
                  <Layers className="h-3.5 w-3.5" /> View All
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
