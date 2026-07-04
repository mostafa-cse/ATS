'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Coins, LogOut, Cpu } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold">My Account</h2>
                <p className="text-xs text-muted-foreground">User Member</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium">
                <LayoutDashboard className="h-4 w-4 mr-3" />
                Dashboard
              </Link>
              <Link href="/dashboard/orders" className="flex items-center px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                <Package className="h-4 w-4 mr-3" />
                My Orders
              </Link>
              <Link href="/dashboard/megacoins" className="flex items-center px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground font-medium transition-colors">
                <Coins className="h-4 w-4 mr-3" />
                MegaCoins Ledger
              </Link>
              <button onClick={handleLogout} className="w-full mt-8 flex items-center px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 font-medium transition-colors">
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Temporary icon component since LayoutDashboard wasn't imported above
function LayoutDashboard(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
}
