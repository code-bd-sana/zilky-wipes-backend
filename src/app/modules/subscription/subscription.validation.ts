import { z } from 'zod';
import { SubscriptionStatus } from '@prisma/client';

const createSubscription = z.object({
  body: z.object({
    productVariantId: z.string({ message: 'Product variant ID is required' }),
    frequency: z.string({ message: 'Frequency is required' })
  })
});

const updateSubscriptionStatus = z.object({
  body: z.object({
    status: z.nativeEnum(SubscriptionStatus)
  })
});

export const SubscriptionValidation = {
  createSubscription,
  updateSubscriptionStatus
};
