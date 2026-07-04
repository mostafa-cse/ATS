import React from 'react';
import { Coupon } from '@/types/Coupon';

interface CouponTableProps {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: number) => void;
}

export default function CouponTable({ coupons, onEdit, onDelete }: CouponTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Discount</th>
            <th className="px-4 py-2 text-left">Active</th>
            <th className="px-4 py-2 text-left">Valid From</th>
            <th className="px-4 py-2 text-left">Valid To</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">{c.code}</td>
              <td className="px-4 py-2">
                {c.isPercentage ? `${c.discountValue}%` : `$${c.discountValue}`}
              </td>
              <td className="px-4 py-2">
                {c.isActive ? 'Yes' : 'No'}
              </td>
              <td className="px-4 py-2">
                {new Date(c.startsAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {new Date(c.expiresAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(c)}
                  className="px-2 py-1 text-sm text-primary bg-primary/10 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="px-2 py-1 text-sm text-destructive bg-destructive/10 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
