import { SubscriptionStatus } from '@prisma/client';

export interface ICreateSubscriptionPayload {
  productVariantId: string;
  frequency: string;
  quantity?: number;
}

export interface IUpdateSubscriptionStatusPayload {
  status: SubscriptionStatus;
}
