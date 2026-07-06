import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import type { IChangeRolePayload } from './user.interface';

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  return user;
};

const updateProfile = async (userId: string, payload: { firstName?: string; lastName?: string; username?: string; email?: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return updatedUser;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['firstName', 'lastName', 'email'])
    .filter()
    .sort()
    .paginate();

  const users = await prisma.user.findMany({
    ...queryBuilder.build(),
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  const total = await prisma.user.count({
    where: queryBuilder.build().where
  });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    },
    data: users
  };
};

const getCustomers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['firstName', 'lastName', 'email'])
    .filter()
    .sort()
    .paginate();

  const users = await prisma.user.findMany({
    ...queryBuilder.build(),
    where: {
      ...queryBuilder.build().where,
      role: 'USER', // Only fetch regular users for CRM
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      // Aggregating CRM data
      orders: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          createdAt: true,
          status: true,
          shippingPhone: true,
          items: {
            select: {
              quantity: true,
            }
          }
        }
      },
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 1, // Get most recent subscription
        select: {
          status: true,
          frequency: true,
          productVariant: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  const total = await prisma.user.count({
    where: {
      ...queryBuilder.build().where,
      role: 'USER',
    }
  });

  // Transform to match CRM frontend expectations
  const transformedCustomers = users.map(user => {
    const latestOrder = user.orders[0];
    const latestSubscription = user.subscriptions[0];
    
    // Calculate LTV (Lifetime Value)
    const lifetimeValue = user.orders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate Total Items
    let totalItems = 0;
    user.orders.forEach(order => {
      order.items.forEach(item => {
        totalItems += item.quantity;
      });
    });

    // Formatting Order History for timeline
    const orderHistory = user.orders.map(order => ({
      id: order.id,
      date: order.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: order.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      label: `Order ${order.orderNumber}`,
      amount: `$${order.total.toFixed(2)}`,
      status: order.status,
      isPending: order.status === 'PROCESSING'
    }));

    // Find phone from latest order
    const phone = user.orders.find(o => o.shippingPhone)?.shippingPhone || "N/A";

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      joined: user.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      order: latestOrder ? latestOrder.orderNumber : "N/A",
      frequency: latestSubscription ? latestSubscription.frequency : "One-time",
      status: latestSubscription ? latestSubscription.status : "Active",
      lifetimeValue: `$${lifetimeValue.toFixed(2)}`,
      items: totalItems.toString(),
      phone,
      subscriptionType: latestSubscription ? latestSubscription.productVariant.name : "N/A",
      orderHistory
    };
  });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    },
    data: transformedCustomers
  };
};

const changeRole = async (id: string, payload: IChangeRolePayload) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: payload.role },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true
    }
  });

  return updatedUser;
};

export const UserService = {
  getMe,
  updateProfile,
  getAllUsers,
  getCustomers,
  changeRole
};
