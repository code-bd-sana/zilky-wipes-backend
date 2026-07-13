import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

const createOrder = z.object({
  body: z.object({
    items: z.array(z.object({
      productVariantId: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().min(0),
      isSubscription: z.boolean().optional(),
      frequency: z.string().optional()
    })).min(1),
    shippingAddress: z.object({
      firstName: z.string(),
      lastName: z.string(),
      streetAddress: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string().optional()
    }),
    subtotal: z.number().min(0),
    shippingCost: z.number().min(0).optional(), // optional because backend recalculates
    total: z.number().min(0),
    couponCode: z.string().optional(),
    shippingMethodId: z.string().uuid().optional() // New field for dynamic shipping
  })
});

const updateOrderStatus = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus)
  })
});

const updateOrderTracking = z.object({
  body: z.object({
    trackingNumber: z.string().optional(),
    shippingCarrier: z.string().optional()
  })
});

export const OrderValidation = {
  createOrder,
  updateOrderStatus,
  updateOrderTracking
};
