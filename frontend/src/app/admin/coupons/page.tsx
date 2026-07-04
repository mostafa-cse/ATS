"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coupon } from '@/types/Coupon'; // we'll add a type definition later
import CouponTable from './CouponTable';
import CouponForm from './CouponForm';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  const fetchCoupons = async () => {
    const res = await fetch('/api/admin/coupons', {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      console.error('Failed to fetch coupons');
      return [];
    }
    return (await res.json()) as Coupon[];
  };

  const loadCoupons = async () => {
    setLoading(true);
    const data = await fetchCoupons();
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = () => {
    setEditCoupon(null);
    setShowForm(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    } else {
      alert('Failed to delete');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditCoupon(null);
    loadCoupons();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Coupons Management</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Add New Coupon
        </button>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Admin Home
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CouponTable coupons={coupons} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {showForm && (
        <CouponForm
          initialData={editCoupon}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
