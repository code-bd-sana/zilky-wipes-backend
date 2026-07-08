import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const createProductVariant = z.object({
  name: z.string({ message: 'Variant name is required' }),
  price: z.number({ message: 'Price is required' }).min(0),
  stock: z.number({ message: 'Stock is required' }).int().min(0),
  subscriptionEligible: z.boolean().optional(),
  subscriptionDiscount: z.number().min(0).max(100).optional().openapi({ example: 15 }),
  stripePriceId: z.string().nullable().optional().openapi({ example: 'price_1Pqwertyuiop' })
});

const createProduct = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    description: z.string({ message: 'Description is required' }),
    images: z.array(z.string()).min(1, 'At least one image is required').openapi({ example: ['https://example.com/image1.png'] }),
    accordionDetails: z.any().optional().openapi({
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
    isFeatured: z.boolean().optional(),
    categoryId: z.string().optional(), // Keeping for backward compatibility temporarily if needed, but not required
    categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
    tagIds: z.array(z.string()).optional(),
    variants: z.array(createProductVariant).min(1, 'At least one variant is required')
  })
});

const updateProduct = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional().openapi({ example: ['https://example.com/image1.png'] }),
    accordionDetails: z.any().optional().openapi({
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
    isFeatured: z.boolean().optional(),
    categoryIds: z.array(z.string()).optional(),
    tagIds: z.array(z.string()).optional(),
    variants: z.array(z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      price: z.number().min(0).optional(),
      stock: z.number().int().min(0).optional(),
      subscriptionEligible: z.boolean().optional(),
      subscriptionDiscount: z.number().min(0).max(100).optional(),
      stripePriceId: z.string().nullable().optional()
    })).optional()
  })
});

const updateProductVariant = z.object({
  body: z.object({
    name: z.string().optional().openapi({ example: 'Single Roll' }),
    price: z.number().min(0).optional().openapi({ example: 12.00 }),
    stock: z.number().int().min(0).optional().openapi({ example: 150 }),
    subscriptionEligible: z.boolean().optional().openapi({ example: true }),
    subscriptionDiscount: z.number().min(0).max(100).optional().openapi({ example: 15 }),
    stripePriceId: z.string().nullable().optional().openapi({ example: 'price_1Pqwertyuiop' })
  })
});

const addProductVariant = z.object({
  body: createProductVariant
});

export const ProductValidation = {
  createProduct,
  updateProduct,
  updateProductVariant,
  addProductVariant
};
