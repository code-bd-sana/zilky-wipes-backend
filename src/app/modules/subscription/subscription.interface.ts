import { SubscriptionStatus } from '@prisma/client';

export interface ICreateSubscriptionPayload {
  productVariantId: string;
  stripeSubscriptionId: string;
  frequency: string;
}

export interface IUpdateSubscriptionStatusPayload {
  status: SubscriptionStatus;
}
