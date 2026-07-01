import { z } from 'zod';
import { DiscountType } from '@prisma/client';

const createCoupon = z.object({
  body: z.object({
    code: z.string({ message: 'Coupon code is required' }),
    discountType: z.nativeEnum(DiscountType, { message: 'Discount type is required' }),
    discountValue: z.number({ message: 'Discount value is required' }).min(0),
    minOrderValue: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    validFrom: z.string().datetime().optional(),
    validUntil: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
    usageLimit: z.number().int().min(1).optional()
  })
});

const updateCoupon = z.object({
  body: z.object({
    code: z.string().optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    discountValue: z.number().min(0).optional(),
    minOrderValue: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    validFrom: z.string().datetime().optional(),
    validUntil: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
    usageLimit: z.number().int().min(1).optional()
  })
});

export const CouponValidation = {
  createCoupon,
  updateCoupon
};
