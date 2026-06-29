import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CategoryValidation } from './category.validation';
import { createErrorResponse, createSuccessResponse, Error400, Error401, Error403, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerCategorySwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  const CategorySchema = z.object({
    id: z.string().openapi({ example: 'uuid-1234' }),
    name: z.string().openapi({ example: 'Starter Kit' }),
    slug: z.string().openapi({ example: 'starter-kit' }),
    description: z.string().optional().openapi({ example: 'This is a starter kit category' }),
    createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' }),
    updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/categories',
    tags: ['Categories'],
    summary: 'Create a new category',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: (CategoryValidation.createCategory as any).shape.body
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(CategorySchema, 'Category created successfully', 'Category created successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      409: createErrorResponse(409, 'Category with this name already exists.'),
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/categories',
    tags: ['Categories'],
    summary: 'Get all categories',
    responses: {
      200: createSuccessResponse(z.array(CategorySchema), 'Categories retrieved successfully', 'Categories retrieved successfully.'),
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/categories/{id}',
    tags: ['Categories'],
    summary: 'Get a category by ID',
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Category ID', example: 'uuid-1234' })
      })
    },
    responses: {
      200: createSuccessResponse(CategorySchema, 'Category retrieved successfully', 'Category retrieved successfully.'),
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/categories/{id}',
    tags: ['Categories'],
    summary: 'Update a category',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Category ID', example: 'uuid-1234' })
      }),
      body: {
        content: {
          'application/json': {
            schema: (CategoryValidation.updateCategory as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(CategorySchema, 'Category updated successfully', 'Category updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      409: createErrorResponse(409, 'Category with this name already exists.'),
      500: Error500
    }
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/categories/{id}',
    tags: ['Categories'],
    summary: 'Delete a category',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Category ID', example: 'uuid-1234' })
      })
    },
    responses: {
      200: createSuccessResponse(z.null(), 'Category deleted successfully', 'Category deleted successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });
};
