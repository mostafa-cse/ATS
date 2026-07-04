'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, LayoutDashboard, Package, Users, Truck, CheckSquare, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'role=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight text-foreground">
              Admin Panel
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/admin" className="flex items-center px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/admin/inventory" className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <Package className="mr-3 h-5 w-5" /> Products
          </Link>
          <Link href="/admin/coupons" className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <CheckSquare className="h-5 w-5 mr-3" />
            Coupons
          </Link>
          <Link href="/admin/analytics" className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <Truck className="h-5 w-5 mr-3" />
            Analytics
          </Link>
          <Link href="/admin/users" className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
            <Users className="h-5 w-5 mr-3" />
            Users
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center mb-2">
            ← Back to Store
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-500/10 font-medium transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 md:hidden">
            <span className="font-bold text-lg">Admin</span>
            {/* Mobile menu toggle could be added here */}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
