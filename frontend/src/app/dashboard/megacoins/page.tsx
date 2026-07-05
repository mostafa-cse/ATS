'use client';

import { useState, useEffect } from 'react';
import { Coins, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MegaCoinTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Earned' | 'Spent';
}

export default function MegaCoinsPage() {
  const [transactions, setTransactions] = useState<MegaCoinTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMegaCoins = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [profileRes, txRes] = await Promise.all([
          fetch('/api/user/me', { headers }),
          fetch('/api/user/megacoins', { headers })
        ]);
        
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setBalance(profile.megaCoinBalance);
        }
        
        if (txRes.ok) {
          setTransactions(await txRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch MegaCoins", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMegaCoins();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">MegaCoins Ledger</h1>
        <p className="text-muted-foreground">View your current balance and transaction history.</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-8 mb-8 flex items-center gap-6">
        <div className="bg-amber-500 p-4 rounded-full text-white shadow-lg shadow-amber-500/30">
          <Coins className="h-10 w-10" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Current Balance</p>
          <h2 className="text-5xl font-black text-amber-500">{balance.toLocaleString()} <span className="text-2xl text-foreground">MC</span></h2>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading your ledger...</div>
        ) : transactions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Coins className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No transactions yet</h3>
            <p className="text-muted-foreground max-w-sm">You haven't earned or spent any MegaCoins yet. Earn coins by making purchases!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-muted-foreground">{tx.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                    <td className="px-6 py-4 text-foreground">{tx.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex items-center justify-end gap-1 font-bold ${
                        tx.type === 'Earned' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {tx.type === 'Earned' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {tx.type === 'Earned' ? '+' : '-'}{tx.amount} MC
                      </div>
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
