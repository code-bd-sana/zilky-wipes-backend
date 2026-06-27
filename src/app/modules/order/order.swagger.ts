import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { OrderValidation } from './order.validation';
import { createErrorResponse, createSuccessResponse, Error400, Error401, Error403, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerOrderSwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  const OrderSchema = z.object({
    id: z.string(),
    orderNumber: z.string(),
    userId: z.string().nullable(),
    status: z.string(),
    subtotal: z.number(),
    shippingCost: z.number(),
    total: z.number(),
    trackingNumber: z.string().nullable(),
    paymentIntentId: z.string().nullable(),
    shippingFirstName: z.string(),
    shippingLastName: z.string(),
    shippingStreetAddress: z.string(),
    shippingCity: z.string(),
    shippingState: z.string(),
    shippingPostalCode: z.string(),
    shippingCountry: z.string(),
    shippingPhone: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/orders',
    tags: ['Orders'],
    summary: 'Create a new order',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: (OrderValidation.createOrder as any).shape.body
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(OrderSchema, 'Order created successfully', 'Order created successfully.'),
      400: Error400,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/orders/me',
    tags: ['Orders'],
    summary: 'Get my orders',
    security: [{ [bearerAuth.name]: [] }],
    responses: {
      200: createSuccessResponse(z.array(OrderSchema), 'Orders retrieved successfully', 'Orders retrieved successfully.'),
      401: Error401,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/orders',
    tags: ['Orders'],
    summary: 'Get all orders (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    responses: {
      200: createSuccessResponse(z.array(OrderSchema), 'All orders retrieved successfully', 'All orders retrieved successfully.'),
      401: Error401,
      403: Error403,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/orders/{id}',
    tags: ['Orders'],
    summary: 'Get order by ID',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() })
    },
    responses: {
      200: createSuccessResponse(OrderSchema, 'Order retrieved successfully', 'Order retrieved successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/orders/{id}/status',
    tags: ['Orders'],
    summary: 'Update order status (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: {
          'application/json': {
            schema: (OrderValidation.updateOrderStatus as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(OrderSchema, 'Order status updated successfully', 'Order status updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/orders/{id}/tracking',
    tags: ['Orders'],
    summary: 'Update order tracking (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: {
          'application/json': {
            schema: (OrderValidation.updateOrderTracking as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(OrderSchema, 'Order tracking updated successfully', 'Order tracking updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });
};
