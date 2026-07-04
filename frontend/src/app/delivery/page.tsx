'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, CheckCircle2, User, Receipt } from 'lucide-react';

interface Delivery {
  id: string;
  fullId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  amountToCollect: number;
  date: string;
}

export default function ActiveDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  const fetchActiveDeliveries = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5171/api/rider/deliveries/active', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDeliveries(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteDelivery = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5171/api/rider/deliveries/${id}/complete`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchActiveDeliveries();
      } else {
        alert("Failed to complete delivery.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading your routes...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Active Routes</h2>
        <p className="text-muted-foreground text-sm">You have {deliveries.length} pending deliveries.</p>
      </div>

      <div className="space-y-4">
        {deliveries.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center flex flex-col items-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
            <p className="font-medium">No active deliveries</p>
            <p className="text-xs text-muted-foreground mt-1">Take a break! You're all caught up.</p>
          </div>
        ) : (
          deliveries.map((delivery) => (
            <div key={delivery.fullId} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-blue-500 mb-1">ORDER #{delivery.id}</p>
                  <h3 className="font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {delivery.customerName}
                  </h3>
                </div>
                {delivery.amountToCollect > 0 && (
                  <div className="bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-lg text-right">
                    <p className="text-[10px] uppercase font-bold tracking-wider">Collect Cash</p>
                    <p className="font-black text-sm">৳{delivery.amountToCollect.toLocaleString()}</p>
                  </div>
                )}
                {delivery.amountToCollect === 0 && (
                  <div className="bg-green-500/10 text-green-600 px-3 py-1.5 rounded-lg text-right">
                    <p className="text-[10px] uppercase font-bold tracking-wider">Payment</p>
                    <p className="font-black text-sm">PAID</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 bg-secondary/50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm">{delivery.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm">{delivery.customerPhone}</p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button className="flex-1 bg-secondary text-foreground hover:bg-secondary/80 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Call Customer
                </button>
                <button 
                  onClick={() => handleCompleteDelivery(delivery.fullId)}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
