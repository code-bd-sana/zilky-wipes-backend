import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import stripe from '../../utils/stripe';
import config from '../../config';
import type { ICreateSubscriptionPayload, IUpdateSubscriptionStatusPayload } from './subscription.interface';

const createSubscription = async (userId: string, payload: ICreateSubscriptionPayload) => {
  const variant = await prisma.productVariant.findUnique({ where: { id: payload.productVariantId } });
  if (!variant) {
    throw new AppError(404, 'Product variant not found');
  }

  // To create a subscription in Stripe, the product variant must have a stripePriceId created beforehand in Stripe dashboard
  if (!variant.stripePriceId) {
    throw new AppError(400, 'This product variant is not configured for Stripe subscriptions (missing stripePriceId). Please configure it in the admin panel first.');
  }

  const result = await prisma.subscription.create({
    data: {
      userId,
      productVariantId: payload.productVariantId,
      stripeSubscriptionId: `pending_${Date.now()}`, // Webhook will replace this with real ID
      frequency: payload.frequency,
      quantity: payload.quantity || 1,
      status: 'PAST_DUE' // Start as PAST_DUE or UNPAID, webhook will mark ACTIVE
    },
    include: {
      productVariant: {
        include: { product: true }
      }
    }
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: variant.stripePriceId, // Requires actual Price ID from Stripe
        quantity: payload.quantity || 1
      }
    ],
    mode: 'subscription',
    success_url: `${config.stripe.frontendUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.frontendUrl}/subscription-cancel`,
    metadata: {
      subscriptionId: result.id
    }
  });

  return {
    ...result,
    checkoutUrl: session.url
  };
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
      },
      user: true
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
      },
      user: true
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

const deleteSubscription = async (id: string, userId: string) => {
  const result = await prisma.subscription.delete({
    where: { id, userId }
  });
  return result;
};

const pauseSubscription = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.findUnique({ where: { id, userId } });
  if (!subscription) {
    throw new AppError(404, 'Subscription not found');
  }
  if (!subscription.stripeSubscriptionId.startsWith('sub_')) {
    throw new AppError(400, 'Cannot pause a subscription that is not yet fully active in Stripe');
  }

  // Tell Stripe to pause collection
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    pause_collection: { behavior: 'void' }
  });

  const result = await prisma.subscription.update({
    where: { id },
    data: { status: 'PAUSED' }
  });

  return result;
};

const resumeSubscription = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.findUnique({ where: { id, userId } });
  if (!subscription) {
    throw new AppError(404, 'Subscription not found');
  }
  if (!subscription.stripeSubscriptionId.startsWith('sub_')) {
    throw new AppError(400, 'Cannot resume a subscription that is not yet fully active in Stripe');
  }

  // Tell Stripe to resume collection
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    pause_collection: ''
  });

  const result = await prisma.subscription.update({
    where: { id },
    data: { status: 'ACTIVE' }
  });

  return result;
};

export const SubscriptionService = {
  createSubscription,
  getMySubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionStatus,
  deleteSubscription,
  pauseSubscription,
  resumeSubscription
};
