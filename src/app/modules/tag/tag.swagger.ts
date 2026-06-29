import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { TagValidation } from './tag.validation';
import { createErrorResponse, createSuccessResponse, Error400, Error401, Error403, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerTagSwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  const TagSchema = z.object({
    id: z.string().openapi({ example: 'uuid-5678' }),
    name: z.string().openapi({ example: 'Eco-Friendly' }),
    slug: z.string().openapi({ example: 'eco-friendly' }),
    createdAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' }),
    updatedAt: z.string().openapi({ example: '2023-01-01T00:00:00.000Z' })
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/tags',
    tags: ['Tags'],
    summary: 'Create a new tag',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: (TagValidation.createTag as any).shape.body
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(TagSchema, 'Tag created successfully', 'Tag created successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      409: createErrorResponse(409, 'Tag with this name already exists.'),
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/tags',
    tags: ['Tags'],
    summary: 'Get all tags',
    responses: {
      200: createSuccessResponse(z.array(TagSchema), 'Tags retrieved successfully', 'Tags retrieved successfully.'),
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/tags/{id}',
    tags: ['Tags'],
    summary: 'Get a tag by ID',
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Tag ID', example: 'uuid-5678' })
      })
    },
    responses: {
      200: createSuccessResponse(TagSchema, 'Tag retrieved successfully', 'Tag retrieved successfully.'),
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/tags/{id}',
    tags: ['Tags'],
    summary: 'Update a tag',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Tag ID', example: 'uuid-5678' })
      }),
      body: {
        content: {
          'application/json': {
            schema: (TagValidation.updateTag as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(TagSchema, 'Tag updated successfully', 'Tag updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      409: createErrorResponse(409, 'Tag with this name already exists.'),
      500: Error500
    }
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/tags/{id}',
    tags: ['Tags'],
    summary: 'Delete a tag',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({
        id: z.string().openapi({ description: 'Tag ID', example: 'uuid-5678' })
      })
    },
    responses: {
      200: createSuccessResponse(z.null(), 'Tag deleted successfully', 'Tag deleted successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });
};
