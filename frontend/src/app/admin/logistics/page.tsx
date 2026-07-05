'use client';

import { useState, useEffect } from 'react';
import { Truck, MapPin, User, ChevronRight } from 'lucide-react';

interface Rider {
  id: string;
  name: string;
  phone: string;
  activeDeliveries: number;
}

interface Shipment {
  id: string;
  originalId: string;
  customer: string;
  address: string;
  amount: number;
  assignedTo: string | null;
  status: string;
}

export default function LogisticsPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [ridersRes, shipmentsRes] = await Promise.all([
        fetch('/api/admin/riders', { headers }),
        fetch('/api/admin/shipments', { headers })
      ]);
      
      if (ridersRes.ok) setRiders(await ridersRes.json());
      if (shipmentsRes.ok) setShipments(await shipmentsRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingShipments = shipments.filter(s => s.status === 'Verified');
  const activeShipments = shipments.filter(s => s.status === 'Dispatched' || s.status === 'Delivered');

  const handleAssignRider = async (orderId: string, riderId: string) => {
    if (!riderId) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/assign-logistics', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ orderId, riderId })
      });
      
      if (res.ok) {
        fetchData(); // Refresh all data from database
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRiderName = (id: string) => riders.find(r => r.id === id)?.name || 'Unknown Rider';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Logistics & Dispatch</h1>
        <p className="text-muted-foreground">Assign verified orders to delivery riders and track active shipments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Dispatch */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary/10 p-2 rounded-md">
              <PackageIcon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Ready for Dispatch</h2>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading shipments...</p>
            ) : pendingShipments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders ready for dispatch.</p>
            ) : (
              pendingShipments.map(shipment => (
                <div key={shipment.originalId} className="p-4 border border-border rounded-lg bg-background">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-foreground">{shipment.id}</h3>
                      <p className="text-sm font-medium text-foreground">{shipment.customer}</p>
                    </div>
                    <div className="text-right font-bold text-primary">
                      ৳{shipment.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{shipment.address}</span>
                  </div>

                  <div className="flex gap-2">
                    <select 
                      id={`rider-select-${shipment.originalId}`}
                      className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Rider...</option>
                      {riders.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.activeDeliveries} active)
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={() => {
                        const select = document.getElementById(`rider-select-${shipment.originalId}`) as HTMLSelectElement;
                        handleAssignRider(shipment.originalId, select.value);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Shipments */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-blue-500/10 p-2 rounded-md">
              <Truck className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold">Active & Recent Shipments</h2>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading shipments...</p>
            ) : activeShipments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active shipments.</p>
            ) : activeShipments.map(shipment => (
              <div key={shipment.originalId} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{shipment.id}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      shipment.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {shipment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Rider: <strong>{getRiderName(shipment.assignedTo!)}</strong></span>
                  </div>
                </div>
                
                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function PackageIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  );
}
