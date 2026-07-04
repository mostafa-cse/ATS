'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  // Mock data for demonstration
  const [codOrders, setCodOrders] = useState([
    { id: 'ORD-1001', customer: 'Rahim Uddin', phone: '01711223344', total: 155000, verified: false, advancePaid: 15500 },
    { id: 'ORD-1002', customer: 'Karim Hasan', phone: '01855667788', total: 45000, verified: false, advancePaid: 4500 },
  ]);

  const [pendingLogistics, setPendingLogistics] = useState([
    { id: 'ORD-0995', destination: 'Gulshan 1', status: 'Ready for Pickup' },
    { id: 'ORD-0998', destination: 'Dhanmondi 27', status: 'Ready for Pickup' },
  ]);

  const riders = ['Rider 1 (Kamal)', 'Rider 2 (Jamal)', 'Rider 3 (Sagor)'];

  const handleVerify = (id: string) => {
    setCodOrders(orders => 
      orders.map(o => o.id === id ? { ...o, verified: true } : o)
    );
  };

  const handleAssign = (orderId: string, rider: string) => {
    setPendingLogistics(orders => orders.filter(o => o.id !== orderId));
    alert(`Assigned ${orderId} to ${rider}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard overview</h1>
        <p className="text-muted-foreground">Manage verifications and logistics assignments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Queue (COD) */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <PhoneCall className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">COD Verification Queue</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">High-value COD orders (&gt; ৳10,000) requiring manual phone verification.</p>
          
          <div className="space-y-4">
            {codOrders.map(order => (
              <motion.div 
                key={order.id}
                layout
                className={`p-4 rounded-lg border ${order.verified ? 'border-primary/50 bg-primary/5' : 'border-border bg-background'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.customer} • {order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">৳{order.total.toLocaleString()}</p>
                    <p className="text-xs text-primary">Advance Paid: ৳{order.advancePaid.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  {order.verified ? (
                    <span className="inline-flex items-center text-sm text-primary font-medium">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified via Phone
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleVerify(order.id)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Mark as Verified
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {codOrders.every(o => o.verified) && (
              <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                <CheckCircle2 className="h-8 w-8 text-primary/50 mb-2" />
                <p>All high-value orders verified!</p>
              </div>
            )}
          </div>
        </div>

        {/* Logistics Assignment */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Truck className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold">Logistics Assignment</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Assign verified & packed orders to delivery riders.</p>
          
          <div className="space-y-4">
            {pendingLogistics.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No orders pending assignment.
              </div>
            ) : (
              pendingLogistics.map(order => (
                <div key={order.id} className="p-4 rounded-lg border border-border bg-background">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.destination}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded font-medium">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <select className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
                      <option value="">Select Rider...</option>
                      {riders.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => handleAssign(order.id, 'Selected Rider')}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 border border-border h-9 px-4"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
