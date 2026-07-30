import { z } from 'zod';

const createPageZodSchema = z.object({
  body: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional()
  })
});

const upsertSectionZodSchema = z.object({
  body: z.object({
    content: z.any()
  })
});

export const PageValidation = {
  createPageZodSchema,
  upsertSectionZodSchema
};
