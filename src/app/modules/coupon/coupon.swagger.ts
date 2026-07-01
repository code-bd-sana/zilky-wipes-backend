import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { CouponValidation } from './coupon.validation';
import { createErrorResponse, createSuccessResponse, Error400, Error401, Error403, Error404, Error500 } from '../../utils/swaggerHelpers';

export const registerCouponSwagger = (registry: OpenAPIRegistry, bearerAuth: any) => {
  const CouponSchema = z.object({
    id: z.string(),
    code: z.string(),
    discountType: z.string(),
    discountValue: z.number(),
    minOrderValue: z.number().nullable(),
    maxDiscount: z.number().nullable(),
    validFrom: z.string(),
    validUntil: z.string().nullable(),
    isActive: z.boolean(),
    usageLimit: z.number().nullable(),
    usedCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string()
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/coupons',
    tags: ['Coupons'],
    summary: 'Create a new coupon',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: (CouponValidation.createCoupon as any).shape.body
          }
        }
      }
    },
    responses: {
      201: createSuccessResponse(CouponSchema, 'Coupon created successfully', 'Coupon created successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/coupons',
    tags: ['Coupons'],
    summary: 'Get all coupons (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    responses: {
      200: createSuccessResponse(z.array(CouponSchema), 'Coupons retrieved successfully', 'Coupons retrieved successfully.'),
      401: Error401,
      403: Error403,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/coupons/code/{code}',
    tags: ['Coupons'],
    summary: 'Get coupon by code',
    request: {
      params: z.object({ code: z.string() })
    },
    responses: {
      200: createSuccessResponse(CouponSchema, 'Coupon retrieved successfully', 'Coupon retrieved successfully.'),
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/coupons/{id}',
    tags: ['Coupons'],
    summary: 'Get coupon by ID (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() })
    },
    responses: {
      200: createSuccessResponse(CouponSchema, 'Coupon retrieved successfully', 'Coupon retrieved successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/coupons/{id}',
    tags: ['Coupons'],
    summary: 'Update coupon (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: {
          'application/json': {
            schema: (CouponValidation.updateCoupon as any).shape.body
          }
        }
      }
    },
    responses: {
      200: createSuccessResponse(CouponSchema, 'Coupon updated successfully', 'Coupon updated successfully.'),
      400: Error400,
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/coupons/{id}',
    tags: ['Coupons'],
    summary: 'Delete coupon (Admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: z.object({ id: z.string() })
    },
    responses: {
      200: createSuccessResponse(CouponSchema, 'Coupon deleted successfully', 'Coupon deleted successfully.'),
      401: Error401,
      403: Error403,
      404: Error404,
      500: Error500
    }
  });
};
