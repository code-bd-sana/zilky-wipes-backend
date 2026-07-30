import { z } from 'zod';
import { ShippingActionType } from '@prisma/client';

const createMethod = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    estimatedDeliveryTime: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

const updateMethod = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    estimatedDeliveryTime: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

const createRule = z.object({
  body: z.object({
    name: z.string(),
    methodId: z.string().uuid().optional(),
    isActive: z.boolean().optional(),
    priority: z.number().int().optional(),
    minOrderTotal: z.number().optional().nullable(),
    maxOrderTotal: z.number().optional().nullable(),
    minWeight: z.number().optional().nullable(),
    maxWeight: z.number().optional().nullable(),
    minItems: z.number().int().optional().nullable(),
    maxItems: z.number().int().optional().nullable(),
    targetCountries: z.array(z.string()).optional(),
    targetStates: z.array(z.string()).optional(),
    targetZipCodes: z.array(z.string()).optional(),
    isForSubscription: z.boolean().optional().nullable(),
    requiredCouponId: z.string().uuid().optional().nullable(),
    actionType: z.enum(['SET_PRICE', 'FREE_SHIPPING', 'PERCENTAGE_OFF']),
    actionValue: z.number().optional().nullable()
  })
});

const updateRule = z.object({
  body: z.object({
    name: z.string().optional(),
    methodId: z.string().uuid().optional().nullable(),
    isActive: z.boolean().optional(),
    priority: z.number().int().optional(),
    minOrderTotal: z.number().optional().nullable(),
    maxOrderTotal: z.number().optional().nullable(),
    minWeight: z.number().optional().nullable(),
    maxWeight: z.number().optional().nullable(),
    minItems: z.number().int().optional().nullable(),
    maxItems: z.number().int().optional().nullable(),
    targetCountries: z.array(z.string()).optional(),
    targetStates: z.array(z.string()).optional(),
    targetZipCodes: z.array(z.string()).optional(),
    isForSubscription: z.boolean().optional().nullable(),
    requiredCouponId: z.string().uuid().optional().nullable(),
    actionType: z.enum(['SET_PRICE', 'FREE_SHIPPING', 'PERCENTAGE_OFF']).optional(),
    actionValue: z.number().optional().nullable()
  })
});

export const ShippingValidation = {
  createMethod,
  updateMethod,
  createRule,
  updateRule
};
