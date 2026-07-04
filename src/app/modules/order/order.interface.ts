import { OrderStatus } from '@prisma/client';

export interface ICreateOrderPayload {
  items: {
    productVariantId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
}

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface IUpdateOrderTrackingPayload {
  trackingNumber: string;
}
