import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import type { ICreateOrderPayload, IUpdateOrderStatusPayload, IUpdateOrderTrackingPayload } from './order.interface';

// Generate a random order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `#ORD-${timestamp}-${random}`;
};

const createOrder = async (userId: string | undefined, payload: ICreateOrderPayload) => {
  const orderNumber = generateOrderNumber();

  const result = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      guestEmail: payload.guestEmail,
      subtotal: payload.subtotal,
      shippingCost: payload.shippingCost,
      total: payload.total,
      shippingFirstName: payload.shippingAddress.firstName,
      shippingLastName: payload.shippingAddress.lastName,
      shippingStreetAddress: payload.shippingAddress.streetAddress,
      shippingCity: payload.shippingAddress.city,
      shippingState: payload.shippingAddress.state,
      shippingPostalCode: payload.shippingAddress.postalCode,
      shippingCountry: payload.shippingAddress.country,
      shippingPhone: payload.shippingAddress.phone,
      items: {
        create: payload.items.map(item => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      items: {
        include: {
          productVariant: true
        }
      }
    }
  });

  return result;
};

const getMyOrders = async (userId: string) => {
  const result = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true }
          }
        }
      }
    }
  });
  return result;
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['orderNumber', 'guestEmail'])
    .filter()
    .sort()
    .paginate();

  const orders = await prisma.order.findMany({
    ...queryBuilder.build(),
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true }
          }
        }
      }
    }
  });

  const total = await prisma.order.count({
    where: queryBuilder.build().where
  });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    },
    data: orders
  };
};

const getOrderById = async (id: string, userId?: string, role?: string) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true }
          }
        }
      }
    }
  });

  if (!result) {
    throw new AppError(404, 'Order not found.');
  }

  // If USER role, ensure the order belongs to them
  if (role === 'USER' && result.userId !== userId) {
    throw new AppError(403, 'You do not have permission to view this order.');
  }

  return result;
};

const updateOrderStatus = async (id: string, payload: IUpdateOrderStatusPayload) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  const result = await prisma.order.update({
    where: { id },
    data: { status: payload.status }
  });

  return result;
};

const updateOrderTracking = async (id: string, payload: IUpdateOrderTrackingPayload) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  const result = await prisma.order.update({
    where: { id },
    data: { trackingNumber: payload.trackingNumber }
  });

  // Here we would typically send an email with the tracking number
  
  return result;
};

export const OrderService = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderTracking
};
