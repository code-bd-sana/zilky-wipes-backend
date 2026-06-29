import { z } from 'zod';
import { SubscriptionStatus } from '@prisma/client';

const createSubscription = z.object({
  body: z.object({
    productVariantId: z.string({ required_error: 'Product Variant ID is required' }),
    stripeSubscriptionId: z.string({ required_error: 'Stripe Subscription ID is required' }),
    frequency: z.string({ required_error: 'Frequency is required' })
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
