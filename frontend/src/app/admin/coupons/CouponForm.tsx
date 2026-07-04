"use client";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Coupon } from '@/types/Coupon';

// Zod schema for coupon validation
const couponSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  isPercentage: z.boolean(),
  discountValue: z
    .number()
    .min(0, 'Discount must be non‑negative'),
  maxUses: z
    .number()
    .int('Max uses must be an integer')
    .min(1, 'Max uses must be at least 1')
    .optional()
    .or(z.literal(undefined)),
  maxUsesPerUser: z
    .number()
    .int('Max uses per user must be an integer')
    .min(1, 'Max uses per user must be at least 1')
    .optional()
    .or(z.literal(undefined)),
  startsAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date',
  }),
  expiresAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid expiry date',
  }),
  minimumOrderAmount: z
    .number()
    .min(0, 'Minimum order amount must be non‑negative')
    .or(z.literal(undefined)),
  appliesToAllProducts: z.boolean(),
  productIds: z
    .array(z.number().int().positive())
    .optional()
    .or(z.literal(undefined)),
  categoryIds: z
    .array(z.number().int().positive())
    .optional()
    .or(z.literal(undefined)),
  isActive: z.boolean(),
});

type CouponFormProps = {
  /**
   * When editing an existing coupon, pass the coupon object; otherwise `null` for a create operation.
   */
  initialData: Coupon | null;
  /**
   * Callback invoked after the form is successfully submitted or the user cancels.
   */
  onClose: () => void;
};

/**
 * Re‑usable modal form for creating or editing coupons.
 *
 * The component uses **react‑hook‑form** together with **zod** for runtime validation.
 * It posts to the backend API:
 *   - `POST /api/admin/coupons` for creation
 *   - `PUT  /api/admin/coupons/:id` for updates
 *
 * On success it simply calls `onClose` – the parent page will re‑load the list.
 */
export default function CouponForm({ initialData, onClose }: CouponFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      description: '',
      isPercentage: false,
      discountValue: 0,
      maxUses: undefined,
      maxUsesPerUser: undefined,
      startsAt: new Date().toISOString().slice(0, 16), // "YYYY‑MM‑DDTHH:mm"
      expiresAt: new Date().toISOString().slice(0, 16),
      minimumOrderAmount: undefined,
      appliesToAllProducts: true,
      productIds: undefined,
      categoryIds: undefined,
      isActive: true,
    },
  });

  // Populate the form when editing an existing coupon
  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        description: initialData.description ?? '',
        isPercentage: initialData.isPercentage,
        discountValue: initialData.discountValue,
        maxUses: initialData.maxUses,
        maxUsesPerUser: initialData.maxUsesPerUser,
        startsAt: initialData.startsAt.slice(0, 16),
        expiresAt: initialData.expiresAt.slice(0, 16),
        minimumOrderAmount: initialData.minimumOrderAmount,
        appliesToAllProducts: initialData.appliesToAllProducts,
        productIds: initialData.productIds,
        categoryIds: initialData.categoryIds,
        isActive: initialData.isActive,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: z.infer<typeof couponSchema>) => {
    const payload = {
      ...data,
      startsAt: new Date(data.startsAt).toISOString(),
      expiresAt: new Date(data.expiresAt).toISOString(),
    };
    try {
      const url = initialData ? `/api/admin/coupons/${initialData.id}` : '/api/admin/coupons';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to save coupon');
      }
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Unexpected error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4">
          {initialData ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* Code */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="code">Code</label>
            <input id="code" type="text" className={`w-full rounded border px-3 py-2 ${errors.code ? 'border-destructive' : ''}`} {...register('code')} />
            {errors.code && <p className="text-destructive text-sm mt-1">{errors.code.message}</p>}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="description">Description (optional)</label>
            <textarea id="description" rows={2} className="w-full rounded border px-3 py-2" {...register('description')} />
          </div>

          {/* Discount Type */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="isPercentage" {...register('isPercentage')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="isPercentage" className="text-sm">Percentage Discount</label>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="discountValue">Discount Value</label>
            <input id="discountValue" type="number" step="0.01" className={`w-full rounded border px-3 py-2 ${errors.discountValue ? 'border-destructive' : ''}`} {...register('discountValue', { valueAsNumber: true })} />
            {errors.discountValue && <p className="text-destructive text-sm mt-1">{errors.discountValue.message}</p>}
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="maxUses">Max Uses (optional)</label>
            <input id="maxUses" type="number" className="w-full rounded border px-3 py-2" {...register('maxUses', { valueAsNumber: true })} />
          </div>

          {/* Max Uses Per User */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="maxUsesPerUser">Max Uses Per User (optional)</label>
            <input id="maxUsesPerUser" type="number" className="w-full rounded border px-3 py-2" {...register('maxUsesPerUser', { valueAsNumber: true })} />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="startsAt">Starts At</label>
            <input id="startsAt" type="datetime-local" className={`w-full rounded border px-3 py-2 ${errors.startsAt ? 'border-destructive' : ''}`} {...register('startsAt')} />
            {errors.startsAt && <p className="text-destructive text-sm mt-1">{errors.startsAt.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="expiresAt">Expires At</label>
            <input id="expiresAt" type="datetime-local" className={`w-full rounded border px-3 py-2 ${errors.expiresAt ? 'border-destructive' : ''}`} {...register('expiresAt')} />
            {errors.expiresAt && <p className="text-destructive text-sm mt-1">{errors.expiresAt.message}</p>}
          </div>

          {/* Minimum Order Amount */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="minimumOrderAmount">Minimum Order Amount (optional)</label>
            <input id="minimumOrderAmount" type="number" step="0.01" className="w-full rounded border px-3 py-2" {...register('minimumOrderAmount', { valueAsNumber: true })} />
          </div>

          {/* Applies To All Products */}
          <div className="flex items-center space-x-2 col-span-2">
            <input type="checkbox" id="appliesToAllProducts" {...register('appliesToAllProducts')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="appliesToAllProducts" className="text-sm">Applies to All Products</label>
          </div>

          {/* Product IDs */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="productIds">Product IDs (comma‑separated, optional)</label>
            <input id="productIds" type="text" placeholder="e.g., 1,2,3" className="w-full rounded border px-3 py-2" {...register('productIds', { setValueAs: (v: string) => v?.trim() ? v.split(',').map((s: string) => Number(s.trim())) : undefined })} />
          </div>

          {/* Category IDs */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="categoryIds">Category IDs (comma‑separated, optional)</label>
            <input id="categoryIds" type="text" placeholder="e.g., 4,5" className="w-full rounded border px-3 py-2" {...register('categoryIds', { setValueAs: (v: string) => v?.trim() ? v.split(',').map((s: string) => Number(s.trim())) : undefined })} />
          </div>

          {/* Active */}
          <div className="flex items-center space-x-2 col-span-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="isActive" className="text-sm">Active</label>
          </div>

          {/* Action Buttons */}
          <div className="col-span-2 flex justify-end space-x-3 mt-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90">{initialData ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
