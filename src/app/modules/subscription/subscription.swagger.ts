import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { SubscriptionValidation } from './subscription.validation';
import { createErrorResponse, createSuccessResponse, Error400, Error401, Error403, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerSubscriptionSwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  const SubscriptionSchema = z.object({
    id: z.string(),
    stripeSubscriptionId: z.string(),
    userId: z.string(),
    productVariantId: z.string(),
    status: z.string(),
    frequency: z.string(),
    startingDate: z.string(),
    nextBillingDate: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/subscriptions',
    tags: ['Subscriptions'],
    summary: 'Create a new subscription',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              productVariantId: z.string(),
              frequency: z.string()
            })
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(SubscriptionSchema, 'Subscription created successfully', 'Subscription created successfully.'),
      400: Error400,
      401: Error401,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/subscriptions/me',
    tags: ['Subscriptions'],
    summary: 'Get my subscriptions',
    security: [{ [bearerAuth.name]: [] }],
    responses: {
      200: createSuccessResponse(z.array(SubscriptionSchema), 'Subscriptions retrieved successfully', 'Subscriptions retrieved successfully.'),
      401: Error401,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/subscriptions',
    tags: ['Subscriptions'],
    summary: 'Get all subscriptions (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    responses: {
      200: createSuccessResponse(z.array(SubscriptionSchema), 'All subscriptions retrieved successfully', 'All subscriptions retrieved successfully.'),
      401: Error401,
      403: Error403,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/subscriptions/{id}',
    tags: ['Subscriptions'],
    summary: 'Get subscription by ID',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() })
    },
    responses: {
      200: createSuccessResponse(SubscriptionSchema, 'Subscription retrieved successfully', 'Subscription retrieved successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/subscriptions/{id}/status',
    tags: ['Subscriptions'],
    summary: 'Update subscription status (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: {
          'application/json': {
            schema: (SubscriptionValidation.updateSubscriptionStatus as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(SubscriptionSchema, 'Subscription status updated successfully', 'Subscription status updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });
};
