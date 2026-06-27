import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { ProductValidation } from './product.validation';
import { createErrorResponse, createSuccessResponse, Error400, Error401, Error403, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerProductSwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  const ProductVariantSchema = z.object({
    id: z.string(),
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    stock: z.number(),
    subscriptionEligible: z.boolean(),
    subscriptionDiscount: z.number(),
    stripePriceId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
  });

  const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    images: z.array(z.string()).openapi({ example: ['https://example.com/image1.png', 'https://example.com/image2.png'] }),
    accordionDetails: z.any().nullable().openapi({
      example: [
        {
          title: 'Product Introduction',
          content: 'ZilkyWipes replaces toilet paper with something gentler, cleaner, and far more human. A soft, biodegradable wet wipe designed for real bathrooms and real bodies.'
        },
        {
          title: 'What you\'re actually using',
          content: 'A skin-safe wet wipe roll that focuses on comfort and consistency with materials chosen for daily use.'
        },
        {
          title: 'Materials',
          content: '100% plant-based, flushable, and soothing ingredients.'
        },
        {
          title: 'Benefits',
          content: 'Gentle on skin, environmentally friendly, and fits standard toilet paper holders.'
        }
      ]
    }),
    isFeatured: z.boolean(),
    categoryId: z.string(),
    tagId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    variants: z.array(ProductVariantSchema).optional()
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/products',
    tags: ['Products'],
    summary: 'Create a new product',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'string',
                  description: 'JSON string of product data',
                  example: JSON.stringify({
                    name: 'Zilky Wipes',
                    description: 'Premium Cleansing Wipes',
                    isFeatured: true,
                    categoryId: 'YOUR_CATEGORY_ID',
                    tagId: 'YOUR_TAG_ID',
                    accordionDetails: [
                      { title: 'Materials', content: '100% plant-based' }
                    ],
                    variants: [
                      { name: 'Single Roll', price: 12, stock: 100, subscriptionEligible: true, subscriptionDiscount: 15 }
                    ]
                  }, null, 2)
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  description: 'Select product images to upload'
                }
              },
              required: ['data', 'images']
            }
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(ProductSchema, 'Product created successfully', 'Product created successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/products',
    tags: ['Products'],
    summary: 'Get all products',
    responses: {
      200: createSuccessResponse(z.array(ProductSchema), 'Products retrieved successfully', 'Products retrieved successfully.'),
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/products/{id}',
    tags: ['Products'],
    summary: 'Get product by ID',
    request: {
      params: z.object({ id: z.string() })
    },
    responses: {
      200: createSuccessResponse(ProductSchema, 'Product retrieved successfully', 'Product retrieved successfully.'),
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/products/{id}',
    tags: ['Products'],
    summary: 'Update a product',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                data: {
                  type: 'string',
                  description: 'JSON string of product data to update',
                  example: JSON.stringify({
                    name: 'Updated Zilky Wipes',
                    description: 'Updated Description',
                    isFeatured: false
                  }, null, 2)
                },
                images: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  description: 'Select new product images to upload (optional)'
                }
              }
            }
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(ProductSchema, 'Product updated successfully', 'Product updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/products/{id}',
    tags: ['Products'],
    summary: 'Delete a product',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() })
    },
    responses: {
      200: createSuccessResponse(z.null(), 'Product deleted successfully', 'Product deleted successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/products/variants/{variantId}',
    tags: ['Products'],
    summary: 'Update a product variant',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ variantId: z.string() }),
      body: {
        content: {
          'application/json': {
            schema: (ProductValidation.updateProductVariant as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(ProductVariantSchema, 'Variant updated successfully', 'Variant updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/products/{id}/variants',
    tags: ['Products'],
    summary: 'Add a new variant to an existing product',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: {
          'application/json': {
            schema: (ProductValidation.addProductVariant as any).shape.body
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(ProductVariantSchema, 'Variant added to product successfully', 'Variant added to product successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });
};
