import { z } from 'zod';

const createAddress = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    streetAddress: z.string({ required_error: 'Street address is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
    postalCode: z.string({ required_error: 'Postal code is required' }),
    country: z.string({ required_error: 'Country is required' }),
    phone: z.string().optional(),
    isDefault: z.boolean().optional()
  })
});

const updateAddress = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    streetAddress: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
    isDefault: z.boolean().optional()
  })
});

export const AddressValidation = {
  createAddress,
  updateAddress
};
