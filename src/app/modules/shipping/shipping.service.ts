import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import { ShippingMethod, ShippingRule } from '@prisma/client';

export type EstimateShippingPayload = {
  items: Array<{ productVariantId: string; quantity: number; isSubscription?: boolean }>;
  country?: string;
  state?: string;
  zipCode?: string;
};

const getEstimate = async (payload: EstimateShippingPayload) => {
  // 1. Calculate cart totals
  let totalValue = 0;
  let totalWeight = 0;
  let totalItems = 0;
  let hasSubscription = false;

  for (const item of payload.items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.productVariantId }
    });

    if (!variant) {
      throw new AppError(404, `Product variant not found: ${item.productVariantId}`);
    }

    let backendPrice = variant.price;
    if (item.isSubscription && variant.subscriptionEligible && variant.subscriptionDiscount) {
      backendPrice = backendPrice * (1 - (variant.subscriptionDiscount / 100));
    }

    totalValue += backendPrice * item.quantity;
    totalWeight += (variant.weight || 0) * item.quantity;
    totalItems += item.quantity;
    
    if (item.isSubscription) {
      hasSubscription = true;
    }
  }

  // 2. Fetch all active methods and their active rules
  const methods = await prisma.shippingMethod.findMany({
    where: { isActive: true },
    include: {
      rules: {
        where: { isActive: true },
        orderBy: { priority: 'desc' } // Higher priority first
      }
    }
  });

  const availableMethods = [];

  for (const method of methods) {
    let matchedRule: ShippingRule | null = null;

    // Find the first rule that matches all constraints
    for (const rule of method.rules) {
      let isMatch = true;

      if (rule.minOrderTotal !== null && totalValue < rule.minOrderTotal) isMatch = false;
      if (rule.maxOrderTotal !== null && totalValue > rule.maxOrderTotal) isMatch = false;
      
      if (rule.minWeight !== null && totalWeight < rule.minWeight) isMatch = false;
      if (rule.maxWeight !== null && totalWeight > rule.maxWeight) isMatch = false;
      
      if (rule.minItems !== null && totalItems < rule.minItems) isMatch = false;
      if (rule.maxItems !== null && totalItems > rule.maxItems) isMatch = false;

      // Destination constraints
      if (rule.targetCountries.length > 0) {
        if (!payload.country || !rule.targetCountries.includes(payload.country)) isMatch = false;
      }
      if (rule.targetStates.length > 0) {
        if (!payload.state || !rule.targetStates.includes(payload.state)) isMatch = false;
      }
      if (rule.targetZipCodes.length > 0) {
        if (!payload.zipCode || !rule.targetZipCodes.includes(payload.zipCode)) isMatch = false;
      }

      // Subscription constraint
      if (rule.isForSubscription !== null) {
        if (rule.isForSubscription !== hasSubscription) isMatch = false;
      }

      if (isMatch) {
        matchedRule = rule;
        break;
      }
    }

    if (matchedRule) {
      let cost = 0;
      if (matchedRule.actionType === 'SET_PRICE') {
        cost = matchedRule.actionValue || 0;
      } else if (matchedRule.actionType === 'FREE_SHIPPING') {
        cost = 0;
      } else if (matchedRule.actionType === 'PERCENTAGE_OFF') {
        cost = matchedRule.actionValue || 0; // fallback
      }

      availableMethods.push({
        methodId: method.id,
        name: method.name,
        description: method.description,
        estimatedDeliveryTime: method.estimatedDeliveryTime,
        cost,
        ruleApplied: matchedRule.name
      });
    }
  }

  // Generate marketing message (e.g. "You're only $8.50 away from FREE Shipping")
  let message = '';
  const allFreeShippingRules = await prisma.shippingRule.findMany({
    where: { 
      isActive: true, 
      actionType: 'FREE_SHIPPING',
      minOrderTotal: { not: null, gt: totalValue }
    },
    orderBy: { minOrderTotal: 'asc' }
  });

  if (allFreeShippingRules.length > 0) {
    const nextGoal = allFreeShippingRules[0].minOrderTotal!;
    const diff = (nextGoal - totalValue).toFixed(2);
    message = `You're only $${diff} away from FREE Shipping.`;
  }

  return {
    methods: availableMethods,
    message
  };
};

const getCalculateCost = async (shippingMethodId: string, payload: EstimateShippingPayload): Promise<{ cost: number; methodName: string }> => {
  const estimate = await getEstimate(payload);
  const selectedMethod = estimate.methods.find(m => m.methodId === shippingMethodId);
  
  if (!selectedMethod) {
    throw new AppError(400, 'Selected shipping method is not valid or available for this order.');
  }

  return {
    cost: selectedMethod.cost,
    methodName: selectedMethod.name
  };
};

export const ShippingService = {
  getEstimate,
  getCalculateCost
};
