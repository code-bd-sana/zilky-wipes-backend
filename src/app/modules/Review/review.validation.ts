import { z } from 'zod';

const createReview = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z
      .number()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    comment: z.string().optional(),
    images: z.array(z.string()).optional(),
  }),
});

export const ReviewValidation = {
  createReview,
};
