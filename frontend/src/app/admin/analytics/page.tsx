'use client';

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";

interface Summary {
  totalOrders: number;
  totalRevenue: number;
  newCustomers: number;
  averageOrderValue: number;
}

interface OrdersByDay {
  date: string; // YYYY-MM-DD
  orders: number;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [ordersData, setOrdersData] = useState<OrdersByDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/admin/analytics/summary", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch summary");
      setSummary(await res.json());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/analytics/orders-by-day", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders data");
      setOrdersData(await res.json());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchSummary(), fetchOrders()]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="p-8 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <p className="text-lg text-muted-foreground">Loading analytics…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-8 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <p className="text-red-600">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="p-8 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-primary">Analytics Dashboard</h1>
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground mb-4 block">
        ← Back to Admin Home
      </Link>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-card rounded shadow">
          <h2 className="text-lg font-medium">Total Orders</h2>
          <p className="text-2xl font-bold">{summary?.totalOrders ?? "-"}</p>
        </div>
        <div className="p-4 bg-card rounded shadow">
          <h2 className="text-lg font-medium">Total Revenue</h2>
          <p className="text-2xl font-bold">${summary?.totalRevenue?.toLocaleString() ?? "-"}</p>
        </div>
        <div className="p-4 bg-card rounded shadow">
          <h2 className="text-lg font-medium">New Customers</h2>
          <p className="text-2xl font-bold">{summary?.newCustomers ?? "-"}</p>
        </div>
        <div className="p-4 bg-card rounded shadow">
          <h2 className="text-lg font-medium">Avg Order Value</h2>
          <p className="text-2xl font-bold">${summary?.averageOrderValue?.toFixed(2) ?? "-"}</p>
        </div>
      </div>

      {/* Orders over time chart */}
      <div className="bg-card rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Orders By Day (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ordersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
