'use client';

import { useState, useEffect } from 'react';
import { Wallet, Banknote } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export default function LedgerPage() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/rider/ledger', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTotalEarnings(data.totalEarnings);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading your ledger...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Earnings Ledger</h2>
        <p className="text-muted-foreground text-sm">Track your delivery fees and payments.</p>
      </div>

      <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Wallet className="w-32 h-32" />
        </div>
        <p className="text-primary-foreground/80 text-sm font-medium mb-1">Total Earned</p>
        <h3 className="text-4xl font-black">৳{totalEarnings.toLocaleString()}</h3>
        <p className="text-xs text-primary-foreground/60 mt-4">Calculated at ৳50 per successful delivery.</p>
      </div>

      <div>
        <h3 className="font-bold mb-4">Transaction History</h3>
        
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground">No earnings recorded yet.</p>
            </div>
          ) : (
            transactions.map((tx, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/10 p-2 rounded-lg text-green-600">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="font-bold text-green-500">
                  +৳{tx.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
