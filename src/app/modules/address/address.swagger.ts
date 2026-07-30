import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { AddressValidation } from './address.validation';
import { createErrorResponse, createSuccessResponse, Error400, Error401, Error403, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerAddressSwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  const AddressSchema = z.object({
    id: z.string().openapi({ example: 'uuid-1234' }),
    userId: z.string().openapi({ example: 'user-uuid' }),
    firstName: z.string().openapi({ example: 'John' }),
    lastName: z.string().openapi({ example: 'Doe' }),
    streetAddress: z.string().openapi({ example: '123 Main St' }),
    city: z.string().openapi({ example: 'New York' }),
    state: z.string().openapi({ example: 'NY' }),
    postalCode: z.string().openapi({ example: '10001' }),
    country: z.string().openapi({ example: 'USA' }),
    phone: z.string().optional().openapi({ example: '+1234567890' }),
    isDefault: z.boolean().openapi({ example: true }),
    createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' }),
    updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/addresses',
    tags: ['Addresses'],
    summary: 'Create a new address',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: (AddressValidation.createAddress as any).shape.body
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(AddressSchema, 'Address created successfully', 'Address created successfully.'),
      400: Error400,
      401: Error401,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/addresses',
    tags: ['Addresses'],
    summary: 'Get my addresses',
    security: [{ [bearerAuth.name]: [] }],
    responses: {
      200: createSuccessResponse(z.array(AddressSchema), 'Addresses retrieved successfully', 'Addresses retrieved successfully.'),
      401: Error401,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/addresses/{id}',
    tags: ['Addresses'],
    summary: 'Update an address',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Address ID', example: 'uuid-1234' })
      }),
      body: {
        content: {
          'application/json': {
            schema: (AddressValidation.updateAddress as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(AddressSchema, 'Address updated successfully', 'Address updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/addresses/{id}',
    tags: ['Addresses'],
    summary: 'Delete an address',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Address ID', example: 'uuid-1234' })
      })
    },
    responses: {
      200: createSuccessResponse(z.null(), 'Address deleted successfully', 'Address deleted successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });
};
