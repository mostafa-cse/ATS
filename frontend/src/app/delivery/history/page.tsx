'use client';

import { useState, useEffect } from 'react';
import { Package, Calendar } from 'lucide-react';

interface HistoryItem {
  id: string;
  customerName: string;
  status: 'Delivered' | 'Cancelled';
  date: string;
}

export default function DeliveryHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/rider/deliveries/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading your history...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Past Deliveries</h2>
        <p className="text-muted-foreground text-sm">You have completed {history.filter(h => h.status === 'Delivered').length} deliveries.</p>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center">
            <Package className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
            <p className="font-medium">No history found</p>
            <p className="text-xs text-muted-foreground mt-1">Your completed routes will appear here.</p>
          </div>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">ORDER #{item.id}</p>
                <h3 className="font-bold text-sm">{item.customerName}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </div>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
