import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { Error400, Error401, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerShippingSwagger = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'post',
    path: '/api/v1/shipping/estimate',
    summary: 'Estimate shipping cost',
    description: 'Calculates the shipping cost based on cart items and destination address',
    tags: ['Shipping'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              items: z.array(
                z.object({
                  productVariantId: z.string().uuid(),
                  quantity: z.number().int().min(1),
                  isSubscription: z.boolean().optional(),
                })
              ).min(1),
              country: z.string().optional(),
              state: z.string().optional(),
              zipCode: z.string().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Shipping estimated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Shipping estimated successfully' }),
              data: z.object({
                methods: z.array(
                  z.object({
                    methodId: z.string().uuid(),
                    name: z.string(),
                    description: z.string().nullable().optional(),
                    estimatedDeliveryTime: z.string().nullable().optional(),
                    cost: z.number(),
                    ruleApplied: z.string(),
                  })
                ),
                message: z.string().openapi({ example: "You're only $5.00 away from FREE Shipping." }),
              }),
            }),
          },
        },
      },
      400: Error400,
      500: Error500,
    },
  });

  // Admin CRUD for Methods
  registry.registerPath({
    method: 'get',
    path: '/api/v1/shipping/methods',
    summary: 'Get all shipping methods',
    tags: ['Shipping (Admin)'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Methods retrieved' },
      401: Error401,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/shipping/methods',
    summary: 'Create shipping method',
    tags: ['Shipping (Admin)'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string(),
              description: z.string().optional(),
              estimatedDeliveryTime: z.string().optional(),
              isActive: z.boolean().optional(),
            }),
          },
        },
      },
    },
    responses: {
      201: { description: 'Shipping method created' },
      401: Error401,
    },
  });

  // Rules
  registry.registerPath({
    method: 'get',
    path: '/api/v1/shipping/rules',
    summary: 'Get all shipping rules',
    tags: ['Shipping (Admin)'],
    security: [{ bearerAuth: [] }],
    responses: {
      200: { description: 'Rules retrieved' },
      401: Error401,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/shipping/rules',
    summary: 'Create shipping rule',
    tags: ['Shipping (Admin)'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string(),
              methodId: z.string().uuid().optional(),
              isActive: z.boolean().optional(),
              priority: z.number().int().optional(),
              minOrderTotal: z.number().optional().nullable(),
              maxOrderTotal: z.number().optional().nullable(),
              minWeight: z.number().optional().nullable(),
              maxWeight: z.number().optional().nullable(),
              minItems: z.number().int().optional().nullable(),
              maxItems: z.number().int().optional().nullable(),
              targetCountries: z.array(z.string()).optional(),
              targetStates: z.array(z.string()).optional(),
              targetZipCodes: z.array(z.string()).optional(),
              isForSubscription: z.boolean().optional().nullable(),
              requiredCouponId: z.string().uuid().optional().nullable(),
              actionType: z.enum(['SET_PRICE', 'FREE_SHIPPING', 'PERCENTAGE_OFF']),
              actionValue: z.number().optional().nullable(),
            }),
          },
        },
      },
    },
    responses: {
      201: { description: 'Shipping rule created' },
      400: Error400,
      401: Error401,
    },
  });
};
