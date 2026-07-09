import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import stripe from '../../utils/stripe';
import config from '../../config';
import type { ICreateOrderPayload, IUpdateOrderStatusPayload, IUpdateOrderTrackingPayload } from './order.interface';

// Generate a random order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `#ORD-${timestamp}-${random}`;
};

const createOrder = async (userId: string, payload: ICreateOrderPayload) => {
  const orderNumber = generateOrderNumber();
  // 1. Fetch all product variants from database to get REAL prices and stock
  const variantIds = payload.items.map(item => item.productVariantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } }
  });

  let calculatedSubtotal = 0;
  const orderItemsData: { productVariantId: string; quantity: number; price: number }[] = [];

  // 2. Validate stock and calculate true subtotal
  for (const item of payload.items) {
    const variant = variants.find(v => v.id === item.productVariantId);
    if (!variant) {
      throw new AppError(404, `Product variant not found: ${item.productVariantId}`);
    }

    if (variant.stock < item.quantity) {
      throw new AppError(400, `Insufficient stock for ${variant.name}. Available: ${variant.stock}, Requested: ${item.quantity}`);
    }

    // ALWAYS use the price from the database, ignore frontend payload price!
    let backendPrice = variant.price;
    
    // Apply subscription discount if applicable
    if (item.isSubscription && variant.subscriptionEligible && variant.subscriptionDiscount) {
      backendPrice = backendPrice * (1 - (variant.subscriptionDiscount / 100));
    }

    calculatedSubtotal += backendPrice * item.quantity;

    orderItemsData.push({
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      price: backendPrice,
      ...(item.isSubscription && item.frequency ? {
        isSubscription: true,
        frequency: item.frequency
      } : {})
    });
  }

  const shippingConfig = await prisma.shippingConfig.findFirst();
  let calculatedShippingCost = shippingConfig ? shippingConfig.flatRate : 0;

  if (shippingConfig && calculatedSubtotal >= shippingConfig.freeShippingThreshold) {
    calculatedShippingCost = 0; // Free shipping if subtotal exceeds threshold
  }

  // 4. Handle Coupon Calculation
  let discountAmount = 0;
  let appliedCouponId: string | undefined = undefined;

  if (payload.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: { code: { equals: payload.couponCode, mode: 'insensitive' } }
    });

    if (coupon && coupon.isActive) {
      const isValidMinOrder = !coupon.minOrderValue || calculatedSubtotal >= coupon.minOrderValue;
      const isValidFrom = !coupon.validFrom || new Date(coupon.validFrom) <= new Date();
      const isValidUntil = !coupon.validUntil || new Date(coupon.validUntil) >= new Date();

      if (isValidMinOrder && isValidFrom && isValidUntil) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        // Prevent negative total
        if (discountAmount > calculatedSubtotal) {
          discountAmount = calculatedSubtotal;
        }

        appliedCouponId = coupon.id;
      }
    }
  }

  const calculatedTotal = Math.max(0, calculatedSubtotal + calculatedShippingCost - discountAmount);

  // 5. Use Database Transaction to create order AND deduct stock atomically
  const result = await prisma.$transaction(async (tx) => {
    // Deduct stock for each item
    for (const item of payload.items) {
      await tx.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    // Create the order with system-calculated values
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        subtotal: calculatedSubtotal,
        shippingCost: calculatedShippingCost,
        total: calculatedTotal,
        shippingFirstName: payload.shippingAddress.firstName,
        shippingLastName: payload.shippingAddress.lastName,
        shippingStreetAddress: payload.shippingAddress.streetAddress,
        shippingCity: payload.shippingAddress.city,
        shippingState: payload.shippingAddress.state,
        shippingPostalCode: payload.shippingAddress.postalCode,
        shippingCountry: payload.shippingAddress.country,
        shippingPhone: payload.shippingAddress.phone,
        // We do not have discount/coupon field in order schema yet, so we just save the final calculated values
        items: {
          create: orderItemsData
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

    // Increment coupon usage if applied
    if (appliedCouponId) {
      await tx.coupon.update({
        where: { id: appliedCouponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    return order;
  });

  // Create Stripe Checkout Session
  const lineItems = orderItemsData.map(item => {
    const variant = variants.find(v => v.id === item.productVariantId);
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: variant?.name || 'Product Variant',
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    };
  });

  if (calculatedShippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Shipping Cost' },
        unit_amount: Math.round(calculatedShippingCost * 100),
      },
      quantity: 1,
    });
  }

  // Create Stripe Coupon dynamically for this session if there's a discount
  let stripeCouponId: string | undefined;
  if (discountAmount > 0) {
    const stripeCoupon = await stripe.coupons.create({
      amount_off: Math.round(discountAmount * 100),
      currency: 'usd',
      duration: 'once',
      name: payload.couponCode?.toUpperCase(),
    });
    stripeCouponId = stripeCoupon.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : undefined,
    success_url: `${config.stripe.frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.frontendUrl}/payment-cancel`,
    metadata: {
      orderId: result.id
    }
  });

  return {
    ...result,
    checkoutUrl: session.url
  };
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
    .search(['orderNumber'])
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
