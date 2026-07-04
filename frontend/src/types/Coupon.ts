export interface Coupon {
  id: number;
  code: string;
  description?: string;
  isPercentage: boolean;
  discountValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  startsAt: string; // ISO date
  expiresAt: string; // ISO date
  minimumOrderAmount?: number;
  appliesToAllProducts: boolean;
  productIds?: number[];
  categoryIds?: number[];
  isActive: boolean;
}
