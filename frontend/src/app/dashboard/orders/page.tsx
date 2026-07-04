'use client';

import { useState, useEffect } from 'react';
import { Package, ChevronRight } from 'lucide-react';

interface UserOrder {
  id: string;
  date: string;
  totalAmount: number;
  status: 'Pending' | 'Verified' | 'Cancelled' | 'Dispatched' | 'Delivered';
  itemsCount: number;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('http://localhost:5171/api/user/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          setOrders(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">My Orders</h1>
        <p className="text-muted-foreground">Track your recent purchases and delivery status.</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-muted-foreground max-w-sm">Looks like you haven't placed any orders yet. Start exploring our catalog to find the best tech!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-foreground">{order.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.itemsCount} items</td>
                    <td className="px-6 py-4 font-medium">৳{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                        order.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
