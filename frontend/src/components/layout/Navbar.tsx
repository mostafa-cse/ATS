'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Monitor, HardDrive, Wifi, Keyboard, Search,
  ShoppingCart, User, Menu, X, Zap, ChevronDown, Package,
  ChevronRight, Star, Headphones, Mouse, Speaker
} from 'lucide-react';

const MEGA_MENU = [
  {
    label: 'PC Components',
    icon: Cpu,
    href: '/categories',
    sub: [
      { name: 'Processors (CPU)', href: '/products?category=CPU', icon: Cpu },
      { name: 'Graphics Cards (GPU)', href: '/products?category=GPU', icon: Monitor },
      { name: 'Motherboards', href: '/products?category=Motherboard', icon: HardDrive },
      { name: 'RAM / Memory', href: '/products?category=RAM', icon: Package },
      { name: 'Storage (SSD/HDD)', href: '/products?category=Storage', icon: HardDrive },
      { name: 'Power Supplies', href: '/products?category=PowerSupply', icon: Zap },
      { name: 'PC Cases', href: '/products?category=Case', icon: Package },
      { name: 'CPU Coolers', href: '/products?category=Cooler', icon: Star },
    ],
  },
  {
    label: 'Monitors',
    icon: Monitor,
    href: '/products?category=Monitor',
    sub: [
      { name: 'Gaming Monitors', href: '/products?category=Monitor&tag=gaming', icon: Monitor },
      { name: '4K Monitors', href: '/products?category=Monitor&tag=4k', icon: Monitor },
      { name: 'Curved Monitors', href: '/products?category=Monitor&tag=curved', icon: Monitor },
      { name: 'Office Monitors', href: '/products?category=Monitor&tag=office', icon: Monitor },
    ],
  },
  {
    label: 'Networking',
    icon: Wifi,
    href: '/products?category=Networking',
    sub: [
      { name: 'Routers', href: '/products?category=Networking&tag=router', icon: Wifi },
      { name: 'Switches', href: '/products?category=Networking&tag=switch', icon: Wifi },
      { name: 'Network Cards', href: '/products?category=Networking&tag=card', icon: Wifi },
    ],
  },
  {
    label: 'Peripherals',
    icon: Keyboard,
    href: '/products?category=Accessories',
    sub: [
      { name: 'Mechanical Keyboards', href: '/products?category=Accessories&tag=keyboard', icon: Keyboard },
      { name: 'Gaming Mice', href: '/products?category=Accessories&tag=mouse', icon: Mouse },
      { name: 'Headsets', href: '/products?category=Accessories&tag=headset', icon: Headphones },
      { name: 'Speakers', href: '/products?category=Accessories&tag=speaker', icon: Speaker },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(0);
  const megaRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 px-4 font-medium">
        🚀 Free Delivery on orders over ৳5,000 within Dhaka &nbsp;|&nbsp; 📞 Hotline: 01700-000000
      </div>

      {/* Main Nav */}
      <div className="bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                Aesthetic<span className="text-primary">Tech</span>
              </span>
            </Link>

            {/* Desktop Mega Menu Nav */}
            <div className="hidden lg:flex items-center gap-1" ref={megaRef}>
              {MEGA_MENU.map((item) => (
                <div key={item.label} className="relative">
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeMega === item.label
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                    onMouseEnter={() => setActiveMega(item.label)}
                    onClick={() => setActiveMega(activeMega === item.label ? null : item.label)}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                    <ChevronDown className={`h-3 w-3 transition-transform ${activeMega === item.label ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ))}

              <Link
                href="/builder"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-2"
              >
                <Zap className="h-3.5 w-3.5" />
                PC Builder
              </Link>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 overflow-hidden"
                  >
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="bg-transparent text-sm py-2 outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                        }
                        if (e.key === 'Escape') setSearchOpen(false);
                      }}
                    />
                    <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-primary-foreground bg-primary rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link href="/dashboard" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/5">
                <User className="h-5 w-5" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMega && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="hidden lg:block absolute left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border shadow-2xl shadow-black/20 z-40"
            onMouseLeave={() => setActiveMega(null)}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {MEGA_MENU.filter(m => m.label === activeMega).map(menu => (
                <div key={menu.label} className="flex gap-12">
                  <div className="w-48 flex-shrink-0">
                    <Link
                      href={menu.href}
                      className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group"
                      onClick={() => setActiveMega(null)}
                    >
                      <menu.icon className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">{menu.label}</p>
                        <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          View All <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    {menu.sub.map(s => (
                      <Link
                        key={s.name}
                        href={s.href}
                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setActiveMega(null)}
                      >
                        <s.icon className="h-4 w-4 text-primary/60" />
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Search */}
              <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent text-sm py-2.5 outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) window.location.href = `/products?search=${encodeURIComponent(val)}`;
                    }
                  }}
                />
              </div>

              {MEGA_MENU.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 text-foreground hover:text-primary px-3 py-2.5 rounded-md text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4 text-primary/60" />
                  {item.label}
                </Link>
              ))}
              <Link href="/builder" className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2.5 rounded-md text-sm font-medium mt-2" onClick={() => setIsOpen(false)}>
                <Zap className="h-4 w-4" /> PC Builder
              </Link>
              <div className="border-t border-border pt-3 mt-3 flex gap-4">
                <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  <ShoppingCart className="h-4 w-4" /> Cart ({cartCount})
                </Link>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                  <User className="h-4 w-4" /> Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
