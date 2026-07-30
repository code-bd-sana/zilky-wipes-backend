import { DiscountType } from '@prisma/client';

export interface ICreateCouponPayload {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom?: Date | string;
  validUntil?: Date | string;
  isActive?: boolean;
  usageLimit?: number;
}

export interface IUpdateCouponPayload {
  code?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom?: Date | string;
  validUntil?: Date | string;
  isActive?: boolean;
  usageLimit?: number;
}
