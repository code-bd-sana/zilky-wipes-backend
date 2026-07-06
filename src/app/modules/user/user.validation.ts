import { z } from 'zod';

const changeRole = z.object({
  body: z
    .object({
      role: z.enum(['USER', 'ADMIN'], {
        message: 'Invalid role. Must be USER or ADMIN.'
      })
    })
    .strict()
});

const updateProfile = z.object({
  body: z
    .object({
      firstName: z.string().min(2, 'First name must be at least 2 characters long.').optional(),
      lastName: z.string().min(2, 'Last name must be at least 2 characters long.').optional(),
      username: z.string().min(3, 'Username must be at least 3 characters long.').optional(),
      email: z
        .string()
        .trim()
        .email('Email must be a valid email address.')
        .transform((value) => value.toLowerCase())
        .optional()
    })
    .strict()
});

export const UserValidation = {
  changeRole,
  updateProfile
};
