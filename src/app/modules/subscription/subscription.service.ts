import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import type { ICreateSubscriptionPayload, IUpdateSubscriptionStatusPayload } from './subscription.interface';

const createSubscription = async (userId: string, payload: ICreateSubscriptionPayload) => {
  const result = await prisma.subscription.create({
    data: {
      userId,
      productVariantId: payload.productVariantId,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      frequency: payload.frequency
    },
    include: {
      productVariant: {
        include: { product: true }
      }
    }
  });

  return result;
};

const getMySubscriptions = async (userId: string) => {
  const result = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      productVariant: {
        include: { product: true }
      }
    }
  });
  return result;
};

const getAllSubscriptions = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['stripeSubscriptionId'])
    .filter()
    .sort()
    .paginate();

  const subscriptions = await prisma.subscription.findMany({
    ...queryBuilder.build(),
    include: {
      productVariant: {
        include: { product: true }
      }
    }
  });

  const total = await prisma.subscription.count({
    where: queryBuilder.build().where
  });

  return {
    meta: {
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10
    },
    data: subscriptions
  };
};

const getSubscriptionById = async (id: string, userId?: string, role?: string) => {
  const result = await prisma.subscription.findUnique({
    where: { id },
    include: {
      productVariant: {
        include: { product: true }
      }
    }
  });

  if (!result) {
    throw new AppError(404, 'Subscription not found.');
  }

  if (role === 'USER' && result.userId !== userId) {
    throw new AppError(403, 'You do not have permission to view this subscription.');
  }

  return result;
};

const updateSubscriptionStatus = async (id: string, payload: IUpdateSubscriptionStatusPayload) => {
  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) {
    throw new AppError(404, 'Subscription not found.');
  }

  const result = await prisma.subscription.update({
    where: { id },
    data: { status: payload.status }
  });

  return result;
};

export const SubscriptionService = {
  createSubscription,
  getMySubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionStatus
};
