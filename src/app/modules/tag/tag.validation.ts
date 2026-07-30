import { z } from 'zod';

const createTag = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required.' })
  }).strict()
});

const updateTag = z.object({
  body: z.object({
    name: z.string().optional()
  }).strict()
});

export const TagValidation = {
  createTag,
  updateTag
};
