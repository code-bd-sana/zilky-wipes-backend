import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createSuccessResponse, Error400, Error401, Error500 } from '../../utils/swaggerHelpers';

export const registerUploadSwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  registry.registerPath({
    method: 'post',
    path: '/api/v1/uploads/{pageName}',
    tags: ['Uploads'],
    summary: 'Upload images or files',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({
        pageName: z.string().openapi({ example: 'products', description: 'Directory name like products, users, or any crm folder' })
      }),
      body: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                files: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  description: 'Select images or videos to upload (Max 10)'
                }
              },
              required: ['files']
            }
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(z.array(z.string()), 'Files uploaded successfully', 'Files uploaded successfully.'),
      400: Error400,
      401: Error401,
      500: Error500
    }
  });
};
