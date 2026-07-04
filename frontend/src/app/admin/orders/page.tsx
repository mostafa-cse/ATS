"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/types/Order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load orders");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-8 text-lg">Loading orders…</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;

  return (
    <section className="p-8 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-primary">Orders Management</h1>
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground mb-4 block">
        ← Back to Admin Home
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/30 backdrop-blur-md rounded-lg shadow-lg">
          <thead className="bg-white/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">#</th>
              <th className="px-4 py-2 text-left font-medium">Customer</th>
              <th className="px-4 py-2 text-right font-medium">Total</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t border-white/20 hover:bg-white/40 transition">
                <td className="px-4 py-2 font-mono">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2 text-right">${order.total.toFixed(2)}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
