'use client';

import { useEffect, useState } from 'react';
import { Package, Coins, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  megaCoinBalance: number;
}

export default function DashboardOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [profileRes, ordersRes] = await Promise.all([
          fetch('http://localhost:5171/api/user/me', { headers }),
          fetch('http://localhost:5171/api/user/orders', { headers })
        ]);

        if (profileRes.ok) {
          setProfile(await profileRes.json());
        }
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          setOrderCount(orders.length);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="py-12 text-center text-muted-foreground">Loading your dashboard...</div>;
  }

  if (!profile) {
    return <div className="py-12 text-center text-destructive">Failed to load profile. Please try logging in again.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.name}! 👋</h1>
        <p className="text-muted-foreground max-w-2xl">
          Here's what's happening with your Aesthetic Tech Store account today. Manage your recent orders or check your MegaCoins balance.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Stat */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <h3 className="text-3xl font-bold">{orderCount}</h3>
            </div>
          </div>
          <Link href="/dashboard/orders" className="text-sm font-medium text-primary flex items-center hover:underline">
            View order history <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* MegaCoins Stat */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-500/10 p-3 rounded-lg">
              <Coins className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">MegaCoins Balance</p>
              <h3 className="text-3xl font-bold text-amber-500">
                {profile.megaCoinBalance.toLocaleString()} <span className="text-lg">MC</span>
              </h3>
            </div>
          </div>
          <Link href="/dashboard/megacoins" className="text-sm font-medium text-amber-600 flex items-center hover:underline">
            View transaction ledger <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
