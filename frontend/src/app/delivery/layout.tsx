'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Map, Package, Wallet, User, LogOut } from 'lucide-react';

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [riderInfo, setRiderInfo] = useState({ name: 'Rider', shortId: 'RDR-...' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/rider/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setRiderInfo(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch rider profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Mobile Top Bar */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-foreground">{riderInfo.name}</h1>
            <p className="text-xs text-muted-foreground">ID: {riderInfo.shortId}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full h-16 bg-card border-t border-border flex items-center justify-around z-20 px-2 pb-safe">
        <Link href="/delivery" className="flex flex-col items-center p-2 text-primary">
          <Map className="h-6 w-6" />
          <span className="text-[10px] font-medium mt-1">Routes</span>
        </Link>
        <Link href="/delivery/history" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary transition-colors">
          <Package className="h-6 w-6" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </Link>
        <Link href="/delivery/ledger" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary transition-colors">
          <Wallet className="h-6 w-6" />
          <span className="text-[10px] font-medium mt-1">Ledger</span>
        </Link>
      </nav>
    </div>
  );
}
