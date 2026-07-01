import { SubscriptionStatus } from '@prisma/client';

export interface ICreateSubscriptionPayload {
  productVariantId: string;
  frequency: string;
}

export interface IUpdateSubscriptionStatusPayload {
  status: SubscriptionStatus;
}
