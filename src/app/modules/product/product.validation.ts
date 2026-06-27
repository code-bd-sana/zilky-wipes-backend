import { z } from 'zod';

const createProductVariant = z.object({
  name: z.string({ required_error: 'Variant name is required' }),
  price: z.number({ required_error: 'Price is required' }).min(0),
  stock: z.number({ required_error: 'Stock is required' }).int().min(0),
  subscriptionEligible: z.boolean().optional(),
  subscriptionDiscount: z.number().min(0).max(1).optional()
});

const createProduct = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    description: z.string({ required_error: 'Description is required' }),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    accordionDetails: z.any().optional(),
    isFeatured: z.boolean().optional(),
    categoryId: z.string({ required_error: 'Category ID is required' }),
    tagId: z.string().optional(),
    variants: z.array(createProductVariant).min(1, 'At least one variant is required')
  })
});

const updateProduct = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    accordionDetails: z.any().optional(),
    isFeatured: z.boolean().optional(),
    categoryId: z.string().optional(),
    tagId: z.string().optional()
  })
});

const updateProductVariant = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    subscriptionEligible: z.boolean().optional(),
    subscriptionDiscount: z.number().min(0).max(1).optional()
  })
});

export const ProductValidation = {
  createProduct,
  updateProduct,
  updateProductVariant
};
